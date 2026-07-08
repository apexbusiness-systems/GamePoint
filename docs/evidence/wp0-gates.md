# WP-0 Verification Evidence — gates proven — 2026-07-08

Contract WP-0 VERIFY: compliance gate proven by a fixture file containing
`ReadProcessMemory` that fails the gate, then removed. Verbatim transcript:

## Compliance gate: failing-then-passing proof

```
=== PROOF 1: fixture with banned API must FAIL the gate ===
$ cat > services/capture-win/crates/capture/src/banned_fixture.rs <<'EOF'
// WP-0 gate-proof fixture (temporary): ReadProcessMemory
EOF
$ bash governance/ci/compliance-gate.sh
compliance-gate: BANNED PATTERN 'ReadProcessMemory':
/home/user/GamePoint/services/capture-win/crates/capture/src/banned_fixture.rs:1:// WP-0 gate-proof fixture (temporary): ReadProcessMemory
compliance-gate: FAIL — Contract §1.1 Architecture Check violated.
Do not code around this gate. Log the hit in governance/compliance-matrix.md
and implement the compliant alternative (Contract §5).
exit=1

=== PROOF 2: fixture removed, gate must PASS ===
$ rm services/capture-win/crates/capture/src/banned_fixture.rs
$ bash governance/ci/compliance-gate.sh
compliance-gate: PASS — scanned: .../services .../apps .../packages .../supabase
exit=0
```

## License gate: self-test (OSRS fixture) + repo scan

```
$ python3 governance/ci/license-gate.py --self-test
license-gate self-test: PASS — manifest violation detected
license-gate self-test: PASS — quarantined manifest passes
license-gate self-test: PASS — sql violation detected
license-gate self-test: PASS — quarantined sql passes
exit=0
$ python3 governance/ci/license-gate.py
license-gate: PASS — scanned /home/user/GamePoint
exit=0
```

## Rust scaffold: fmt + clippy `-D warnings`

```
$ cd services/capture-win && cargo fmt --check && \
  cargo clippy --workspace --all-targets -- -D warnings
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4.65s   # zero warnings
```

## CI on scaffold

`.github/workflows/ci.yml` runs governance-gates (compliance + license
self-test + license scan), gitleaks (pinned v8.24.3), and the Rust job
(fmt/clippy `-D warnings`/test) on every push/PR. The PR #1 checks page is the
CI-green artifact for this WP (link recorded on the PR once the run completes —
runs cannot be linked before they exist).
