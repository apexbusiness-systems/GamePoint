-- 003: vector store. Requires pgvector >= 0.8 (HNSW). Idempotent.
create extension if not exists vector;

create table if not exists public.embeddings (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles(id) on delete cascade,
  chunk text not null,
  chunk_checksum text not null unique,
  modality text not null default 'text',
  source_fk uuid references public.source_records(id) on delete cascade,
  embedding vector(1536) not null
);

create index if not exists embeddings_hnsw_idx on public.embeddings
  using hnsw (embedding vector_cosine_ops) with (m = 16, ef_construction = 64);
create index if not exists embeddings_title_idx on public.embeddings (title_id);
