-- 001: title registry. Idempotent; safe to re-run.
create extension if not exists pgcrypto;

do $$ begin
  create type anti_cheat_class as enum ('none','server_side','eac_disableable','kernel');
exception when duplicate_object then null; end $$;

do $$ begin
  create type compliance_status as enum ('cleared','verify_terms','license_blocked','legal_review');
exception when duplicate_object then null; end $$;

create table if not exists public.titles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  publisher text not null,
  anti_cheat_class anti_cheat_class, -- null = unknown (e.g. unreleased title)
  publisher_stance text,
  wave smallint not null check (wave between 1 and 3),
  compliance_status compliance_status not null default 'verify_terms',
  runtime_eligible boolean not null default false,
  pvp_flagged boolean not null default false,
  reviewed_at timestamptz,
  -- Structural safety: a title can never be runtime-eligible unless cleared.
  constraint eligible_requires_cleared
    check (not runtime_eligible or compliance_status = 'cleared')
);

create index if not exists titles_runtime_idx on public.titles (runtime_eligible) where runtime_eligible;
