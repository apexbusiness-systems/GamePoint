# GamePoint Cowork Evidence Log

## Repo baseline
- Commit (HEAD): `747ffc86c51566ec5c5dc8643c4d02c83bb586e4` — "fix(web): correct layout overlap and add dynamic interactive effects"
- Branch: `feat/ci-e2e-auth-gating` (not `main`; `main` is at `c1500d7`, one commit behind)
- Committed: 2026-07-09 01:19:11 -0600
- Verified: 2026-07-09 (this session)
- Agent: Claude (Cowork)

## Verified files

| File | Verified? | Key finding | Risk |
|---|---:|---|---|
| `apps/web/src/main.tsx` | Yes | Exists but **truncated in working tree**: 12,647 bytes vs 15,088 committed (lost 2,441 bytes). Cuts off mid-JSX (`<RouteL`). Would fail build. | **Critical** |
| `apps/web/src/app.tsx` | Yes | Present, byte-identical content to HEAD aside from CRLF normalization (benign). Real Supabase auth/onboarding/profile/sessions/dashboard/settings/Coach Squad/honest-gate app confirmed present at 485 lines. | Low |
| `apps/web/src/lib.tsx` (contract expected `lib/*`) | Yes | Single-file `lib.tsx`, not a `lib/` directory — naming drift from contract text only, not a functional gap. CRLF-only diff. | Low |
| `apps/overlay/src/App.tsx`, `state.ts`, `realtime.ts` | Yes | Present, CRLF-only diffs (benign). `apps/overlay/src/main.tsx` is **truncated** (2,758 vs 3,336 bytes, -578). | **Critical** (main.tsx) |
| `packages/contracts/src/index.ts` | Yes | **Severely truncated**: 264 bytes vs 4,883 committed (94% lost). File ends mid-statement (`export c`). This is the Zod single-source-of-truth (ADR-007) — breaks typecheck/build for every consumer (web, overlay, edge functions, Rust dispatch parity tests). | **Critical** |
| `governance/compliance-matrix.md` | Yes | **Severely truncated**: 870 bytes vs 5,209 committed (83% lost). Working copy is prose only — the entire title verdict table (16 rows, Wave 1/Wave 2) is missing from the working tree. Title-gating source of truth is currently unreadable as intended. | **Critical** |
| `governance/ci/compliance-gate.sh` | Yes | **Truncated**: 1,142 vs 1,874 bytes. Missing the trailing `exit "$status"` and the service-role-key-pattern check block. As currently truncated, the script has no explicit exit code — **the compliance gate would not fail the build even if a banned pattern is found**, because control falls off the end of the script. | **Critical (silent-pass gate defect)** |
| `packages/router/src/index.ts` | Yes (found during full-repo scan) | **Severely truncated**: 451 vs 6,177 bytes (93% lost). This is the assist-budget circuit-breaker module (Invariant #9 — 1200 tok / 120 tok / 786,432 px / 2 ROIs / 1500ms / 500µ$ ceilings). | **Critical** |
| `packages/router/src/router.test.mjs` | Yes | Truncated 146 vs 4,776 bytes (97% lost). | **Critical** |
| `packages/contracts/src/contracts.test.mjs`, `packages/contracts/package.json` | Yes | Both truncated; package.json likely invalid JSON as-is. | **Critical** |
| `.github/workflows/ci.yml` | Yes | Truncated 566 vs 4,445 bytes (87% lost) — CI pipeline definition itself is gutted. | **Critical** |
| `wrangler.jsonc`, `pnpm-lock.yaml`, root `package.json` | Yes | All truncated — Cloudflare deploy config and dependency lockfile integrity compromised. `pnpm install`/build likely to fail or drift. | **Critical** |
| `supabase/migrations/*` (001–007) | Yes | Present, all 7 files exist, CRLF-only diffs vs HEAD (benign) — no truncation. | Low |
| Git repository state | Yes | `.git/index` is **corrupt** (`fatal: index file corrupt` / unrecognized extension). `git status`, `git diff`, `git add` are non-functional until the index is rebuilt. `git show <sha>:<path>` and `git log <ref>` work normally (object store is intact). HEAD points to `feat/ci-e2e-auth-gating`, not `main`. | **High** (blocks normal git workflow, not build) |
| Repo root hygiene | Yes | Untracked ad-hoc scripts at repo root (`append_css.py`, `bump_fonts.py`, `inject_dynamic_css.py`, `inject_dynamic_react.py`, `refactor_main.py`, `gui.py`) directly regex-rewrite `main.tsx`/`styles.css` outside any reviewed change process. Also an untracked 9.3MB zip bundle and 5 screenshots at root. | Medium (process risk, not itself broken) |

## Full-repo truncation scan
Comparing every one of ~110 tracked files (working tree vs commit `747ffc8` via `git show`, which reads the object store directly and is unaffected by the index corruption):
- **~85 files**: byte-count drift consistent with LF→CRLF line-ending normalization only (benign, Windows checkout artifact).
- **22 files**: genuine truncation (working tree smaller than committed by more than line-ending noise could explain, each cutting off mid-token). Full list: `.github/workflows/ci.yml`, `.gitignore`, `ENV.example`, `apps/overlay/package.json`, `apps/overlay/src/main.tsx`, `apps/overlay/src/styles.css`, `apps/overlay/src/vite-env.d.ts`, `apps/web/index.html`, `apps/web/package.json`, `apps/web/src/main.tsx`, `apps/web/src/styles.css`, `docs/runbooks/cloudflare-pages.md`, `governance/ci/compliance-gate.sh`, `governance/compliance-matrix.md`, `package.json`, `packages/contracts/package.json`, `packages/contracts/src/contracts.test.mjs`, `packages/contracts/src/index.ts`, `packages/router/package.json`, `packages/router/src/index.ts`, `packages/router/src/router.test.mjs`, `pnpm-lock.yaml`, `wrangler.jsonc`.

**Pattern**: every truncated file cuts off mid-token (mid-JSX-tag, mid-export-statement, mid-word), never at a clean boundary. This is consistent with an interrupted bulk write/sync, not an intentional in-progress edit. The truncated set skews heavily toward the project's own enforcement backbone: compliance gate, compliance matrix, CI workflow, router circuit-breaker, and contracts single-source-of-truth are all in the truncated set.

## Baseline verdict
**BLOCKED: repo baseline drift**

## Drift from contract
- [ ] None
- [x] Drift found — repo baseline does **not** match a buildable/enforceable state right now:
  1. Working tree has 22 files truncated relative to last commit `747ffc8`, including every file that enforces a NON-NEGOTIABLE invariant (compliance gate exit code, compliance matrix table, router circuit breaker, Zod contracts, CI workflow).
  2. `.git/index` is corrupt — normal git workflow (status/diff/add) is unusable until rebuilt.
  3. HEAD is on `feat/ci-e2e-auth-gating`, one commit ahead of `main` — confirm this is the intended working branch before any release action.
  4. Root-level ad-hoc Python scripts perform unreviewed regex rewrites of `main.tsx`/`styles.css` outside the sanctioned change process.

## Recommended recovery (not yet executed — pending JR decision)
All 22 truncated files have a complete, intact copy in the git object store at `747ffc8` (confirmed via `git show`, which does not depend on the corrupted index). The lowest-risk fix is to restore each truncated file's content from that commit — this is a pure read from git's own history, not reconstructed/invented content, and is fully reversible. Separately, `.git/index` can be rebuilt safely from HEAD without touching any tracked file content.

## Remediation completed (post-decision)
JR decision: restore all 22 truncated files from HEAD (`747ffc8`); handle credential rotation outside this session.

- All 22 truncated files restored via `git show 747ffc8:<path>` (direct object-store read, bypasses the corrupt index) and verified **byte-exact** against the commit. `governance/ci/compliance-gate.sh` re-marked executable (`chmod +x`).
- `.git/index` repair was **attempted but not fully resolved** in this sandbox: an old, stale `.git/index.lock` (dated 2026-07-08 08:19, predates this session) intermittently blocks git from writing a fresh index, and directory listings for `.git/` were inconsistent between calls (a glob found `index.lock`, a direct `ls` on the same path did not). That inconsistency pattern is a strong signal the working folder sits inside a cloud-sync client (OneDrive/similar) on the Windows side, which would also explain the original 22-file truncation (a sync write interrupted mid-flush) and the index corruption (sync touching `.git/index` while git held it open). This cannot be reliably fixed from the Linux sandbox.
- **Action needed on the Windows side**: confirm whether `C:\Users\sinyo\GamePoint\GamePoint` is inside a OneDrive/Dropbox/iCloud-synced folder. If so, pause sync for that folder (or exclude `.git/`), then in a local terminal: delete `.git/index` and `.git/index.lock`, run `git status` once to rebuild the index cleanly, and re-verify `git log --oneline -5` still shows `747ffc86c` as HEAD of `feat/ci-e2e-auth-gating`. Until then, `git status`/`git add`/`git commit` may be unreliable even though the restored files themselves are confirmed correct on disk.
- Verified no working-tree file content was lost or altered outside the 22 named files; the ~85 CRLF-only diffs were left untouched per the authorized scope.

## Phase 1-5 complete
See `docs/evidence/GO-NO-GO-v2-cowork-2026-07-09.md` for the full release-gate report:
genre/content alignment (GAP A), Coach Squad UX correction (GAP B), gate/empty-state
verification (GAP C/D), Supabase env hygiene (GAP E), and release validation (GAP F) —
verdict **GO**, pending credential rotation and a Windows-side fix to the sync/mount
issue that caused this session's file truncations (recurred twice more after the initial
22-file fix, on `styles.css` and three `.tsx` files, before being caught by re-running
the actual test/build gates rather than trust