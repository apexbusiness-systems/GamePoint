# Deployment Topology

## Surface Map

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE (CDN + DNS)                     │
│                                                               │
│  gamepointagent.com ──► Cloudflare Pages (apps/web/dist)     │
│  *.gamepointagent.com ──► Reserved subdomains (see below)    │
│                                                               │
│  301 Redirects:                                               │
│    www.gamepointagent.com/* → gamepointagent.com/$1           │
│    game-point.icu/*        → gamepointagent.com/$1           │
│    gamepointagent.ca/*     → gamepointagent.com/$1           │
│    gamepointagent.icu/*    → gamepointagent.com/$1           │
│    gamepointagent.info/*   → gamepointagent.com/$1           │
└──────────────────────────────┬────────────────────────────────┘
                               │ API calls (anon key only)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend Authority)               │
│                                                               │
│  Auth        — email/password, OAuth, magic link             │
│  Postgres    — all application data, RLS-enforced            │
│  Edge Fns    — assist pipeline, coaching inference           │
│  Realtime    — session broadcast (future)                    │
│  Storage     — evidence artifacts (future)                   │
└─────────────────────────────────────────────────────────────┘
```

## Canonical Domain

**`gamepointagent.com`** — all traffic resolves here.

## Reserved Subdomains

| Subdomain | Purpose | Status |
|-----------|---------|--------|
| `app.gamepointagent.com` | Authenticated web shell / account portal | Reserved |
| `download.gamepointagent.com` | Installer / download route | Reserved |
| `docs.gamepointagent.com` | Docs / support surface | Reserved |
| `status.gamepointagent.com` | Status page | Reserved |

## Defensive Domains (301 → canonical)

All non-canonical domains 301 redirect to `gamepointagent.com`. No duplicate product sites.

- `www.gamepointagent.com`
- `game-point.icu`
- `gamepointagent.ca`
- `gamepointagent.icu`
- `gamepointagent.info`

## Cloudflare Configuration

| Setting | Value |
|---------|-------|
| Zone ID | `598a790c1cd4b0c39fd2ad0e4febaa94` |
| Account ID | `0e8eae2bf578dbf1ea95a2542b09edb5` |
| SSL/TLS | Full (Strict) — after DNS stable |
| HTTPS Redirects | Enabled |
| Security Headers | Via `_headers` file in build output |
| Pages Project Name | `gamepoint` |
| Build Command | `pnpm --filter web build` |
| Build Output | `apps/web/dist` |
| Production Branch | `main` |

## Supabase Auth Redirect Allowlist

```
https://gamepointagent.com
https://app.gamepointagent.com
http://localhost:5173          (dev only)
```

## Hard Rules

1. Cloudflare hosts static assets only — never becomes a second backend.
2. Supabase is the backend authority for auth, database, RLS, Edge Functions, retrieval, telemetry.
3. No duplicate product sites across defensive domains.
4. All non-canonical domains must 301 redirect.
5. Frontend must include: `<link rel="canonical" href="https://gamepointagent.com" />`

## Runbook

See → [`docs/runbooks/cloudflare-pages.md`](../docs/runbooks/cloudflare-pages.md)
