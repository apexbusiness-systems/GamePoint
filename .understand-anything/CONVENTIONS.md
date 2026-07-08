# Conventions

## Code Style

| Rule | Enforcement |
|------|-------------|
| TypeScript strict mode | `"strict": true` in [`tsconfig.base.json`](../tsconfig.base.json) |
| ES2022 target | `"target": "ES2022"` |
| React JSX transform | `"jsx": "react-jsx"` (no manual React imports needed) |
| No `any` | Strict mode rejects implicit any |
| Consistent casing | `"forceConsistentCasingInFileNames": true` |

## Package Management

- **Manager:** pnpm 10.28.1 (pinned in `package.json` via `packageManager` field)
- **Workspace:** `apps/*` and `packages/*` via [`pnpm-workspace.yaml`](../pnpm-workspace.yaml)
- **Install:** `pnpm install --frozen-lockfile` in CI
- **Filter:** `pnpm --filter <name>` for workspace-scoped commands

## CI Gates

Every PR and push to `main` must pass these gates in order.
See → [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

1. **Compliance gate** — `governance/ci/compliance-gate.sh`
2. **License gate** — `governance/ci/license-gate.py --check`
3. **Lint** — `pnpm lint` (runs both gates above at workspace root)
4. **Typecheck** — `pnpm typecheck` (`tsc -b` across all workspaces)
5. **Build** — `pnpm --filter web build`

## Branching

- **Production:** `main`
- **Feature branches:** topic branches off `main`, merged via PR
- **Deploy trigger:** push to `main` triggers Cloudflare Pages production deploy

## Naming

| Scope | Convention | Example |
|-------|-----------|---------|
| Workspace packages | lowercase kebab | `web`, `overlay`, `contracts`, `router` |
| TypeScript types | PascalCase | `CoachingResponse`, `SourceTier`, `AssistBudget` |
| CSS classes | lowercase kebab | `.hero`, `.grid`, `.card` |
| ADR files | `ADR-NNN-slug.md` | `ADR-005-cloudflare-frontend-hosting.md` |
| Env vars (browser) | `VITE_UPPER_SNAKE` | `VITE_SUPABASE_URL` |
| Env vars (server) | `UPPER_SNAKE` | `SUPABASE_SERVICE_ROLE_KEY` |

## File Organization

- Tests co-locate with source: `src/*.test.mjs`
- Public static assets: `apps/web/public/` (Vite copies to `dist/`)
- Cloudflare `_headers` and `_redirects` live in both `apps/web/` (source review) and `apps/web/public/` (build output)
