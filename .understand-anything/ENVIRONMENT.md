# Environment Variables

> **Source of truth:** [`ENV.example`](../ENV.example)
> This file indexes every variable, its surface, and its exposure level.

## Browser-Exposed (VITE_ prefix)

These compile into the Vite bundle. They are **public by definition** — only publishable values.

| Variable | Surface | Description |
|----------|---------|-------------|
| `VITE_SUPABASE_URL` | `apps/web`, `apps/overlay` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `apps/web` | Publishable key (the web client reads this name) |
| `VITE_SUPABASE_ANON_KEY` | `apps/overlay` | Anon key (overlay env fallback; RLS-protected) |
| `VITE_GAMEPOINT_DOWNLOAD_URL` | `apps/web` | Download page target URL |
| `VITE_SUPPORTED_TITLES_SOURCE` | `apps/web` | Title list source (`fixture` or `api`) |

## Server-Side Only (Supabase Edge Functions)

These run exclusively in Supabase Deno runtime. Never in a browser bundle.

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL (server context) |
| `SUPABASE_ANON_KEY` | Anon key (server context) |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRET** — bypasses RLS, admin access |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |

## Model Provider Config (Server-Side — Supabase Edge secrets ONLY, ADR-009)

Aliases are provider-prefixed: `<provider>:<model>` with active providers `groq` and `gemini` (`openai` excluded/deprecated).

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` / `GEMINI_API_KEY` | Provider keys — never in Cloudflare, GitHub, or `VITE_*` |
| `GROQ_BASE_URL` / `GEMINI_BASE_URL` | Optional endpoint overrides |
| `VISION_MODEL_PRIMARY` | Default `groq:meta-llama/llama-4-scout-17b-16e-instruct` |
| `VISION_MODEL_ESCALATION` | Default `gemini:gemini-2.5-flash` (`ASSIST_ESCALATION_ALLOWED=true` required) |
| `VISION_MODEL_FALLBACK` | Default `gemini:gemini-flash-lite-latest` (cross-provider failover) |
| `EMBEDDINGS_PROVIDER_ORDER` | Default `gemini` (`openai` excluded); Gemini pinned to 1536 dims (`vector(1536)`) |
| `GEMINI_EMBEDDING_MODEL` / `TEXT_EMBEDDING_MODEL` | Embedding model overrides per provider |
| `PROVIDER_COOLDOWN_MS` | Adaptive health circuit cooldown (default 120000) |
| `ASSIST_RATE_LIMIT_PER_MIN` | Per-user sliding-window rate limit (default 12) |
| `COST_INPUT_MICROS_PER_TOKEN` / `COST_OUTPUT_MICROS_PER_TOKEN` | µ$/token accounting (0 on free tier) |

### Placement rule (charter invariant 10)
| Platform | Gets |
|---|---|
| Supabase Edge secrets | ALL provider keys + server config above |
| Cloudflare build vars | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` only |
| GitHub Actions | Nothing today (CI needs no secrets); deploy tokens only if CI-driven deploys are added |

## Assist Budget Defaults (Server-Side)

These configure cost and latency circuit breakers. Defaults are in [`packages/router/src/index.ts`](../packages/router/src/index.ts).

| Variable | Default | Description |
|----------|---------|-------------|
| `ASSIST_MAX_INPUT_TOKENS` | 1200 | Max input tokens per request |
| `ASSIST_MAX_OUTPUT_TOKENS` | 120 | Max output tokens per response |
| `ASSIST_MAX_IMAGE_PIXELS` | 786432 | Max image pixel count |
| `ASSIST_MAX_ROIS` | 2 | Max regions of interest per frame |
| `ASSIST_MAX_RETRIEVAL_CHUNKS` | 4 | Max retrieval chunks |
| `ASSIST_MAX_LATENCY_MS` | 1500 | Max allowed latency |
| `ASSIST_MAX_COST_USD_MICROS` | 500 | Max cost per request (microdollars) |
| `ASSIST_ESCALATION_ALLOWED` | false | Whether model escalation is permitted |

## CI/Deployment Secrets

These exist in CI secret stores or operator shells only. Never committed.

| Variable | Where | Description |
|----------|-------|-------------|
| `CLOUDFLARE_API_TOKEN` | CI / operator shell | Cloudflare API token for Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | CI / operator shell | Cloudflare account identifier |
| `GITHUB_TOKEN` | CI | GitHub PAT for repo operations |
