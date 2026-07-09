# WP-3 Evidence — Knowledge Ingestion

## RAN (verbatim pytest output)
```
............                                                             [100%]
12 passed in 0.06s
```
Covers: OSRS CC-BY-NC-SA fixture rejected for runtime + quarantine routing; unrecognized-license refusal; CC-BY-SA attribution requirement; idempotency (build twice, row-count delta = 0); blast radius (PoE2 build leaves BG3 rows byte-identical); synthesis discipline (paraphrased statements, ≤240-char attributed fragments, never verbatim bulk); hash dedupe; 1536-dim embeddings; Blizzard/Bungie adapters refuse with flag name `verify_terms:*`.

## RUNBOOK-GATED
- UNCERTAIN: not run — live Wave-1 pack builds (network + Supabase + OpenAI creds absent). Per-title yields must be measured, not invented: run `PYTHONPATH=. python -m gamepoint_ingest.run_pack --title <slug> --category <cat>` per docs/runbooks/supabase-deploy.md and record actual pages/claims/chunks here.
