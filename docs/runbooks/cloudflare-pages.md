# Cloudflare Pages Deployment Runbook

## Project

- Project name: `gamepoint`
- Production branch: `main`
- Build command: `pnpm --filter web build`
- Build output directory: `apps/web/dist`
- Root strategy: repository root with pnpm workspace filters

## Required Secrets

Use Cloudflare credentials only as runtime environment variables in the deployment shell or CI secret store. Do not commit tokens.

Required CI/runtime variables:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Local Preview/Production Deploy

```bash
pnpm --filter web build
CLOUDFLARE_API_TOKEN=<redacted> CLOUDFLARE_ACCOUNT_ID=<redacted> pnpm dlx wrangler pages deploy apps/web/dist --project-name gamepoint --branch main --commit-dirty=true
```

## Headers and Redirects

Cloudflare Pages reads `_headers` and `_redirects` from the deployment output directory. The source copies are kept at `apps/web/_headers` and `apps/web/_redirects` for review, and matching deploy copies are kept in `apps/web/public/` so Vite emits them into `apps/web/dist`.

## Rollback

Rollback from the Cloudflare dashboard by selecting the prior successful Pages deployment and promoting it to production. CLI rollback automation is `UNCERTAIN` until account-level release permissions are verified.
