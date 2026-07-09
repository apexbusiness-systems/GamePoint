//! Screen capture: OS-level frame grab ONLY (Compliance Gate §1.1.1).
//! DXGI Desktop Duplication on Windows — the same capture class as OBS/Game Bar.
//! Never process injection, never memory reads, never packet hooks.
#![deny(unsafe_op_in_unsafe_fn)]

use std::time::Instant;

#[derive(Debug, thiserror::Error)]
pub enum CaptureError {
    #[error("no frame available within timeout")]
    Timeout,
    #[error("capture device lost; re-initialize")]
    DeviceLost,
    #[error("platform error: {0}")]
    Platform(String),
}

/// One captured frame, CPU-side, tightly packed BGRA8.
pub struct RawFrame {
    pub bgra: Vec<u8>,
    pub width: u32,
    pub height: u32,
    pub ts_monotonic_ms: u64,
}

/// Capture boundary: `DxgiDuplication` on Windows, `MockFrameSource` in tests.
pub trait FrameSource {
    /// Copy the most recent frame (or the given ROI) to CPU memory.
    /// Called only on hotkey — there is no continuous CPU readback (§WP-5).
    fn grab(&mut self, roi: Option<(u32, u32, u32, u32)>) -> Result<RawFrame, CaptureError>;
}

/// GPU-resident slot bookkeeping for the circular texture pool. The textures
/// themselves live in the platform layer; this tracks slots + timestamps so the
/// logic is testable everywhere.
pub struct SlotPool {
    slots: usize,
    next: usize,
    stamps_ms: Vec<Option<u64>>,
    epoch: Instant,
}

impl SlotPool {
    pub fn new(slots: usize) -> Self {
        let slots = slots.max(1);
        Self { slots, next: 0, stamps_ms: vec![None; slots], epoch: Instant::now() }
    }

    pub fn capacity(&self) -> usize {
        self.slots
    }

    pub fn now_ms(&self) -> u64 {
        self.epoch.elapsed().as_millis() as u64
    }

    /// Claim the next slot (circular overwrite) and stamp it. O(1), allocation-free:
    /// this is the hot path bookkeeping.
    pub fn stamp_next(&mut self, ts_ms: u64) -> usize {
        let slot = self.next;
        self.stamps_ms[slot] = Some(ts_ms);
        self.next = (self.next + 1) % self.slots;
        slot
    }

    /// Most recently stamped slot, if any frame has ever landed.
    pub fn freshest(&self) -> Option<(usize, u64)> {
        self.stamps_ms
            .iter()
            .enumerate()
            .filter_map(|(i, ts)| ts.map(|t| (i, t)))
            .max_by_key(|&(_, t)| t)
    }
}

/// Deterministic source for tests and non-Windows dev: renders a solid frame.
pub struct MockFrameSource {
    pub width: u32,
    pub height: u32,
    counter: u64,
}

impl MockFrameSource {
    pub fn new(width: u32, height: u32) -> Self {
        Self { width, height, counter: 0 }
    }
}

impl FrameSource for MockFrameSource {
    fn grab(&mut self, roi: Option<(u32, u32, u32, u32)>) -> Result<RawFrame, CaptureError> {
        self.counter += 1;
        let (w, h) = roi.map_or((self.width, self.height), |(_, _, rw, rh)| (rw, rh));
        Ok(RawFrame {
            bgra: vec![(self.counter % 255) as u8; (w * h * 4) as usize],
            width: w,
            height: h,
            ts_monotonic_ms: self.counter * 16,
        })
    }
}

#[cfg(windows)]
mod dxgi;
#[cfg(windows)]
pub use dxgi::DxgiDuplication;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slot_pool_is_circular_and_freshest_wins() {
        let mut pool = SlotPool::new(3);
        assert_eq!(pool.capacity(), 3);
        for ts in 1..=5u64 {
            pool.stamp_next(ts * 10);
        }
        // 5 stamps over 3 slots: slot 1 holds ts=50 (5th stamp wraps to index 1).
        assert_eq!(pool.freshest(), Some((1, 50)));
    }

    #[test]
    fn empty_pool_has_no_freshest() {
        assert_eq!(SlotPool::new(300).freshest(), None);
    }

    #[test]
    fn mock_source_honors_roi() {
        let mut src = MockFrameSource::new(1920, 1080);
        let frame = src.grab(Some((10, 10, 320, 200))).unwrap();
        assert_eq!((frame.width, frame.height), (320, 200));
        assert_eq!(frame.bgra.len(), 320 * 200 * 4);
    }
}
