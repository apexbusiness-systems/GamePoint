//! Service config with serde validation (Zod-equivalent discipline at the boundary).
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct SvcConfig {
    pub assist_endpoint: String,
    pub session_id: String,
    /// slug hints keyed by lowercase process name, e.g. "pathofexile2.exe".
    pub title_hints: std::collections::BTreeMap<String, String>,
    pub jpeg_quality: u8,
    pub max_retries: u32,
    pub offline_queue_capacity: usize,
    pub hot_path_budget_ms: u64,
}

impl Default for SvcConfig {
    fn default() -> Self {
        Self {
            assist_endpoint: String::new(),
            session_id: String::new(),
            title_hints: Default::default(),
            jpeg_quality: 80,
            max_retries: 2,
            offline_queue_capacity: 32,
            hot_path_budget_ms: 50,
        }
    }
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum ConfigError {
    #[error("assist_endpoint must be https")]
    InsecureEndpoint,
    #[error("session_id must be a UUID")]
    BadSessionId,
    #[error("jpeg_quality must be 1..=100")]
    BadQuality,
}

impl SvcConfig {
    pub fn parse(json: &str) -> Result<Self, String> {
        let config: Self = serde_json::from_str(json).map_err(|e| e.to_string())?;
        config.validate().map_err(|e| e.to_string())?;
        Ok(config)
    }

    pub fn validate(&self) -> Result<(), ConfigError> {
        if !self.assist_endpoint.starts_with("https://") {
            return Err(ConfigError::InsecureEndpoint);
        }
        let id = &self.session_id;
        let uuid_shape = id.len() == 36
            && id.chars().enumerate().all(|(i, c)| match i {
                8 | 13 | 18 | 23 => c == '-',
                _ => c.is_ascii_hexdigit(),
            });
        if !uuid_shape {
            return Err(ConfigError::BadSessionId);
        }
        if self.jpeg_quality == 0 || self.jpeg_quality > 100 {
            return Err(ConfigError::BadQuality);
        }
        Ok(())
    }
}
