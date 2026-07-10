# Quality bar

- Verified means executed: a gate "passes" only with observed exit code 0; live behavior
  is claimed only after a production probe. Blocked checks are listed as blocked, never inferred.
- Surgical diffs, contained blast radius, zero new dependencies without an ADR.
- Structural enforcement beats convention: invariants live in SQL constraints, Zod schemas,
  CI gates — not in prose.
- Every migration idempotent (re-run must be a no-op). Every failure path degrades to a
  safe response (`NO_ADVICE_THIS_FRAME`), never a crash.
- Every work package ships with evidence in docs/evidence/ (commands, environment, results).
- Truth bar in product AND docs: no fake data in authenticated surfaces, no unverified
  claims in documentation.
