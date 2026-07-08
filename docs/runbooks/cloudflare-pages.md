# Cloudflare Cloud Deploy Runbook

## Project

- Pages project name: `gamepoint`
- Worker static-assets fallback name: `gamepoint-web`
- Production branch: `main`
- Build command: `pnpm --filter web build`
- Build output directory: `apps/web/dist`
- Root strategy: repository root with pnpm workspace filters

## Required Secrets

Use Cloudflare credentials only as runtime environment variables in the deployment shell or CI secret store. Do not commit tokens.

Required CI/runtime variables:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Cloudflare Dashboard Settings

Preferred Pages Git settings:

```text
Build command: pnpm --filter web build
Build output directory: apps/web/dist
Root directory: repository root
Deploy command: leave blank for Pages Git builds
```

If the Cloudflare project is configured to run `npx wrangler deploy`, the repository root now includes `wrangler.toml` and `workers/web-assets.ts` so that command targets the web static-assets Worker explicitly instead of triggering workspace auto-detection. This is a compatibility path for the current dashboard setting; Pages remains the intended frontend host.

## Local Preview/Production Deploy

```bash
pnpm --filter web build
CLOUDFLARE_API_TOKEN=<redacted> CLOUDFLARE_ACCOUNT_ID=<redacted> pnpm dlx wrangler pages deploy apps/web/dist --project-name gamepoint --branch main --commit-dirty=true
```

Wrangler deploy compatibility command:

```bash
npx wrangler deploy
```

## Custom Domain and Canonicalization

Canonical production domain: `https://gamepointagent.com`.

Required redirects:

- `https://www.gamepointagent.com/*` to `https://gamepointagent.com/:splat`
- `https://game-point.icu/*` to `https://gamepointagent.com/:splat`
- `https://gamepointagent.ca/*` to `https://gamepointagent.com/:splat`
- `https://gamepointagent.icu/*` to `https://gamepointagent.com/:splat`
- `https://gamepointagent.info/*` to `https://gamepointagent.com/:splat`

For the current `npx wrangler deploy` compatibility path, `wrangler.toml` declares custom-domain routes for the canonical domain and every redirect-only defensive domain. `workers/web-assets.ts` performs the 301 canonical redirects before serving static assets.

If Cloudflare Pages Git hosting is used instead, attach the same custom domains in the Pages dashboard and keep the generated `_redirects` file in `apps/web/dist`. A live `curl` check on 2026-07-08 returned `503 Service Unavailable` with body `DNS resolution failure`, which indicates the domain was not yet correctly resolving to a deployed Cloudflare target from this environment.

Reserved subdomains:

- `app.gamepointagent.com`: authenticated web shell / account portal
- `download.gamepointagent.com`: installer/download route
- `docs.gamepointagent.com`: future docs/support surface
- `status.gamepointagent.com`: future status page

SSL/TLS must be set to Full Strict after DNS is stable. HTTPS redirects must remain enabled in Cloudflare.

Supabase Auth redirect allowlist:

- `https://gamepointagent.com`
- `https://app.gamepointagent.com`
- local development URL only for development, currently `http://localhost:5173`

## Headers and Redirects

Cloudflare Pages reads `_headers` and `_redirects` from the deployment output directory. The source copies are kept at `apps/web/_headers` and `apps/web/_redirects` for review, and matching deploy copies are kept in `apps/web/public/` so Vite emits them into `apps/web/dist`.

## Rollback

Rollback from the Cloudflare dashboard by selecting the prior successful Pages deployment and promoting it to production. CLI rollback automation is `UNCERTAIN` until account-level release permissions are verified.
