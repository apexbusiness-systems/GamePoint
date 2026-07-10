# Runbook: Supabase Deploy + Verification (WP-1/WP-4 gated items)

Prereqs: Supabase CLI ≥ 2.x, project ref, `supabase login` done.

```bash
supabase link --project-ref <ref>
select extversion from pg_extension where extname = 'vector';   # must be >= 0.8 (P3)
supabase db push --dry-run                                       # P1: must be clean
supabase db push                                                 # apply 001–007
supabase db push                                                 # idempotency proof: second run = no-op
psql "$SUPABASE_DB_URL" -f supabase/seed/seed.sql                # seed (re-run: 0 new rows)
psql "$SUPABASE_DB_URL" -f supabase/seed/seed.sql
psql "$SUPABASE_DB_URL" -c "select count(*) from titles;"        # expect 16

# pgTAP (requires supabase test helpers: basejump supabase_test_helpers)
supabase test db                                                 # runs supabase/tests/*.sql

# Secrets (P2) — names only, never values in evidence
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=... CORS_ALLOWED_ORIGINS=...
supabase secrets list

# Edge Functions
node packages/contracts/scripts/sync-edge.mjs                    # contracts → _shared (drift-checked in CI)
supabase functions deploy retrieval-plan assist ingest-webhook
supabase functions serve &                                       # local E2E
node packages/router/scripts/e2e-fixture.mjs                     # posts fixture frame, expects CoachingResponse
```

Record every command's verbatim output in `docs/evidence/wp1.md` / `wp4.md`. Any failure → stop, fix, re-run; never mark PASS on a summarized result (§6).

---

## Deployed state — 2026-07-09 (live-verified)

- Migrations 001–008 applied to production (`nbgofxqominofaghbxje`, ca-central-1).
  Note: prod predates CLI migration tracking — apply via SQL, all migrations are idempotent.
- Functions deployed: `assist` (deployed `--no-verify-jwt`; performs its own JWT check to
  emit the ADR-008 error taxonomy), `ingest-webhook`, `retrieval-plan` (platform JWT ON).
- Secrets set: `GROQ_API_KEY`, `GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS`, cost rates (0).
- Redeploy after contract changes: `node packages/contracts/scripts/sync-edge.mjs` first
  (CI fails on drift), then `supabase functions deploy assist --project-ref <ref> --no-verify-jwt`.
- pgTAP suite (`supabase/tests/rls_test.sql`): CI/staging ONLY — it creates test users.
  Production RLS verification: read-only sweep (see docs/evidence/wp-a3-a4.md).
