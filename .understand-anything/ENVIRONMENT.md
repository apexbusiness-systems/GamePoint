# Environment Variables

> **Source of truth:** [`ENV.example`](../ENV.example)
> This file indexes every variable, its surface, and its exposure level.

## Browser-Exposed (VITE_ prefix)

These compile into the Vite bundle. They are **public by definition** — only publishable values.

| Variable | Surface | Description |
|----------|---------|-------------|
| `VITE_SUPABASE_URL` | `apps/web`, `apps/overlay` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `apps/web`, `apps/overlay` | Supabase anonymous (public) key |
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

## Model Provider Config (Server-Side)

| Variable | Description |
|----------|-------------|
| `MODEL_PROVIDER_PRIMARY` | Primary inference model alias |
| `MODEL_PROVIDER_FALLBACK` | Fallback model alias |
| `VISION_MODEL_PRIMARY` | Primary vision model alias |
| `VISION_MODEL_ESCALATION` | Escalation vision model alias |
| `TEXT_EMBEDDING_MODEL` | Embedding model alias |

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
