# Preflight Evidence

## Environment
- OS: Linux e45f42f0044f 6.12.47 x86_64 (container)
- Node: v20.20.2
- Package manager: no existing lockfile; selected pnpm 10.28.1 for the monorepo
- Rust: rustc 1.89.0; cargo 1.89.0
- Supabase CLI: UNCERTAIN: `supabase` command not found
- Python: Python 3.12.13
- Wrangler/Cloudflare: UNCERTAIN: `wrangler` command not found and no Cloudflare project/account env detected

## Checks
| ID | Verdict | Evidence | Next |
|---|---|---|---|
| P1 | YELLOW | Repo root was readable and contained only `.git`; no app/package/docs/governance/deploy topology existed before scaffold. | Safe scaffold allowed by contract. |
| P2 | YELLOW | `find` found no `package.json`, `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock`. | Use pnpm and create workspace files. |
| P3 | YELLOW | `supabase --version` returned command not found. | Install Supabase CLI, link project, then run `supabase db push --dry-run` and `supabase test db`. |
| P4 | YELLOW | Initial repo file scan found no source files or env files; no secrets detected by available tools. Gitleaks unavailable. | Install gitleaks and run `gitleaks detect --no-git --redact`. |
| P5 | YELLOW | No Supabase migrations existed; pgvector version not locally verifiable without Supabase/Postgres. | Record pgvector extension requirement in migrations during WP-1. |
| P6 | YELLOW | Rust toolchain exists (`rustc 1.89.0`, `cargo 1.89.0`), but no Rust workspace existed pre-scaffold and Windows capture cannot be benchmarked here. | Add Rust workspace in later WP and run `cargo check`, `cargo clippy -- -D warnings`, `cargo test`. |
| P7 | YELLOW | No title research report existed. | Use only safe ineligible placeholder rows until verified source data exists. |
| P8 | YELLOW | `gitleaks` command not found. | Install with package manager or release binary; run `gitleaks detect --no-git --redact`. |
| P9 | YELLOW | No Cloudflare config existed; `wrangler` command not found; account unavailable. | Scaffold Cloudflare Pages static app and document dashboard/Git setup. |
| P10 | YELLOW | No pricing source or provider config existed. | Use model/provider aliases only; mark live pricing unverified before production. |

## Lane
YELLOW

## Blockers
- NONE for local WP-0 scaffold.
- Deployment and production release remain blocked until Supabase CLI/project, Cloudflare account/project, gitleaks, title research, and provider pricing are verified.

## Re-run 2026-07-08 (production-build session, contract v1.1)
- Node v22.22.2, pnpm 10.28.1, cargo 1.94.1, Python 3.11.15 (contract said 3.12 — audit A6), pytest available.
- Supabase CLI: still absent → P1/P2/P3 remain YELLOW; all SQL + pgTAP delivered with runbook `docs/runbooks/supabase-deploy.md`.
- Deno absent → Edge Function logic lives in node-tested `packages/*`; Deno files are thin adapters.
- gitleaks absent → grep-based secret scan in compliance-gate.sh + `git grep` audit (output in wp6 evidence).
- P5 now PASS: `governance/compliance-matrix.md` seeded with 16 grounded titles + logged UNCERTAIN gap (audit A3).
- Lane: **YELLOW** — execute all WPs with local verification where runnable; deploy-gated items enumerated per §6.
