# WP-1 Evidence — Supabase Foundation

## RAN (this environment)
- SQL authored: migrations 001–007, seed (16 titles, 10 Wave-1 sources), pgTAP suite, rollback table.
- Static review: 005 originally referenced `coaching_responses` before creation — caught and moved to 007 (commit history shows fix).
- Structural compliance encoded in schema, not app code: `eligible_requires_cleared` CHECK, `nc_never_runtime` CHECK, `truth_bar` CHECK, retrieval WHERE gate.

## RUNBOOK-GATED (Supabase CLI absent here — docs/runbooks/supabase-deploy.md)
- UNCERTAIN: not run — `supabase db push` ×2 (idempotency), pgTAP 12-assertion suite, pgvector version check, seed re-run row-delta=0.
