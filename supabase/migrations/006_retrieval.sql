-- 006: relational-first retrieval (ADR-002). Compliance is in the WHERE clause:
-- quarantined claims and non-runtime titles/sources are structurally unreachable.
create or replace function public.retrieval_candidates(
  p_title_id uuid,
  p_categories text[],
  p_query_embedding vector(1536),
  p_limit int default 8
) returns table (
  chunk_id uuid,
  chunk text,
  claim_id uuid,
  entity_kind text,
  similarity real,
  trust_tier smallint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    e.id as chunk_id,
    e.chunk,
    c.id as claim_id,
    en.kind as entity_kind,
    (1 - (e.embedding <=> p_query_embedding))::real as similarity,
    coalesce(sr.trust_tier, 0) as trust_tier
  from public.embeddings e
  join public.titles t on t.id = e.title_id
  left join public.source_records sr on sr.id = e.source_fk
  left join public.knowledge_sources ks on ks.id = sr.source_id
  left join public.claims c
    on c.title_id = e.title_id and c.content_hash = e.chunk_checksum and c.status = 'confirmed'
  left join public.entities en on en.id = c.entity_id
  where e.title_id = p_title_id                        -- blast radius: single title, always
    and t.runtime_eligible = true                      -- title gate, structural
    and t.compliance_status = 'cleared'
    and (sr.id is null or ks.runtime_eligible = true)  -- license gate, structural
    and (p_categories is null or en.kind is null or en.kind = any (p_categories))
  order by e.embedding <=> p_query_embedding
  limit least(greatest(p_limit, 1), 24);
$$;

revoke all on function public.retrieval_candidates(uuid, text[], vector, int) from public, anon;
grant execute on function public.retrieval_candidates(uuid, text[], vector, int) to service_role;
