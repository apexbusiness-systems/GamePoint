# Evidence — WP A3+A4: Session Config Handoff + Assist Hardening

Date: 2026-07-09 · Baseline: main @ ed1cd8e · Environment: Linux sandbox, Node v22.22.3, pnpm 10.28.1 (corepack), Python 3.x + pytest

## Baseline (pre-change, main @ ed1cd8e)
| Check | Result |
|---|---|
| compliance-gate.sh | PASS |
| license-gate.py --check | PASS |
| sync-edge --check | PASS |
| pnpm typecheck (tsc -b, 4 projects) | PASS |
| node --test contracts+router+overlay | 33/33 |
| web tests | 11/11 |
| web build / overlay build | PASS / PASS |
| ingest pytest | 12/12 |
| cargo (rust leg) | UNAVAILABLE in sandbox — CI-only |

## Post-change (this work package)
| Check | Result |
|---|---|
| compliance-gate.sh | PASS |
| license-gate.py --check | PASS |
| sync-edge --check (contracts hash aaba3435…) | PASS |
| pnpm typecheck (tsc -b, 4 projects) | PASS |
| node --test contracts+router+overlay | 45/45 (+12 new) |
| web tests | 14/14 (+3 new) |
| web build / overlay build | PASS / PASS |
| ingest pytest | 12/12 |
| cargo (rust leg) | deferred to CI — no Rust surface touched, golden fixture unchanged |

## What changed (blast radius)
- `packages/contracts`: SessionConfig schema + encode/decode + secret wall; optional
  `AssistRequest.request_id`/`client_version`; AssistErrorCode/AssistErrorBody. Golden
  `assist-request.json` fixture unchanged → Rust serde parity preserved.
- `apps/overlay`: `config.ts` binding resolver (`gpc` param), App binds session id +
  Realtime source to the validated config, visible bound/refused banner; fixture mode
  only when unconfigured.
- `apps/web`: `overlay-launch.ts` builder + "Copy overlay config" in Sessions;
  browser-safe VITE_ values only.
- `supabase/migrations/008_session_lifecycle.sql`: idempotent lifecycle + correlation
  columns; repairs latent `coaching_responses.latency_ms` defect from 007.
- `supabase/functions/assist`: deterministic error taxonomy, request-id correlation
  (body column + `x-gp-request-id` header), per-user sliding-window rate limit.
- `docs/adr/ADR-008` + `.understand-anything/DECISIONS.md` index repaired (006–008).

## Known deferred items (explicitly not claimed)
- Rust `cargo clippy/test/check` — runs in CI (`rust` job); dispatch serde mirror
  follow-up to add optional correlation fields (three-point change per ADR-007).
- Supabase db push of migration 008 + pgTAP `rls_test.sql` against a live database.
- Live edge function deploy + end-to-end hotkey→HUD proof (plan Phase 4).

## E2E note
Playwright chromium was installed in the sandbox but browser launch fails on
missing system libraries (libXdamage.so.1) that cannot be installed without
root. All 13 spec failures are launch-time environmental, 2–7 ms each, zero
page assertions executed. The `browser-e2e` CI job installs `--with-deps` and
is the authoritative E2E gate for this PR.

---

# Review response round — 2026-07-09 (same day)

## Behavioral gaps closed
1. **Invalid-config capture path.** Previously only the subscription was blocked;
   `Start capture` stayed active and the HUD could read "Watching". Now
   `binding/refused` sets reducer-level `captureLocked`: `capture/toggle` is
   structurally inert (same-reference no-op), the button is disabled and labeled
   "Capture locked", and the status word reports `Capture locked`. 3 new reducer tests.
2. **request_id → HUD.** `CoachingResponse` now carries optional `request_id`, the
   assist function embeds it in `final` (HTTP body + `coaching_responses` row +
   broadcast), the HUD Zod parse retains it, and the HUD renders a `req <short>`
   correlation chip. Contract test proves parse retention.

## Deferred items addressed
3. **Rust serde mirror (three-point change per ADR-007) — DONE.**
   `AssistRequest.request_id/client_version` + `CoachingResponse.request_id`
   (`Option`, skip-serializing-if-none); both golden fixtures now include the
   fields; CI `rust` job proves round-trip parity.
4. **Migration 008 on the live database — DONE.** Connected via Supavisor
   (`aws-1-ca-central-1`, PostgreSQL 17.6). Applied 008 in a transaction,
   verified all 7 columns + `sessions_status_check` + both indexes, then
   **re-applied cleanly to prove idempotency**. Read-only RLS sweep (rolled
   back): RLS on for titles/embeddings/profiles/sessions/advice_events/
   coaching_responses; 12 public policies + `realtime.session_channel_recv`
   present; anon reads 0 rows from the user plane. The mutating pgTAP suite was
   NOT run against production by design (creates test users) — it remains a
   CI/staging concern.
5. **Edge function verification — deno check now a CI merge blocker.**
   `deno check` (Deno 2.9.2) over all three functions caught 2 real type
   defects (one pre-existing since WP-4: `ModelResult` passed as a numeric
   record on the degraded path). Both fixed; `edge-typecheck` CI job added.
   **Live probe: `POST /functions/v1/assist` → 404 NOT_FOUND — the assist
   function has never been deployed to production.** Deploy requires a
   Supabase personal access token (`sbp_…`); the Management API correctly
   rejects the service-role JWT ("JWT failed verification"). BLOCKED on owner
   supplying a PAT or deploying via dashboard/CI secret.

## Post-round verification (all local)
compliance PASS · license PASS · sync-edge PASS · typecheck PASS ·
node tests 49/49 · web tests 14/14 · web+overlay builds PASS ·
deno edge check PASS (3/3 functions) · live DB columns/indexes/constraint verified.

---

# Live deployment + production loop proof — 2026-07-09 (PAT provided)

## Deployed (Supabase CLI, project nbgofxqominofaghbxje, ca-central-1)
- `assist` — deployed with `--no-verify-jwt`: the function performs its own JWT
  validation (`auth.getUser`) so it can emit the deterministic 401 taxonomy;
  security is preserved because every request is still user-authenticated in code.
- `ingest-webhook`, `retrieval-plan` — deployed with platform JWT verification ON
  (service-role-gated internal functions; defense in depth).
- Secret set: `CORS_ALLOWED_ORIGINS=https://gamepointagent.com,tauri://localhost`.
- NOT set (unavailable): `OPENAI_API_KEY` — model calls degrade to
  `NO_ADVICE_THIS_FRAME` by design; every other stage runs live.

## Live production proof (all against https://nbgofxqominofaghbxje.supabase.co)
| # | Probe | Result |
|---|---|---|
| 1 | GET /assist | 405 `METHOD_NOT_ALLOWED`, request_id in body + `x-gp-request-id` |
| 2 | POST, no auth | 401 `AUTH_REQUIRED` + correlation header |
| 3 | Admin-created test user, password sign-in | OK |
| 4 | POST, authenticated, malformed body | 400 `INVALID_REQUEST` |
| 5 | Session insert via REST under RLS (own user) | created, `status='active'` (008 live) |
| 6 | **Full loop**: valid AssistRequest (1×1 JPEG, real blake3, client request_id) | 200; body+header request_id == client's; degraded `NO_ADVICE_THIS_FRAME`, `not_verified=true`, `latency_ms=1375` |
| 7 | Blocked title (diablo-iv, verify_terms) | 403 `TITLE_NOT_ELIGIBLE` |
| 8 | Foreign session id | 403 `SESSION_NOT_OWNED` |
| 9 | Rapid fire | 429 `RATE_LIMITED` at request #11 (12/min window incl. prior traffic) |
| 10 | DB correlation | `advice_events` (12 rows, `client_version='e2e-proof-0.1.0'`) + `coaching_responses` row matching the client request_id |
| 11 | **Realtime HUD path**: private `session:{id}` channel, `private:true`, user JWT — exactly the overlay subscription | `SUBSCRIBED` → assist fired → **BROADCAST_RECEIVED, `payload.record.request_id` matches client request_id** |

## Cleanup
Test user deleted via admin API (HTTP 200); cascade verified: 0 rows remaining in
sessions / advice_events / coaching_responses for the test session. Production left
in its pre-proof state (plus migration 008, which is the intended change).

## Remaining for full Phase-4 signoff (not claimable from this environment)
- `OPENAI_API_KEY` (or provider key) in Supabase secrets → verified advice with
  evidence_ids instead of degraded responses.
- Windows hardware run: real DXGI hotkey capture through services/capture-win →
  the same (now-proven) backend loop → HUD.
- Registry compliance titles: prod registry matches compliance-matrix.md (16 rows
  verified live, 5 cleared runtime-eligible).

---

# Hybrid provider routing + brand wordmark — 2026-07-09 (ADR-009)

## Hybrid intelligence (Groq + Gemini, free tier, zero new dependencies)
- Provider-prefixed aliases; defaults: primary `groq:meta-llama/llama-4-scout-17b-16e-instruct`,
  fallback `gemini:gemini-flash-lite-latest`, escalation `gemini:gemini-2.5-flash` (off, ADR-004).
- Cascade: primary → retry → cross-provider fallback → NO_ADVICE. Missing key = fail-fast, never throw.
- Embeddings: `EMBEDDINGS_PROVIDER_ORDER=gemini,openai`, gemini-embedding-001 pinned to 1536 dims
  (matches vector(1536)); currently degrades to null — Gemini API not enabled on the key's Google project.
- Both providers verified by direct call before deploy (Groq strict json_schema ✓; Gemini
  `gemini-flash-lite-latest` + `gemini-3.1-flash-lite` ✓; `gemini-2.5-flash-lite` retired for new users).

## Live production proof (deployed assist, real traffic)
| Probe | Result |
|---|---|
| Full loop, real frame | 200 — **real advice from `groq:…llama-4-scout…`** ("Move to a safe location…"), `outcome=ok`, honest `not_verified=true` (no evidence corpus yet), request_id correlated |
| **Forced failover** (primary set to a nonexistent groq model) | 200 — served by **`gemini:gemini-flash-lite-latest`**, `outcome=ok`; telemetry records the serving alias per provider |
| Restore + cleanup | primary restored; test user deleted (cascade), prod clean |

## Key placement (question answered)
Model provider keys (`GROQ_API_KEY`, `GEMINI_API_KEY`) belong in **Supabase Edge Function
secrets only** — set via `supabase secrets set` (done). NOT Cloudflare (static hosting only,
ADR-005), NOT GitHub (CI never calls models), never `VITE_*` (invariant 10).

## Brand wordmark (GPA)
- `gpa-wordmark.png` installed at `apps/web/public/art/` + `apps/overlay/public/art/`
  (trimmed, 800px, palette-optimized 47 KB) + generated `favicon.png` (web).
- All 6 old logo instances replaced (web sidebar brand, auth-card brand, web mockup
  gp-chip + HUD glyph, overlay mockup gp-chip + HUD glyph); `.brand-mark` markup and
  CSS deleted repo-wide — zero remaining `brand-mark`/`<b>G</b>` references.
- Verified: typecheck PASS, 35 web+overlay tests PASS, both builds PASS, wordmark +
  favicon present in dist.
