// POST /assist — frame payload in, coaching JSON out (WP-4).
// Flow: JWT → Zod parse → title gate → embed → retrieval → cascade → post-filter →
// telemetry → coaching_responses insert (Broadcast pushes to session:{id}).
// All decision logic lives in _shared/router.ts (synced from packages/router, node-tested).
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  AssistRequest,
  CoachingResponse,
  NO_ADVICE_THIS_FRAME,
} from '../_shared/contracts.ts';
import {
  buildPrompt,
  CostCircuitBreaker,
  enforceAdvantageCheck,
  shouldEscalate,
  type ModelAliases,
} from '../_shared/router.ts';
import { preflight, json } from '../_shared/cors.ts';

const aliases: ModelAliases = {
  primary: Deno.env.get('VISION_MODEL_PRIMARY') ?? 'gpt-5-nano',
  escalation: Deno.env.get('VISION_MODEL_ESCALATION') ?? 'gpt-5.4-mini',
  fallback: Deno.env.get('VISION_MODEL_FALLBACK') ?? 'gemini-2.5-flash-lite',
};
const breaker = new CostCircuitBreaker(
  Number(Deno.env.get('COST_BREAKER_USD_MICROS') ?? 500),
);

const responseJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['advice_text', 'recommended_action', 'evidence_ids', 'confidence', 'source_tier', 'not_verified'],
  properties: {
    advice_text: { type: 'string' },
    recommended_action: { type: 'string' },
    evidence_ids: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number' },
    source_tier: { enum: ['verified', 'mixed', 'policy', 'none'] },
    not_verified: { type: 'boolean' },
  },
} as const;

interface ModelResult {
  response: CoachingResponse | null;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsdMicros: number;
}

async function callVisionModel(
  model: string,
  stablePrefix: string,
  volatile: string,
  frameB64: string,
): Promise<ModelResult> {
  const started = performance.now();
  const res = await fetch(`${Deno.env.get('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      // Stable prefix first → provider prompt caching; volatile content last.
      messages: [
        { role: 'system', content: stablePrefix },
        {
          role: 'user',
          content: [
            { type: 'text', text: volatile },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${frameB64}`, detail: 'low' } },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'coaching_response', strict: true, schema: responseJsonSchema },
      },
      max_tokens: Number(Deno.env.get('ASSIST_MAX_OUTPUT_TOKENS') ?? 120),
    }),
  });
  if (!res.ok) {
    console.error('model_call_failed', { model, status: res.status, ms: performance.now() - started });
    return { response: null, model, inputTokens: 0, outputTokens: 0, costUsdMicros: 0 };
  }
  const body = await res.json();
  const usage = body.usage ?? {};
  const parsed = CoachingResponse.safeParse(
    JSON.parse(body.choices?.[0]?.message?.content ?? 'null'),
  );
  return {
    response: parsed.success ? parsed.data : null,
    model,
    inputTokens: usage.prompt_tokens ?? 0,
    outputTokens: usage.completion_tokens ?? 0,
    // Micro-USD accounting from env-configured per-token rates (vendor prices drift; ADR-004).
    costUsdMicros: Math.round(
      (usage.prompt_tokens ?? 0) * Number(Deno.env.get('COST_INPUT_MICROS_PER_TOKEN') ?? 0.05) +
        (usage.completion_tokens ?? 0) * Number(Deno.env.get('COST_OUTPUT_MICROS_PER_TOKEN') ?? 0.4),
    ),
  };
}

async function embedQuery(text: string): Promise<number[] | null> {
  const res = await fetch(`${Deno.env.get('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1'}/embeddings`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: Deno.env.get('TEXT_EMBEDDING_MODEL') ?? 'text-embedding-3-small', input: text }),
  });
  if (!res.ok) return null;
  return (await res.json()).data?.[0]?.embedding ?? null;
}

Deno.serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json(req, 405, { error: 'method not allowed' });
  const started = performance.now();

  // 1. Auth: user JWT required.
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const db = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: authError } = await db.auth.getUser(jwt);
  if (authError || !userData?.user) return json(req, 401, { error: 'authentication required' });

  // 2. Validate payload at the boundary.
  const parsed = AssistRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(req, 400, { error: 'invalid assist request' });
  const request = parsed.data;

  // 3. Session ownership + title gate (compliance is a query, not a convention).
  const { data: session } = await db
    .from('sessions')
    .select('id, user_id')
    .eq('id', request.session_id)
    .single();
  if (!session || session.user_id !== userData.user.id) {
    return json(req, 403, { error: 'session not owned by caller' });
  }
  const { data: title } = await db
    .from('titles')
    .select('id, slug, runtime_eligible, compliance_status, pvp_flagged')
    .eq('id', request.title_id)
    .single();

  const telemetry = async (outcome: string, model: string, extra: Partial<Record<string, number>> = {}) => {
    await db.from('advice_events').insert({
      session_id: request.session_id,
      title_id: title?.id ?? null,
      mode: request.hotkey_intent,
      model,
      latency_ms: Math.round(performance.now() - started),
      input_tokens: extra.inputTokens ?? 0,
      output_tokens: extra.outputTokens ?? 0,
      cost_usd_micros: extra.costUsdMicros ?? 0,
      confidence: extra.confidence ?? 0,
      outcome,
    });
  };

  if (!title || !title.runtime_eligible || title.compliance_status !== 'cleared') {
    await telemetry('error', 'none');
    return json(req, 403, {
      error: 'title not runtime-eligible',
      detail: 'This title has not passed the GamePoint compliance gate for live coaching.',
    });
  }

  const deliver = async (
    response: CoachingResponse,
    outcome: string,
    model: string,
    usage: Partial<Record<string, number>>,
  ) => {
    const final = { ...response, latency_ms: Math.round(performance.now() - started) };
    await db.from('coaching_responses').insert({
      session_id: request.session_id,
      title_id: title.id,
      ...final,
    });
    await telemetry(outcome, model, { ...usage, confidence: response.confidence });
    return json(req, 200, final);
  };

  try {
    // 4. Embed intent context → 5. retrieval (in-process; same relational-first SQL).
    const queryText = `${title.slug} ${request.hotkey_intent} ${request.roi_descriptors.map((r) => r.kind).join(' ')}`;
    const embedding = await embedQuery(queryText);
    let chunks: { chunk_id: string; chunk: string; trust_tier: number }[] = [];
    if (embedding) {
      const { data } = await db.rpc('retrieval_candidates', {
        p_title_id: title.id,
        p_categories: null,
        p_query_embedding: embedding,
        p_limit: Number(Deno.env.get('ASSIST_MAX_RETRIEVAL_CHUNKS') ?? 4),
      });
      chunks = data ?? [];
    }

    // 6. Prompt (stable prefix first) → 7. cascade with cost breaker.
    const { stablePrefix, volatile } = buildPrompt({
      titleSlug: title.slug,
      mode: request.hotkey_intent,
      pvpFlagged: title.pvp_flagged,
      retrievedChunks: chunks,
      intent: request.hotkey_intent,
      observables: request.local_observables,
    });

    const { model: primaryModel, tripped } = breaker.pickPrimary(aliases);
    if (tripped) console.error('cost_breaker_tripped', { rolling: breaker.rollingMeanUsdMicros });

    let result = await callVisionModel(primaryModel, stablePrefix, volatile, request.frame_b64);
    if (result.response === null) {
      // Retry once, then degrade — never a crash (§1.2).
      result = await callVisionModel(primaryModel, stablePrefix, volatile, request.frame_b64);
    }
    if (
      result.response !== null &&
      !tripped &&
      shouldEscalate(result.response.confidence, request, (Deno.env.get('ASSIST_ESCALATION_ALLOWED') ?? 'false') === 'true')
    ) {
      const escalated = await callVisionModel(aliases.escalation, stablePrefix, volatile, request.frame_b64);
      if (escalated.response !== null) {
        escalated.costUsdMicros += result.costUsdMicros;
        escalated.inputTokens += result.inputTokens;
        escalated.outputTokens += result.outputTokens;
        result = escalated;
      }
    }
    breaker.record(result.costUsdMicros);

    if (result.response === null) {
      return await deliver(NO_ADVICE_THIS_FRAME, 'degraded', result.model, result);
    }

    // 8. Advantage Check post-filter — the second wall (§1.1.2).
    const { response, refused } = enforceAdvantageCheck(result.response, title.pvp_flagged);
    return await deliver(response, refused ? 'refused_advantage' : 'ok', result.model, {
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      costUsdMicros: result.costUsdMicros,
    });
  } catch (err) {
    console.error('assist_unhandled', { name: (err as Error).name }); // no content logged
    await telemetry('error', 'none');
    return json(req, 200, NO_ADVICE_THIS_FRAME);
  }
});
