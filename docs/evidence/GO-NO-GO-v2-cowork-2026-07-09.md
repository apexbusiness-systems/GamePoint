# GamePoint Release Gate Report — Cowork pass, 2026-07-09

Supersedes `GO-NO-GO-v1.md` for the state of branch `feat/ci-e2e-auth-gating` after this
pass. Full file-by-file evidence: `audit/gamepoint-cowork-evidence.md`.

## Verdict

**GO** — with one item outside this session's authority (credential rotation, owner: JR)
and one environmental caveat (see Remaining risks).

## Summary

- **What changed:** Restored 22 files truncated by an unstable working-tree
  sync/mount (see Remaining risks) back to their last-known-good commit content;
  neutralized tactical-shooter-specific copy (Valorant map names, bombsite/econ jargon)
  on the public marketing demo and overlay dev fixture per GAP A; made Coach Squad cards
  directly interactive and mapped 1:1 to `coaching_mode` with single-engine disclosure copy
  per GAP B; fixed an `.env.example` variable-name mismatch (`VITE_SUPABASE_ANON_KEY` vs.
  the code's actual `VITE_SUPABASE_PUBLISHABLE_KEY`) per GAP E; fixed three pre-existing
  test failures found during validation (dead `href="#"` anchors in the marketing footer,
  a missing "Not runtime supported" disclosure on the public landing page, a missing brand
  metaphor line required by the voice-lexicon test); restored a missing `exit "$status"`
  in `compliance-gate.sh` (it had been truncated to a state where it could not fail a
  build even on a violation).
- **What was preserved:** All real Supabase auth/onboarding/session/dashboard flows in
  `app.tsx`; all honest gates for Live Overlay, Replay Review, and Community; the
  `inert`+"PRODUCT PREVIEW" labeling discipline on the marketing demo (moved `inert` to
  the correct element — see Remaining risks); the compliance matrix's 16-title table and
  its Wave 1/Wave 2 verdicts; Strategy Board's demo-only status (no authenticated route
  exists for it, so no gate was needed there).
- **What remains intentionally gated:** Live Overlay, Replay Review, Community — all
  unchanged, still honest "not yet available" gates per ADR-001/003 and this contract's
  Hard Do-Not-Do list. No backend schema was added.

## Evidence

| Check | Command / Method | Result | Evidence location |
|---|---|---:|---|
| Lint | `pnpm lint` (compliance-gate.sh + license-gate.py) | PASS | fresh install + run, /tmp/gp-validate-final |
| Typecheck | `pnpm typecheck` (`tsc -b` across web/overlay/contracts/router) | PASS | same |
| Tests (root: contracts, router, overlay) | `pnpm test` | PASS 33/33 | same |
| Tests (web) | `node --test apps/web/src/*.test.mjs` | PASS 11/11 | same |
| Build (web) | `pnpm --filter web build` | PASS — 431.5 kB JS / 28.9 kB CSS (gzip 120.7/7.1 kB) | same |
| Build (overlay) | `pnpm --filter overlay build` | PASS — 193.2 kB JS / 5.7 kB CSS (gzip 60.9/2.0 kB) | same |
| Compliance gate | `bash governance/ci/compliance-gate.sh` | PASS (now correctly exits non-zero on violation — was structurally unable to fail before this pass) | governance/ci/compliance-gate.sh |
| Manual flow | Source-level review of `app.tsx` routing/gating (not a live browser session — no dev server was exercised end-to-end in this pass) | Reviewed, not click-tested | see Remaining risks |

All five checks above were run twice: once mid-pass, and once from a **fully independent
fresh copy + fresh `pnpm install`** (`/tmp/gp-validate-final`) to rule out stale-cache
false positives after the mount-corruption issue below was discovered. Both runs are
clean.

## Product-state truth table

| Surface | Real / Demo / Gated | Backend source | User-facing disclosure |
|---|---|---|---|
| Landing preview | Demo | Static sample data | "PRODUCT PREVIEW" chip + "Sample data" text; demo widgets now correctly `inert`, nav CTAs (Sign In, Start Coaching Free, Replay/Overlay/Community links, Coach Squad "All Coaches") are live |
| Auth dashboard | Real | Supabase `sessions`/`profiles` | "No sessions yet" honest empty state |
| Sessions | Real | Supabase `titles`/`sessions`, `canStartSession`/`gateReason` | Per-title cleared/blocked reason shown inline |
| Coach Squad | Real | Supabase `profiles.coaching_mode` | Cards are the control now; "does not run four separate agents" disclosure |
| Insights | Real | Supabase `advice_events` | "No coaching telemetry yet... nothing is simulated here" |
| Live Overlay (web) | Gated | N/A | "Not yet distributed — no download is offered because none is ready" |
| Replay Review | Gated | N/A | "there are no captures to review — this page will not fake one" |
| Community | Gated | N/A | "No seeded posts, no bots" |
| Overlay HUD | Real (state machine) + Demo (dev fixture) | `state.ts` reducer / `realtime.ts` Supabase broadcast, fixture fallback in dev only | Consent screen, "Capture off"/"Watching"/"Offline" text states |

## Remaining risks

| Risk | Severity | Owner | Recommendation |
|---|---|---|---|
| Uploaded `GamePoint - ENV.md` exposed live production secrets (DB password, Cloudflare API token + account/zone IDs, a GitHub PAT, Supabase service-role/anon/secret/publishable keys) to this chat session | **Critical** | JR | Rotate all listed credentials now, independent of this report. Not touched or referenced by any change in this pass. |
| The connected working-tree folder (`C:\Users\sinyo\GamePoint\GamePoint`) sits behind an unstable sync/mount: at least 3 separate file writes during this session were silently truncated mid-flush (`packages/router/src/index.ts` and 21 others at session start; `apps/overlay/src/main.tsx`, `apps/web/src/main.tsx`, `apps/web/src/app.tsx`, and `apps/web/src/styles.css` again mid-session, after being fixed once already), while `.git/index` independently corrupted the same way | **High** | JR | Check whether this folder is inside OneDrive/Dropbox/iCloud sync; pause sync for it (or exclude `.git/` and working files from sync) before the next work session. Until resolved, treat any single verification pass as provisional — this report's evidence came from a **second, independent fresh-copy run** specifically to control for this. |
| No live browser/E2E pass was run in this session (Playwright `apps/web/e2e/user-shoes.spec.ts` exists but was not executed — needs a running dev server and was out of scope given the file-integrity issue above consumed the session's verification budget) | Medium | JR / next session | Run `pnpm --filter web e2e` in an environment confirmed free of the sync issue, particularly to click-verify the new interactive Coach Squad cards and the corrected `inert` boundary on the demo surface. |
| `main` branch (`c1500d7`) is one commit behind the working branch `feat/ci-e2e-auth-gating` (`747ffc8`, now with this pass's fixes on top, uncommitted) | Low | JR | Confirm `feat/ci-e2e-auth-gating` is still the intended integration branch before merging; nothing in this pass was committed (git index issue — see evidence log) so all changes are working-tree only until JR commits them. |

## Pre-existing defects found and fixed in this pass (not part of the original gap list)

1. `governance/ci/compliance-gate.sh` was missing its trailing `exit "$status"` — the gate could not fail a build even on a real violation. Restored from git HEAD.
2. `.env.example` documented `VITE_SUPABASE_ANON_KEY`, but the actual code (`apps/web/src/lib.tsx`, `apps/web/src/app.tsx`) reads `VITE_SUPABASE_PUBLISHABLE_KEY` — anyone following the example file would hit the "Auth not configured" gate. Fixed to match the code.
3. `apps/web/src/main.tsx`: the `inert` attribute was on the outer `<main className="cockpit" inert>`, disabling the demo bar's real navigation links (Replay Review →, Live Overlay →, Community →, All Coaches →) along with the intentionally-fake preview widgets. Moved to just the `demo-surface` div, matching the pre-existing (but until now failing) test `landing demo panels are marked inert and labeled as preview`.
4. `apps/web/src/main.tsx` footer had three dead `href="#"` links and was missing the required "Not runtime supported until cleared" disclosure — both caught by pre-existing tests (`no dead hash anchors...`, `web copy states privacy boundary`) that were failing before this pass touched anything.
5. `apps/web/src/main.tsx` was missing the required brand metaphor ("coach in your corner: it watches the fight, it never touches the controls") that `apps/overlay/src/voice.test.mjs` requires verbatim on both the consent screen and the web landing page — present on the overlay side only. Added to the hero paragraph.

None of these were introduced by this pass; all were caught because Phase 5 ran the actual test suites rather than relying on a read-through.

## Final recommendation

**Ship the code changes** (after JR reviews and commits the working-tree diff — nothing
was committed automatically). **Do not ship without rotating the exposed credentials
first**, and confirm the sync/mount issue is resolved on the Windows side before trusting
any future single-pass verification in this folder without a fresh-copy cross-check.
