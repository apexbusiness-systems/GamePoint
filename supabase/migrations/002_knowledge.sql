-- 002: knowledge plane. Idempotent.
do $$ begin
  create type source_type as enum ('official_api','mediawiki_api','patch_notes','media');
exception when duplicate_object then null; end $$;

do $$ begin
  create type source_license as enum ('CC-BY-SA','CC-BY-NC-SA','official-API-terms','proprietary');
exception when duplicate_object then null; end $$;

do $$ begin
  create type claim_status as enum ('confirmed','unverified','quarantined');
exception when duplicate_object then null; end $$;

create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles(id) on delete cascade,
  source_type source_type not null,
  url text not null,
  license source_license not null,
  runtime_eligible boolean not null default false,
  revalidation_due date,
  -- Non-commercial licenses are structurally barred from runtime packs.
  constraint nc_never_runtime check (not (runtime_eligible and license = 'CC-BY-NC-SA')),
  unique (title_id, url)
);

create table if not exists public.source_records (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  canonical_url text not null,
  scrape_hash text not null,
  retrieved_at timestamptz not null default now(),
  trust_tier smallint not null default 2 check (trust_tier between 0 and 3),
  unique (source_id, scrape_hash)
);

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles(id) on delete cascade,
  kind text not null,
  canonical_name text not null,
  data jsonb not null default '{}'::jsonb,
  unique (title_id, kind, canonical_name)
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete set null,
  attribute text not null,
  value jsonb not null,
  confidence real not null default 0 check (confidence between 0 and 1),
  source_count integer not null default 1,
  status claim_status not null default 'unverified',
  content_hash text not null,
  unique (title_id, content_hash)
);

create table if not exists public.media_evidence (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles(id) on delete cascade,
  source_record_id uuid not null references public.source_records(id) on delete cascade,
  kind text not null,
  ocr_text text,
  storage_path text
);

create index if not exists knowledge_sources_title_idx on public.knowledge_sources (title_id);
create index if not exists source_records_source_idx on public.source_records (source_id);
create index if not exists claims_title_status_idx on public.claims (title_id, status);
create index if not exists entities_title_idx on public.entities (title_id);
create index if not exists media_evidence_title_idx on public.media_evidence (title_id);
