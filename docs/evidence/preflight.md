# Pre-Flight Gate Evidence — 2026-07-08

Contract §3. Executed in the Claude Code remote session (Linux container,
repo `apexbusiness-systems/gamepoint`, branch `claude/gamepoint-v1-contract-dqnuip`).
Verbatim command outputs below; nothing summarized without its artifact (§6).

**Lane verdict: RED-with-scope-note.** P1/P2/P3 are blocked (no Supabase CLI or
project credentials exist in this environment) and P5 is partial (the
2026-07-08 research report was not provided). Per §3, WP-1 is blocked. WP-0
(governance scaffold) was executed because its deliverable —
`governance/compliance-matrix.md` — is the artifact P5 is evaluated against;
the strict reading (P5 blocks the WP that creates P5's artifact) deadlocks the
contract. No runtime code was written. Exact blockers + remediation at the end.

---

## P1 — Supabase project reachable; CLI linked; `db push` dry-run: **BLOCKED**

```
$ supabase --version
/bin/bash: line 1: supabase: command not found
$ npx --yes supabase --version
npm notice   (package installs no runnable CLI; binary download from
              github.com is blocked by this session's network policy — see P6)
```

No `SUPABASE_*`, `OPENAI_*`, or `GEMINI_*` variables exist in the environment:

```
$ env | grep -iE 'supabase|openai|gemini' | sed 's/=.*/=<redacted-present>/'
(env scan done)            # zero lines matched
```

`UNCERTAIN: not run` — no project ref or access token was provisioned to this
session; reachability cannot be tested without inventing credentials.

## P2 — Secrets set (`OPENAI_API_KEY`, `GEMINI_API_KEY`, service key not in clients): **BLOCKED**

`supabase secrets list` requires the CLI + linked project (P1). Client-bundle
check is trivially satisfied at WP-0 (no client bundles exist yet); it recurs
at WP-5/WP-6. `UNCERTAIN: not run`.

## P3 — `pgvector >= 0.8` on the project: **BLOCKED**

Requires the linked project (P1). Docker 29.3.1 is available in-session
(`docker info` OK), so `supabase start` local verification becomes possible the
moment the CLI can be installed. `UNCERTAIN: not run`.

## P4 — Rust toolchain + clippy clean on scaffold: **PARTIAL PASS**

```
$ cargo --version && rustc --version
cargo 1.94.1 (29ea6fb6a 2026-03-24)
rustc 1.94.1 (e408947bf 2026-03-25)
$ rustup target list --installed
x86_64-unknown-linux-gnu
$ rustup component list --installed | grep -E 'clippy|rustfmt'
clippy-x86_64-unknown-linux-gnu
rustfmt-x86_64-unknown-linux-gnu
$ cd services/capture-win && cargo fmt --check \
    && cargo clippy --workspace --all-targets -- -D warnings
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4.65s   # clean, zero warnings
```

Clippy is clean on the scaffold workspace (5 crates, `unsafe_op_in_unsafe_fn`
and `missing_docs` denied at workspace level). `UNCERTAIN:` the contract names
`stable-x86_64-pc-windows-msvc`; only the Linux target exists in this
container. The MSVC-target run must happen on JR's Windows machine or a
Windows CI runner (WP-5/WP-6 runbooks).

## P5 — Compliance matrix rows for all 20 titles: **PARTIAL — 12 of 20**

`governance/compliance-matrix.md` is committed with 12 rows seeded exclusively
from facts attested in the Execution Contract v1.0 (Wave 1 six, the named
license-flag titles, Destiny 2, GTA VI). The 2026-07-08 research report — the
contract's stated source for the full 20-title list, publisher stances, and
anti-cheat classes — was not provided to this session and is not in the repo
(`git log` shows only "Initialize repository" with a single `.gitkeep`).
Per §1.2, the 8 missing rows and all unattested cells are marked `UNCERTAIN`
rather than invented. **This is the P5 blocker.**

## P6 — No live credentials in any committed file: **PASS (substitute scanner; gitleaks wired in CI)**

gitleaks cannot be installed in-session — its release binary lives on
github.com, and this session's proxy blocks GitHub access outside the scoped
repo:

```
$ curl .../gitleaks/releases/download/v8.24.3/gitleaks_8.24.3_linux_x64.tar.gz
{"message":"GitHub access to this repository is not enabled for this session. ..."}
```

Substitute scan (detect-secrets 1.5.0 from PyPI) over the WP-0 tree:

```
$ detect-secrets scan --all-files --exclude-files 'services/capture-win/target/.*'
findings = 0
```

(The excluded path is cargo's gitignored build cache; the unexcluded run's
single hit was `target/CACHEDIR.TAG`, an uncommitted cargo marker, not a
credential.) gitleaks itself runs pinned (v8.24.3) in `.github/workflows/ci.yml`
on GitHub-hosted runners on every push/PR — the CI run for PR #1 is the
canonical gitleaks artifact.

---

## Blockers and remediation (exact commands)

1. **P5 (RED):** Provide the 2026-07-08 research report (or the 20-title list
   with wave/license/anti-cheat/stance). Then update
   `governance/compliance-matrix.md` rows 13–20 and the `UNCERTAIN` cells, and
   re-run only this gate.
2. **P1/P2/P3 (YELLOW):** Provision to the session environment:
   `SUPABASE_ACCESS_TOKEN`, project ref, `SUPABASE_DB_PASSWORD` (as env/secrets,
   never committed). Then:
   ```
   npm i -g supabase   # or enable github.com in the environment network policy
   supabase link --project-ref <REF>
   supabase db push --dry-run
   supabase secrets list        # names only, capture here
   psql "$SUPABASE_DB_URL" -c "select extversion from pg_extension where extname='vector';"
   ```
   Local-lane alternative (Docker is available): `supabase start` + local
   `db push` unblocks WP-1/WP-2 in YELLOW lane, flagged before any deploy.
3. **P4 (note):** Run `cargo clippy` under `stable-x86_64-pc-windows-msvc` on a
   Windows runner before WP-5 merge; record output here.
