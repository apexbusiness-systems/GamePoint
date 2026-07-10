# Correction — 2026-07-09 review round (PR #10)

**User correction 1:** "invalid config = refused" must be structural, not cosmetic.
Blocking only the Realtime subscription left `Start capture` active ("Watching" under a
refused config). Resolution: reducer-level `captureLocked`; toggle structurally inert.
**Rule going forward:** UI truth-claims must be enforced in the state machine, not the view.

**User correction 2:** claiming "request_id reaches the HUD" requires the contract to carry
it — the HUD's Zod parse strips unknown fields. Resolution: `request_id` added to
`CoachingResponse` (optional). **Rule:** trace every claimed data flow through each parse
boundary before claiming it in a PR body.
