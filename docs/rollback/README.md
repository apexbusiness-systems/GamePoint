# Migration Rollback Scripts

Paired `down` scripts for `supabase/migrations/`. Run in reverse order via `psql`. Each is destructive to its own objects only.

| Up | Down |
|---|---|
| 007_broadcast.sql | `drop trigger if exists coaching_responses_broadcast on public.coaching_responses; drop function if exists public.broadcast_coaching_response(); drop policy if exists session_channel_recv on realtime.messages; drop table if exists public.coaching_responses;` |
| 006_retrieval.sql | `drop function if exists public.retrieval_candidates(uuid, text[], vector, int);` |
| 005_rls.sql | `-- policies only:` drop each `*_select/_insert/_update` policy named in the file; RLS flags may stay on. |
| 004_users.sql | `drop table if exists public.advice_events, public.sessions, public.profiles; drop type if exists coaching_mode, playstyle;` |
| 003_embeddings.sql | `drop table if exists public.embeddings;` (extension `vector` retained) |
| 002_knowledge.sql | `drop table if exists public.media_evidence, public.claims, public.entities, public.source_records, public.knowledge_sources; drop type if exists claim_status, source_license, source_type;` |
| 001_titles.sql | `drop table if exists public.titles; drop type if exists compliance_status, anti_cheat_class;` |

Edge Function rollback: `supabase functions deploy <name> --version <previous>` (deploys are versioned; see release runbook).
