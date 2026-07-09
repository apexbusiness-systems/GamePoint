# WP-6 Evidence — CI/CD + Security

## RAN (verbatim, this environment)
Planted-violation proofs (each: clean PASS → planted violation FAILs → removed → PASS):

```
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found
COMPLIANCE_GATE_FAIL pattern=ReadProcessMemory
./services/capture-win/violation-fixture.rs:1:ReadProcessMemory(h, addr, buf)
COMPLIANCE_GATE_PASS no banned runtime patterns or obvious service-role values found

LICENSE_GATE_FAIL
packages/ingest/license-manifest.csv: runtime source uses blocked license cc-by-nc
LICENSE_GATE_PASS no blocked runtime license manifests found
```

- Gate fix logged: inherited pattern `audio_opus_bytes.*[^n]null` matched the *compliant* null-pinning lines; replaced with a positive structural assertion on the canonical schema (commit history).
- Secret scan: `git grep` for `sk-…` keys / JWT prefixes / service-role assignments → 0 hits outside ENV.example placeholders. gitleaks runs in CI (`security` job); binary unavailable locally.
- Full local pipeline: 29 node tests + 12 pytest + 17 cargo tests green; `tsc -b` clean; `clippy -D warnings` clean; `cargo check --target x86_64-pc-windows-msvc` clean; sync-edge drift check green; both app builds green.
- TS `any` ban: `strict: true` workspace-wide and zero `any` in source (typecheck is the oracle; eslint not installed here — CI's `tsc --noEmit` + strict mode is the canonical zero-`any` gate. UNCERTAIN: eslint --max-warnings 0 not run locally).

## RUNBOOK-GATED
- UNCERTAIN: not run — GitHub Actions runs on push (this session cannot execute Actions); signed Windows installer + SBOM produced by `release.yml` on first tag; branch-protection settings applied via repo admin per `docs/release/branch-protection.md`.
