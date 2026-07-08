//! ADR-007 golden-fixture parity: the Rust structs must parse and round-trip the
//! same fixtures the Zod schemas validate.
use dispatch::*;

const ASSIST_FIXTURE: &str =
    include_str!("../../../../../packages/contracts/fixtures/assist-request.json");
const RESPONSE_FIXTURE: &str =
    include_str!("../../../../../packages/contracts/fixtures/coaching-response.json");

#[test]
fn assist_request_fixture_round_trips() {
    let parsed: AssistRequest = serde_json::from_str(ASSIST_FIXTURE).expect("fixture parses");
    assert_eq!(parsed.schema_version, SCHEMA_VERSION);
    assert_eq!(parsed.roi_descriptors.len(), 2);
    assert_eq!(parsed.roi_descriptors[1].kind, RoiKind::Minimap);
    assert!(parsed.audio_opus_bytes.is_none());

    let reserialized = serde_json::to_value(&parsed).unwrap();
    let original: serde_json::Value = serde_json::from_str(ASSIST_FIXTURE).unwrap();
    assert_eq!(reserialized, original, "field-for-field parity with the Zod fixture");
}

#[test]
fn coaching_response_fixture_round_trips() {
    let parsed: CoachingResponse = serde_json::from_str(RESPONSE_FIXTURE).expect("fixture parses");
    assert_eq!(parsed.source_tier, "verified");
    let reserialized = serde_json::to_value(&parsed).unwrap();
    let original: serde_json::Value = serde_json::from_str(RESPONSE_FIXTURE).unwrap();
    assert_eq!(reserialized, original);
}

#[test]
fn build_request_computes_blake3_and_base64() {
    let frame = b"fake-jpeg-bytes";
    let req = build_request(
        "3f1c9a4e-8b2d-4f6a-9c3e-1d5b7a9e2c4f",
        "7a2b4c6d-8e1f-4a3b-9c5d-2e4f6a8b1c3d",
        42,
        frame,
        1920,
        1080,
        vec![],
        HotkeyIntent::Assist,
        LocalObservables {
            process_name: "game.exe".into(),
            window_title: "Game".into(),
            title_slug_hint: None,
            vision_fallback: true,
        },
    );
    assert_eq!(req.blake3, blake3::hash(frame).to_hex().to_string());
    assert_eq!(req.audio_duration_ms, 0);
    assert_eq!(req.frame_b64, "ZmFrZS1qcGVnLWJ5dGVz");
}

// --- Dispatcher behavior with a scripted transport --------------------------------

use std::cell::RefCell;

struct ScriptedTransport {
    script: RefCell<Vec<Result<(u16, String), String>>>,
    calls: RefCell<u32>,
}

impl Transport for ScriptedTransport {
    fn post_json(&self, _body: &str) -> Result<(u16, String), String> {
        *self.calls.borrow_mut() += 1;
        self.script.borrow_mut().remove(0)
    }
}

fn ok_response() -> (u16, String) {
    (200, RESPONSE_FIXTURE.to_string())
}

fn sample_request(id: u64) -> AssistRequest {
    let mut req: AssistRequest = serde_json::from_str(ASSIST_FIXTURE).unwrap();
    req.ts_client_monotonic_ms = id;
    req
}

fn dispatcher(script: Vec<Result<(u16, String), String>>) -> Dispatcher<ScriptedTransport> {
    Dispatcher::new(
        ScriptedTransport { script: RefCell::new(script), calls: RefCell::new(0) },
        2,
        3,
    )
    .with_backoff(Box::new(|_| {}))
}

#[test]
fn retries_5xx_then_succeeds() {
    let mut d = dispatcher(vec![Ok((503, String::new())), Ok(ok_response())]);
    let res = d.send(sample_request(1)).expect("second attempt succeeds");
    assert_eq!(res.source_tier, "verified");
}

#[test]
fn client_errors_are_not_retried() {
    let mut d = dispatcher(vec![Ok((403, String::new()))]);
    match d.send(sample_request(1)) {
        Err(DispatchError::Rejected(403)) => {}
        other => panic!("expected Rejected(403), got {other:?}"),
    }
    assert_eq!(d.queued(), 0, "rejections are final, not queued");
}

#[test]
fn offline_queue_is_bounded_drop_oldest() {
    let fail = || Err::<(u16, String), _>("connection refused".to_string());
    // 4 sends × 3 attempts each (max_retries=2) = 12 scripted failures.
    let mut d = dispatcher((0..12).map(|_| fail()).collect());
    for id in 0..4 {
        assert!(d.send(sample_request(id)).is_err());
    }
    assert_eq!(d.queued(), 3, "capacity 3, oldest dropped");
}

#[test]
fn flush_drains_queue_when_connectivity_returns() {
    let fail = || Err::<(u16, String), _>("offline".to_string());
    let mut script: Vec<_> = (0..3).map(|_| fail()).collect(); // 1 send, 3 attempts
    script.push(Ok(ok_response())); // flush succeeds
    let mut d = dispatcher(script);
    assert!(d.send(sample_request(7)).is_err());
    assert_eq!(d.queued(), 1);
    assert_eq!(d.flush(), 1);
    assert_eq!(d.queued(), 0);
}
