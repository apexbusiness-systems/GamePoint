# ADR-005: Cloudflare Frontend Hosting

## Status
Accepted for v1.0.

## Decision
`apps/web` is hosted on Cloudflare Pages as the public web control plane. It is not in the gameplay capture path and does not duplicate Supabase assist or retrieval logic.

## Framework
Vite + React. The repository was empty, and this stack matches the planned overlay frontend, keeps the monorepo simple, and builds static assets to `dist`.

## Cloudflare Pages Configuration
- Root directory strategy: repository root with monorepo-aware pnpm filter commands.
- Build command: `pnpm --filter web build`.
- Build output directory: `apps/web/dist`.
- Production branch: `main` unless release governance changes it.
- Preview deployments: enabled for pull requests when Cloudflare account support is configured.
- Custom domain: `UNCERTAIN: not configured in this environment`.
- Headers: `apps/web/_headers` supplies baseline security headers.
- Redirects: `apps/web/_redirects` supplies SPA fallback.

## Environment Boundary
Browser-exposed values must use Vite's `VITE_` prefix and be publishable only:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GAMEPOINT_DOWNLOAD_URL`
- `VITE_SUPPORTED_TITLES_SOURCE`

Server-only values such as `SUPABASE_SERVICE_ROLE_KEY`, provider keys, and private telemetry configuration must never be exposed to the web bundle.

## Supabase Source of Truth
Supabase remains the backend source of truth for Auth, Postgres, RLS, retrieval, telemetry, Edge Functions, and Realtime/Broadcast. Cloudflare Pages hosts static frontend assets only in v1.0.
