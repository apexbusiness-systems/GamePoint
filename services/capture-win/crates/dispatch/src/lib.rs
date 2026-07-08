//! HTTPS/JSON dispatch to the `assist` Edge Function (ADR-006).
//! Serde structs mirror `packages/contracts` field-for-field; parity is proven
//! against the shared golden fixtures in tests (ADR-007).
#![deny(unsafe_op_in_unsafe_fn)]
#![forbid(unsafe_code)]

use base64::Engine;
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::time::Duration;

pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct RoiDescriptor {
    pub x: u32,
    pub y: u32,
    pub w: u32,
    pub h: u32,
    pub kind: RoiKind,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RoiKind {
    Hud,
    Minimap,
    Tooltip,
    Dialog,
    DenseText,
    Other,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum HotkeyIntent {
    Assist,
    Explain,
    Recap,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct LocalObservables {
    pub process_name: String,
    pub window_title: String,
    pub title_slug_hint: Option<String>,
    pub vision_fallback: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct AssistRequest {
    pub schema_version: u32,
    pub session_id: String,
    pub title_id: String,
    pub ts_client_monotonic_ms: u64,
    pub frame_b64: String,
    pub frame_width: u32,
    pub frame_height: u32,
    pub roi_descriptors: Vec<RoiDescriptor>,
    /// ADR-003: always None in v1.0; serialized as JSON null.
    pub audio_opus_bytes: Option<()>,
    pub audio_duration_ms: u32,
    pub hotkey_intent: HotkeyIntent,
    pub local_observables: LocalObservables,
    pub blake3: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CoachingResponse {
    pub advice_text: String,
    pub recommended_action: String,
    pub evidence_ids: Vec<String>,
    pub confidence: f64,
    pub source_tier: String,
    pub not_verified: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<u64>,
}

/// Build a request from encoded frame bytes: checksum + base64 in one place.
#[allow(clippy::too_many_arguments)]
pub fn build_request(
    session_id: &str,
    title_id: &str,
    ts_client_monotonic_ms: u64,
    frame_bytes: &[u8],
    frame_width: u32,
    frame_height: u32,
    roi_descriptors: Vec<RoiDescriptor>,
    hotkey_intent: HotkeyIntent,
    local_observables: LocalObservables,
) -> AssistRequest {
    AssistRequest {
        schema_version: SCHEMA_VERSION,
        session_id: session_id.to_owned(),
        title_id: title_id.to_owned(),
        ts_client_monotonic_ms,
        frame_b64: base64::engine::general_purpose::STANDARD.encode(frame_bytes),
        frame_width,
        frame_height,
        roi_descriptors,
        audio_opus_bytes: None,
        audio_duration_ms: 0,
        hotkey_intent,
        local_observables,
        blake3: blake3::hash(frame_bytes).to_hex().to_string(),
    }
}

#[derive(Debug, thiserror::Error)]
pub enum DispatchError {
    #[error("transport failed after retries: {0}")]
    Transport(String),
    #[error("server rejected request: status {0}")]
    Rejected(u16),
    #[error("response did not match contract")]
    Contract,
}

/// Transport boundary: injectable for tests, `HttpTransport` in production.
pub trait Transport {
    fn post_json(&self, body: &str) -> Result<(u16, String), String>;
}

#[cfg(feature = "http")]
pub struct HttpTransport {
    agent: ureq::Agent, // connection reuse across dispatches
    endpoint: String,
    jwt: String,
}

#[cfg(feature = "http")]
impl HttpTransport {
    pub fn new(endpoint: String, jwt: String, timeout: Duration) -> Self {
        let agent = ureq::AgentBuilder::new().timeout(timeout).build();
        Self { agent, endpoint, jwt }
    }
}

#[cfg(feature = "http")]
impl Transport for HttpTransport {
    fn post_json(&self, body: &str) -> Result<(u16, String), String> {
        match self
            .agent
            .post(&self.endpoint)
            .set("authorization", &format!("Bearer {}", self.jwt))
            .set("content-type", "application/json")
            .send_string(body)
        {
            Ok(res) => {
                let status = res.status();
                res.into_string().map(|s| (status, s)).map_err(|e| e.to_string())
            }
            Err(ureq::Error::Status(code, res)) => {
                Ok((code, res.into_string().unwrap_or_default()))
            }
            Err(e) => Err(e.to_string()),
        }
    }
}

/// Retry with jitter + bounded drop-oldest offline queue (capacity per config).
pub struct Dispatcher<T: Transport> {
    transport: T,
    max_retries: u32,
    queue_capacity: usize,
    offline_queue: VecDeque<AssistRequest>,
    /// Injectable jitter sleep so tests run instantly.
    backoff: Box<dyn Fn(u32)>,
}

impl<T: Transport> Dispatcher<T> {
    pub fn new(transport: T, max_retries: u32, queue_capacity: usize) -> Self {
        Self {
            transport,
            max_retries,
            queue_capacity: queue_capacity.max(1),
            offline_queue: VecDeque::new(),
            backoff: Box::new(|attempt| {
                let base = 200u64.saturating_mul(1 << attempt.min(4));
                let jitter = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .map(|d| d.subsec_millis() as u64 % 100)
                    .unwrap_or(0);
                std::thread::sleep(Duration::from_millis(base + jitter));
            }),
        }
    }

    #[doc(hidden)]
    pub fn with_backoff(mut self, backoff: Box<dyn Fn(u32)>) -> Self {
        self.backoff = backoff;
        self
    }

    pub fn queued(&self) -> usize {
        self.offline_queue.len()
    }

    /// Send one request; on transport failure it is queued (drop-oldest) and
    /// the error returned so the HUD can show the offline state.
    pub fn send(&mut self, request: AssistRequest) -> Result<CoachingResponse, DispatchError> {
        let body = serde_json::to_string(&request).expect("contract structs serialize");
        for attempt in 0..=self.max_retries {
            match self.transport.post_json(&body) {
                Ok((status, text)) if (200..300).contains(&status) => {
                    return serde_json::from_str(&text).map_err(|_| DispatchError::Contract);
                }
                Ok((status, _)) if status >= 500 && attempt < self.max_retries => {
                    (self.backoff)(attempt);
                }
                Ok((status, _)) => return Err(DispatchError::Rejected(status)),
                Err(_) if attempt < self.max_retries => (self.backoff)(attempt),
                Err(e) => {
                    if self.offline_queue.len() >= self.queue_capacity {
                        self.offline_queue.pop_front(); // drop-oldest
                    }
                    self.offline_queue.push_back(request);
                    return Err(DispatchError::Transport(e));
                }
            }
        }
        unreachable!("loop returns on final attempt");
    }

    /// Flush queued requests once connectivity returns; stops on first failure.
    pub fn flush(&mut self) -> usize {
        let mut sent = 0;
        while let Some(req) = self.offline_queue.pop_front() {
            if self.send(req.clone()).is_err() {
                return sent; // send() re-queued it
            }
            sent += 1;
        }
        sent
    }
}
