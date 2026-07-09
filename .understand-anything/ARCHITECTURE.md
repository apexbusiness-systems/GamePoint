# Architecture

## Monorepo Layout

```
GamePoint/
├── apps/
│   ├── web/              # Public frontend (Vite + React → Cloudflare Pages)
│   └── overlay/          # Windows overlay (Vite + React → local runtime)
├── packages/
│   ├── contracts/        # Shared TypeScript types (CoachingResponse, SourceTier)
│   └── router/           # Assist budget definitions (token/latency/cost limits)
├── governance/
│   ├── ci/               # compliance-gate.sh, license-gate.py
│   └── compliance-matrix.md
├── docs/
│   ├── adr/              # Architecture Decision Records (ADR-001 through ADR-005)
│   ├── decisions/
│   ├── evidence/
│   ├── runbooks/         # cloudflare-pages.md
│   └── consent.md
├── .github/workflows/    # ci.yml
├── package.json          # Root workspace scripts
├── pnpm-workspace.yaml   # Workspace: apps/*, packages/*
└── tsconfig.base.json    # Shared TS config (strict, ES2022, react-jsx)
```

## Tech Stack

| Layer | Technology | Config |
|-------|-----------|--------|
| Language | TypeScript (strict mode) | `tsconfig.base.json` |
| Frontend Framework | React | Latest (via pnpm) |
| Bundler | Vite | `vite.config.ts` per app |
| Package Manager | pnpm 10.28.1 | `pnpm-workspace.yaml` |
| CI | GitHub Actions | `.github/workflows/ci.yml` |
| Hosting (web) | Cloudflare Pages | See → [`docs/runbooks/cloudflare-pages.md`](../docs/runbooks/cloudflare-pages.md) |
| Backend | Supabase (Auth, Postgres, RLS, Edge Functions) | Not in this repo (infra-managed) |

## Dependency Graph

```
apps/web ─────────► packages/contracts
apps/overlay ─────► packages/contracts
                    packages/router (standalone, no cross-deps)
```

## Build Commands

| Command | Scope | What It Does |
|---------|-------|-------------|
| `pnpm --filter web build` | `apps/web` | Vite production build → `apps/web/dist` |
| `pnpm typecheck` | All workspaces | `tsc -b` across all apps and packages |
| `pnpm lint` | Root | Compliance gate + license gate |
| `pnpm test` | All packages | Node test runner on `*.test.mjs` files |

## CI Pipeline

See → [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

Steps: checkout → pnpm install → compliance gate → license gate → lint → typecheck → build web.
