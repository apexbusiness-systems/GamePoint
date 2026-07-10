# Current state — verified 2026-07-09

**Baseline:** branch `feat/a3-a4-session-handoff-assist-hardening` (PR #10) on top of main `ed1cd8e`.

## What is live in production (all live-verified, evidence in docs/evidence/wp-a3-a4.md)
- Supabase project `nbgofxqominofaghbxje` (ca-central-1, PG 17.6): migrations 001–008 applied;
  RLS on across the user plane; 12 policies + `realtime.session_channel_recv`.
- Edge Functions deployed: `assist` (own-JWT mode), `ingest-webhook`, `retrieval-plan`.
- Full coaching loop proven with real traffic: auth taxonomy (405/401/400/403×2/429),
  RLS session insert, request_id correlation (body + header + DB rows), private Realtime
  broadcast received with matching request_id.
- Hybrid providers (ADR-009): Groq Llama 4 Scout primary (real advice verified),
  Gemini flash-lite fallback (forced-failover verified), adaptive health circuit
  (cooldown on network/429/5xx, auto-recovery). Gemini embeddings enabled and
  verified at 1536 dims — retrieval unblocks once a corpus is ingested (embeddings table currently empty).
- Web deploy: Cloudflare Workers (canonical host gamepointagent.com), GPA wordmark branding.

## Registry (live DB, matches governance/compliance-matrix.md)
16 titles; runtime-eligible: path-of-exile-2, baldurs-gate-3, elden-ring-nightreign,
monster-hunter-wilds, warframe. Terraria cleared registry-only. GTA legal_review.

## Known gaps / next milestones
1. Evidence corpus: ingest licensed sources → embeddings → verified advice with evidence_ids.
2. Phase-4 hardware proof: Windows DXGI hotkey capture → live loop → HUD.
3. Rust dispatch may set `request_id`/`client_version` client-side (fields exist, currently None).
4. GA blockers: paid model tiers + data-controls legal review; credential rotation after
   the 2026-07-09 engagement (all ENV-file credentials transited plaintext).
