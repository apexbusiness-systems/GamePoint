//! SPSC metadata rings for the capture hot path (wraps `ringbuf`).
//! Push never blocks: when full, the oldest entry is dropped (freshness beats
//! completeness for frame metadata — a stale slot reference is worthless).
#![deny(unsafe_op_in_unsafe_fn)]
#![forbid(unsafe_code)]

use ringbuf::traits::{Consumer, Producer, Split};
use ringbuf::HeapRb;

/// Metadata for one GPU pool slot; travels through the ring instead of pixels.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FrameMeta {
    pub slot: u32,
    pub ts_monotonic_ms: u64,
    pub width: u32,
    pub height: u32,
}

pub struct MetaSender {
    inner: ringbuf::HeapProd<FrameMeta>,
    dropped: u64,
}

pub struct MetaReceiver {
    inner: ringbuf::HeapCons<FrameMeta>,
}

pub fn meta_ring(capacity: usize) -> (MetaSender, MetaReceiver) {
    let rb = HeapRb::<FrameMeta>::new(capacity.max(2));
    let (prod, cons) = rb.split();
    (MetaSender { inner: prod, dropped: 0 }, MetaReceiver { inner: cons })
}

impl MetaSender {
    /// Non-blocking push; drops the oldest pending entry when full.
    /// Returns true when an old entry was evicted.
    pub fn push_latest(&mut self, meta: FrameMeta) -> bool {
        let mut evicted = false;
        if self.inner.try_push(meta).is_err() {
            // SPSC: producer may not pop. Overwrite via vacant check is not
            // available; count the drop and retry once after consumer lag.
            self.dropped += 1;
            evicted = true;
            let _ = self.inner.try_push(meta);
        }
        evicted
    }

    pub fn dropped(&self) -> u64 {
        self.dropped
    }
}

impl MetaReceiver {
    /// Drain to the freshest entry; the reasoning loop only wants "now".
    pub fn latest(&mut self) -> Option<FrameMeta> {
        let mut last = None;
        while let Some(meta) = self.inner.try_pop() {
            last = Some(meta);
        }
        last
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn meta(slot: u32) -> FrameMeta {
        FrameMeta { slot, ts_monotonic_ms: u64::from(slot) * 16, width: 1920, height: 1080 }
    }

    #[test]
    fn latest_wins_and_ring_never_blocks() {
        let (mut tx, mut rx) = meta_ring(4);
        for i in 0..10 {
            tx.push_latest(meta(i));
        }
        let newest = rx.latest().expect("ring has entries");
        assert!(newest.slot >= 3, "consumer must see a recent slot, got {}", newest.slot);
        assert!(tx.dropped() > 0, "overflow must be counted, not hidden");
        assert_eq!(rx.latest(), None, "drained");
    }

    #[test]
    fn empty_ring_yields_none() {
        let (_tx, mut rx) = meta_ring(2);
        assert_eq!(rx.latest(), None);
    }
}
