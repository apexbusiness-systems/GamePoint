// Internal retrieval: relational filter first, cosine rerank second (ADR-002).
// Service-role only — called by `assist`, never by clients.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { preflight, json } from '../_shared/cors.ts';

const RetrievalRequest = z.object({
  title_id: z.string().uuid(),
  categories: z.array(z.string()).nullable(),
  query_embedding: z.array(z.number()).length(1536),
  limit: z.number().int().min(1).max(24),
});

const Candidate = z.object({
  chunk_id: z.string().uuid(),
  chunk: z.string(),
  claim_id: z.string().uuid().nullable(),
  entity_kind: z.string().nullable(),
  similarity: z.number(),
  trust_tier: z.number().int(),
});
export const RetrievalResponse = z.object({ candidates: z.array(Candidate) });

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json(req, 405, { error: 'method not allowed' });

  // Service-role gate: this function is internal plumbing.
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`) {
    return json(req, 401, { error: 'service role required' });
  }

  const parsed = RetrievalRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(req, 400, { error: 'invalid retrieval request' });

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await db.rpc('retrieval_candidates', {
    p_title_id: parsed.data.title_id,
    p_categories: parsed.data.categories,
    p_query_embedding: parsed.data.query_embedding,
    p_limit: parsed.data.limit,
  });
  if (error) {
    console.error('retrieval_failed', { code: error.code }); // no content logged
    return json(req, 502, { error: 'retrieval failed' });
  }
  return json(req, 200, RetrievalResponse.parse({ candidates: data ?? [] }));
});
