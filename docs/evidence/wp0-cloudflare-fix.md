# WP-0 Cloudflare Deploy Fix Evidence

## Failure

Cloudflare ran `npx wrangler deploy` from the monorepo root and Wrangler failed workspace application detection instead of targeting `apps/web`.

## Fix

- Added root `wrangler.toml` with an explicit `main`, `build.command`, and static assets directory.
- Added `workers/web-assets.ts` as a minimal static-asset Worker that serves `apps/web/dist` through the Cloudflare Assets binding.
- Kept Pages as the preferred hosting path in docs, but made the currently configured `npx wrangler deploy` command deterministic.

## Cloudflare Settings

Preferred Pages Git settings remain:

```text
Build command: pnpm --filter web build
Build output directory: apps/web/dist
Root directory: repository root
Deploy command: leave blank
```

Compatibility setting for the failing dashboard configuration:

```text
Deploy command: npx wrangler deploy
```
