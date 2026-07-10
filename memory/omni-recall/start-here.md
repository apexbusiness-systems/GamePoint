# Omni-Recall — GamePoint session continuity

**Purpose:** durable agent memory for this repo. `.understand-anything/` explains the
codebase; this folder remembers decisions, corrections, and operating context that
must survive across sessions and agents. Git commits are the only durable storage —
uncommitted memory does not exist.

## Session bootstrap (read in order)
1. `current-state.md` — where the project actually is right now
2. `quality-bar.md` — what "done" means here
3. `do-not-do.md` — hard prohibitions (mirrors the charter invariants)
4. `wiki/corrections/` — user corrections that override defaults
5. `.understand-anything/E2E_CANONICAL_BEHAVIOR.md` — production invariants

## Operating contract
- Quiet by default: surface only real drift, conflict, risk, or decisions.
- Corrections land in `wiki/corrections/` and propagate to the canonical page they amend.
- Never store secrets, tokens, or key material here — names only.
- Update `current-state.md` after any verified milestone (deploy, migration, release gate).
