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
