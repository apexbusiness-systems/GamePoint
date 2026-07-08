-- 004: user plane. advice_events has no content columns, by design (privacy §1.2).
do $$ begin
  create type coaching_mode as enum ('simple','guided','tactical','pro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type playstyle as enum ('story','mastery','rank');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  playstyle playstyle,
  coaching_mode coaching_mode not null default 'guided',
  age_gate_passed boolean not null default false,
  voice_opt_in boolean not null default false, -- dark in v1.0; schema-ready
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title_id uuid references public.titles(id),
  started_at timestamptz not null default now()
);

create table if not exists public.advice_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  title_id uuid references public.titles(id),
  mode text not null,
  model text not null,
  latency_ms integer not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd_micros integer not null default 0,
  confidence real not null default 0,
  outcome text not null default 'ok', -- ok | degraded | refused_advantage | error
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_idx on public.sessions (user_id);
create index if not exists advice_events_session_idx on public.advice_events (session_id);
create index if not exists advice_events_title_created_idx on public.advice_events (title_id, created_at);
