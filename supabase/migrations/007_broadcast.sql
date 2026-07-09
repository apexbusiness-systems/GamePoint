-- 007: coaching_responses staging table + Realtime Broadcast to private session channel.
create table if not exists public.coaching_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  title_id uuid references public.titles(id),
  advice_text text not null,
  recommended_action text not null,
  evidence_ids uuid[] not null default '{}',
  confidence real not null check (confidence between 0 and 1),
  source_tier text not null,
  not_verified boolean not null default false,
  created_at timestamptz not null default now(),
  -- Truth bar, structural: a claim carries evidence or is marked not verified.
  constraint truth_bar check (cardinality(evidence_ids) > 0 or not_verified)
);
create index if not exists coaching_responses_session_idx on public.coaching_responses (session_id);

alter table public.coaching_responses enable row level security;
do $$ begin
  create policy coaching_responses_select on public.coaching_responses for select to authenticated
    using (exists (select 1 from public.sessions s where s.id = session_id and s.user_id = (select auth.uid())));
exception when duplicate_object then null; end $$;

create or replace function public.broadcast_coaching_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform realtime.broadcast_changes(
    'session:' || new.session_id::text, -- private channel per session
    tg_op, tg_op, tg_table_name, tg_table_schema, new, old
  );
  return null;
end;
$$;

drop trigger if exists coaching_responses_broadcast on public.coaching_responses;
create trigger coaching_responses_broadcast
  after insert on public.coaching_responses
  for each row execute function public.broadcast_coaching_response();

-- Realtime authorization: only the session owner may receive on session:{id}.
do $$ begin
  create policy session_channel_recv on realtime.messages for select to authenticated
    using (
      exists (
        select 1 from public.sessions s
        where 'session:' || s.id::text = realtime.topic()
          and s.user_id = (select auth.uid())
      )
    );
exception when duplicate_object then null; end $$;
