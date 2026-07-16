# Current state — verified 2026-07-16

**Baseline:** branch `main` @ `7c1be66`.

## What is live in production (all live-verified, evidence in docs/evidence/wp-a3-a4.md and release-evidence/)
- Supabase project `nbgofxqominofaghbxje` (ca-central-1, PG 17.6): migrations 001–008 applied;
  RLS on across the user plane; 12 policies + `realtime.session_channel_recv`.
- Edge Functions deployed: `assist` (own-JWT mode), `ingest-webhook`, `retrieval-plan`.
- Full coaching loop proven with real traffic: auth taxonomy (405/401/400/403×2/429),
  RLS session insert, request_id correlation (body + header + DB rows), private Realtime
  broadcast received with matching request_id.
- **Strict Groq + Gemini Only Intelligence (ADR-009)**: Groq Llama 4 Scout primary (`GROQ_API_KEY`),
  Gemini Flash Lite fallback (`GEMINI_API_KEY`), adaptive health circuit (`ASSIST_ESCALATION_ALLOWED=true`
  for multi-tier verification). **OpenAI strictly excluded**: `EMBEDDINGS_PROVIDER_ORDER=gemini` eliminates
  legacy OpenAI fallbacks from the vector RAG pipeline.
- Web deploy: Cloudflare Workers (`gamepointagent.com`), GPA wordmark branding. `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` injected via Cloudflare Workers Build environment variables, unlocking
  authenticated routes (`/app`, `/app/sessions`) and resolving the runtime configuration gate.
- **INP & Performance Optimized**: Marketing site `mousemove` event handling throttled via `requestAnimationFrame`
  with scoped `ref` updates and GPU-composited CSS transforms (`translate`) replacing main-thread repaint animations.
- **Pre-Release Posture Active**: Due to the desktop overlay being undistributed, the public web CTAs reflect a "Private Beta" posture instead of implying general availability.

## Registry (live DB, matches governance/compliance-matrix.md)
16 titles; runtime-eligible: path-of-exile-2, baldurs-gate-3, elden-ring-nightreign,
monster-hunter-wilds, warframe. Terraria cleared registry-only. GTA legal_review.

## Known gaps / next milestones
1. Evidence corpus: ingest licensed sources → embeddings → verified advice with evidence_ids.
2. Phase-4 hardware proof: Windows DXGI hotkey capture → live loop → HUD (Overlay Distribution).
3. Code signing credentials: `WINDOWS_SIGNING_CERT` (Base64 PKCS#12 `.pfx`) and `WINDOWS_SIGNING_PASSWORD`
   generated and ready for GitHub Actions Repository Secrets to digitally sign Windows binaries on `v*` tags.
4. Rust dispatch may set `request_id`/`client_version` client-side (fields exist, currently None).
5. GA blockers: paid model tiers + data-controls legal review; credential rotation after
   the 2026-07-09 engagement.
6. General Release: blocked until desktop overlay is fully packaged and distributed.
