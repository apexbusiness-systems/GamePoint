-- 005: RLS. Every public table locked; ownership via initPlan-cached (select auth.uid()).
-- One policy per operation, scoped TO authenticated. Knowledge: read-only; writes are
-- service-role only (service role bypasses RLS; no write policies exist on purpose).

alter table public.titles enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.source_records enable row level security;
alter table public.entities enable row level security;
alter table public.claims enable row level security;
alter table public.media_evidence enable row level security;
alter table public.embeddings enable row level security;
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.advice_events enable row level security;
-- coaching_responses RLS lives in 007 (table created there).

-- Registry/knowledge: readable by signed-in clients (needed for title gating UI).
do $$ begin
  create policy titles_select on public.titles for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy knowledge_sources_select on public.knowledge_sources for select to authenticated using (runtime_eligible);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy claims_select on public.claims for select to authenticated using (status = 'confirmed');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy entities_select on public.entities for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy media_evidence_select on public.media_evidence for select to authenticated using (true);
exception when duplicate_object then null; end $$;
-- source_records and embeddings are internal: no client policies at all.

-- Profiles: owner-only, per-operation.
do $$ begin
  create policy profiles_select on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_update on public.profiles for update to authenticated
    using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

-- Sessions: owner-only.
do $$ begin
  create policy sessions_select on public.sessions for select to authenticated using ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy sessions_insert on public.sessions for insert to authenticated with check ((select auth.uid()) = user_id);
exception when duplicate_object then null; end $$;

-- advice_events: telemetry is write-path server-side only; owners may read their own via session join.
do $$ begin
  create policy advice_events_select on public.advice_events for select to authenticated
    using (exists (select 1 from public.sessions s where s.id = session_id and s.user_id = (select auth.uid())));
exception when duplicate_object then null; end $$;
