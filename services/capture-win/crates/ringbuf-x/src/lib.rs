//! SPSC metadata/audio ring buffers wrapping the `ringbuf` crate (WP-5).
//!
//! Compliance (Contract §1.1): OS-level frame capture only. This crate must
//! never read foreign process memory, inject code, hook foreign processes,
//! synthesize input, or open kernel devices — enforced repo-wide by
//! `governance/ci/compliance-gate.sh`. `unsafe` is permitted only in the
//! capture FFI layer, with a safety comment per block.
