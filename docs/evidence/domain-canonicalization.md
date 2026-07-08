# Domain Canonicalization Evidence

## Requirements Implemented

Canonical domain:

- `https://gamepointagent.com`

Redirect-only domains:

- `https://www.gamepointagent.com/*`
- `https://game-point.icu/*`
- `https://gamepointagent.ca/*`
- `https://gamepointagent.icu/*`
- `https://gamepointagent.info/*`

Reserved subdomains are documented but not routed as duplicate product sites.

## Implementation

- `apps/web/index.html` declares `<link rel="canonical" href="https://gamepointagent.com" />`.
- `apps/web/_redirects` and `apps/web/public/_redirects` declare 301 redirects for defensive domains.
- `workers/web-assets.ts` enforces 301 redirects before serving static assets on the current `npx wrangler deploy` compatibility path.
- `wrangler.toml` declares custom-domain routes for the canonical domain and redirect-only domains.
- `ENV.example` records the Supabase Auth redirect allowlist values that must be configured in the Supabase dashboard.

## Manual Cloudflare Settings Required

- SSL/TLS mode: Full Strict after DNS is stable.
- Always Use HTTPS / HTTPS redirects: enabled.
- Do not create separate product sites for defensive domains.
