# GamePoint E2E & Production Readiness Canonical Behavior

## 1. Overlay Isolation
**Invariant:** The overlay is a read-only screen surface. It never injects into game memory, hooks packets, or reads system audio.
**Rule:** `apps/overlay` MUST remain a local-only Windows surface. No cloud frame streaming, no Cloudflare-side capture processing. See → [`docs/adr/ADR-001-overlay-host.md`](../docs/adr/ADR-001-overlay-host.md).

## 2. Frame-Only V1
**Invariant:** V1 processes single user-triggered frames, not continuous video.
**Rule:** The assist pipeline accepts one frame or ROI per invocation. Continuous capture, video streaming, and audio capture are explicitly out of scope. See → [`docs/adr/ADR-003-frame-only-v1.md`](../docs/adr/ADR-003-frame-only-v1.md).

## 3. Supabase Backend Authority
**Invariant:** Supabase is the single backend authority for auth, database, RLS, Edge Functions, retrieval, and telemetry.
**Rule:** Cloudflare Pages hosts static frontend assets ONLY. Cloudflare must not become a second backend unless explicitly approved. No duplication of assist or retrieval logic on Cloudflare. See → [`docs/adr/ADR-005-cloudflare-frontend-hosting.md`](../docs/adr/ADR-005-cloudflare-frontend-hosting.md).

## 4. Domain Canonicalization
**Invariant:** `gamepointagent.com` is the canonical production domain.
**Rule:**
- All non-canonical domains (`www.gamepointagent.com`, `game-point.icu`, `gamepointagent.ca`, `gamepointagent.icu`, `gamepointagent.info`) MUST 301 redirect to the canonical `.com`.
- No duplicate product sites across defensive domains.
- Frontend MUST include `<link rel="canonical" href="https://gamepointagent.com" />`.
- Reserved subdomains: `app.`, `download.`, `docs.`, `status.` — all under `gamepointagent.com`.

## 5. Environment Variable Exposure
**Invariant:** Server-only secrets must never appear in a browser bundle.
**Rule:** Only `VITE_`-prefixed variables compile into Vite output. `SUPABASE_SERVICE_ROLE_KEY`, model provider keys, and telemetry secrets exist ONLY in Supabase Edge Function runtime or CI secret stores. See → [`ENV.example`](../ENV.example).

## 6. Cost & Latency Circuit Breakers
**Invariant:** Every assist invocation is budget-gated.
**Rule:** The `AssistBudget` in [`packages/router/src/index.ts`](../packages/router/src/index.ts) enforces hard limits: 1200 input tokens, 120 output tokens, 786432 max pixels, 2 ROIs, 1500ms latency ceiling, 500 microdollars cost cap, escalation disabled by default. Model provider aliases are used instead of direct model names. See → [`docs/adr/ADR-004-model-alias-cost-circuit.md`](../docs/adr/ADR-004-model-alias-cost-circuit.md).

## 7. Title Support Gating
**Invariant:** Unsupported titles remain blocked until compliance review clears them.
**Rule:** The `TitleCard` type in [`apps/web/src/main.tsx`](../apps/web/src/main.tsx) has `state: 'supported' | 'blocked'`. New titles start as `blocked` with a compliance note. Runtime support is paused until a title research report is present and legal review is complete. No game title is ever auto-promoted to `supported`.

## 8. Relational-First Retrieval
**Invariant:** Retrieval is Postgres/RLS-first.
**Rule:** Vector stores, embeddings, and similarity search are supplementary. The primary retrieval path goes through Supabase Postgres with row-level security enforced. See → [`docs/adr/ADR-002-relational-first-retrieval.md`](../docs/adr/ADR-002-relational-first-retrieval.md).

## 9. CI Gate Sequence
**Invariant:** Every push to `main` and every PR must pass all gates.
**Rule:** Gates execute in order: compliance gate → license gate → lint → typecheck → build. A failure in any gate blocks merge. See → [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## 10. Cloudflare Static Hosting Only
**Invariant:** Cloudflare Pages deploys static assets from `apps/web/dist`.
**Rule:**
- Build command: `pnpm --filter web build`
- Output directory: `apps/web/dist`
- `_headers` and `_redirects` live in `apps/web/public/` so Vite emits them to `dist/`.
- Security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options) are set via `_headers`.
- SPA fallback via `_redirects`: `/* /index.html 200`.
- SSL/TLS: Full (Strict) after DNS is stable. HTTPS redirects enabled.
