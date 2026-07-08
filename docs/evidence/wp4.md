# WP-4 Evidence — Edge Functions

## RAN (this environment)
- Decision logic (cascade, advantage post-filter, cost breaker, prompt assembly) is in `packages/router` — 10/10 node tests green including the 10-adversarial red-team set (verbatim in wp2-tests.md).
- `sync-edge.mjs --check` green: `_shared/contracts.ts` + `_shared/router.ts` hash-locked to package sources (ADR-007).
- Failure paths encoded: schema-invalid model output → retry once → `NO_ADVICE_THIS_FRAME` (200, degraded, telemetry written); missing JWT → 401; ineligible title → 403 with compliance message; unhandled error → degraded response + telemetry, never a crash.

## RUNBOOK-GATED (Deno + Supabase absent here — docs/runbooks/supabase-deploy.md)
- UNCERTAIN: not run — `supabase functions serve` E2E with fixture frame; deployed-function 401/403 probes; live request/response transcript.
