# Architecture

## Monorepo Layout

```
GamePoint/
├── apps/
│   ├── web/              # Public site + authenticated product plane (Vite + React → Cloudflare Workers assets)
│   └── overlay/          # Windows overlay UI (Vite + React → local runtime; binds to SessionConfig, ADR-008)
├── services/
│   └── capture-win/      # Rust capture engine — crates: capture (DXGI), ringbuf-x, dispatch (HTTPS/JSON), svc, win_probe
├── packages/
│   ├── contracts/        # Zod single contract source (ADR-007) + golden fixtures (TS/Rust parity)
│   ├── router/           # Assist budgets, prompt builder, cascade + Advantage Check (synced to Edge)
│   └── ingest/           # Python licensed-source ingestion (license_enforcer quarantines non-commercial)
├── supabase/
│   ├── migrations/       # 001–008 (titles, knowledge, embeddings, users, RLS, retrieval, broadcast, lifecycle)
│   ├── functions/        # Edge: assist, ingest-webhook, retrieval-plan + _shared (synced contracts/router)
│   └── tests/            # pgTAP RLS suite (CI/staging only — never against production)
├── workers/              # Cloudflare canonical-host redirect worker (web-assets.ts, wrangler.jsonc)
├── governance/
│   ├── ci/               # compliance-gate.sh, license-gate.py
│   └── compliance-matrix.md
├── memory/omni-recall/   # Durable agent memory & session continuity
├── docs/
│   ├── adr/              # ADR-001 … ADR-009
│   ├── evidence/         # Per-work-package verification evidence
│   ├── runbooks/         # cloudflare-pages.md, supabase-deploy.md
│   └── consent.md
├── .github/workflows/    # ci.yml — 7 jobs (gates-and-ts, rust, ingest, edge-typecheck, security, browser-e2e, smoke)
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
| Hosting (web) | Cloudflare Workers (static assets + canonical-host worker) | `wrangler.jsonc`, [`docs/runbooks/cloudflare-pages.md`](../docs/runbooks/cloudflare-pages.md) |
| Backend | Supabase (Auth, Postgres+RLS, Edge Functions, Realtime) | `supabase/` — migrations 001–008 applied to prod |
| Capture service | Rust (windows-rs, DXGI Desktop Duplication) | `services/capture-win/` |
| Models | Hybrid providers: Groq / Gemini / OpenAI-compatible (ADR-009) | Aliases `groq:…`, `gemini:…`; adaptive health circuit |
| Ingestion | Python 3.11 + pytest | `packages/ingest/` |

## Dependency Graph

```
apps/web ─────────► packages/contracts (SessionConfig export, ADR-008)
apps/overlay ─────► packages/contracts (binding + HUD response parse)
packages/router ──► packages/contracts
supabase/functions/_shared ◄─ sync-edge.mjs (hash-checked copies of contracts + router)
services/capture-win/dispatch ◄─ serde mirror of contracts (golden-fixture parity in CI)
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
