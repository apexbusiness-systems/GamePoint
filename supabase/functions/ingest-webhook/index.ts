// Pipeline callback endpoint (service-role only): records pack-build completion and
// bumps source revalidation dates. Never client-facing.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { preflight, json } from '../_shared/cors.ts';

const IngestCallback = z.object({
  source_id: z.string().uuid(),
  scrape_hash: z.string().min(8).max(128),
  canonical_url: z.string().url(),
  trust_tier: z.number().int().min(0).max(3),
  revalidation_due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json(req, 405, { error: 'method not allowed' });
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`) {
    return json(req, 401, { error: 'service role required' });
  }
  const parsed = IngestCallback.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(req, 400, { error: 'invalid callback' });

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  // Idempotent: keyed on (source_id, scrape_hash); re-delivery is a no-op update.
  const { error } = await db.from('source_records').upsert(
    {
      source_id: parsed.data.source_id,
      scrape_hash: parsed.data.scrape_hash,
      canonical_url: parsed.data.canonical_url,
      trust_tier: parsed.data.trust_tier,
    },
    { onConflict: 'source_id,scrape_hash' },
  );
  if (error) return json(req, 502, { error: 'record write failed' });
  await db
    .from('knowledge_sources')
    .update({ revalidation_due: parsed.data.revalidation_due })
    .eq('id', parsed.data.source_id);
  return json(req, 200, { ok: true });
});
