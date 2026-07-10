# ADR-009: Hybrid Multi-Provider Model Routing

## Status
Accepted for v1.1 (2026-07-09).

## Context
ADR-004 aliased models behind env vars but every call went through a single
`OPENAI_BASE_URL`, so the whole cascade lived or died with one vendor and one
paid key. The business need: free-tier capacity now (Groq, Google AI Studio)
and resilience if one provider fails or throttles.

## Decision
1. **Provider-prefixed aliases.** `VISION_MODEL_*` values take the form
   `<provider>:<model>` (`groq:`, `gemini:`, `openai:`); un-prefixed aliases
   resolve to openai for back-compat. Registry in `assist/index.ts`; base URLs
   overridable via `GROQ_BASE_URL` / `GEMINI_BASE_URL` / `OPENAI_BASE_URL`.
2. **Defaults (free-tier hybrid):** primary
   `groq:meta-llama/llama-4-scout-17b-16e-instruct` (vision + strict
   json_schema, verified live), fallback `gemini:gemini-flash-lite-latest`
   (verified live), escalation `gemini:gemini-2.5-flash` (off by default,
   ADR-004 unchanged).
3. **Cross-provider failover.** Cascade: primary → one retry (same alias) →
   fallback alias (other vendor) → `NO_ADVICE_THIS_FRAME`. A missing provider
   key fails fast to the next stage instead of throwing.
4. **Embeddings provider order.** `EMBEDDINGS_PROVIDER_ORDER` (default
   `gemini,openai`); Gemini uses `gemini-embedding-001` pinned to
   `dimensions: 1536` to match `vector(1536)` in 003_embeddings.sql. Any
   provider failure degrades to null (retrieval returns no chunks) — never a
   crash. Results are only accepted at exactly 1536 dims.
5. **Key placement.** `GROQ_API_KEY` / `GEMINI_API_KEY` live in **Supabase
   Edge Function secrets only** (charter invariant 10). Not Cloudflare (static
   hosting only, ADR-005), not GitHub (CI never calls models), never `VITE_*`.

6. **Adaptive provider health circuit.** A provider that hard-fails (network
   error, 429, 5xx) is cooled down for `PROVIDER_COOLDOWN_MS` (default 120 s)
   and skipped instantly by both the vision cascade and the embeddings chain,
   then automatically retried after the window — failover is autonomous in both
   directions (out and back). 4xx config errors do not trip the circuit (an
   alias typo must not exile a healthy vendor). State is in-memory per isolate:
   a cold start costs at most one probe per provider.

## Consequences
- Zero new dependencies; both providers speak the OpenAI chat/completions shape.
- Telemetry `model` column now records the full alias (`groq:…`), so outcome
  rates per provider are queryable.
- Free tiers may use request data for training — acceptable for development
  proof, NOT for GA player frames. GA requires paid tiers with data controls
  and licensed-lawyer review (compliance flag, carried forward).
- One breaker (ADR-004) still governs total cascade cost; free-tier rates are
  set to 0 micros so the breaker reflects real spend.
