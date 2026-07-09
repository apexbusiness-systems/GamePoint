# WP-5 Evidence — Capture Service (Rust)

## RAN (verbatim, this environment: Linux host)
`cargo test` (workspace, 17 tests):
```
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.70s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
- `cargo clippy --all-targets -- -D warnings`: clean.
- `cargo check --target x86_64-pc-windows-msvc -p capture -p svc -p ringbuf-x`: **Finished** — the DXGI duplication backend, foreground probe, and all Windows-cfg code are type-verified against the real windows-rs API without a Windows machine.
- Golden-fixture parity: Rust serde structs round-trip the same fixtures the Zod schemas validate (ADR-007), byte-equal JSON.
- Compliance: no process memory APIs anywhere; probe uses PROCESS_QUERY_LIMITED_INFORMATION only; gate proven by planted-violation test (see wp6).

## RUNBOOK-GATED (docs/runbooks/wp5-bench.md)
- UNCERTAIN: not run — hot-path p50/p95/p99, CPU% over 10-min sessions, hotkey-to-HUD latency, live HUD screenshot. Requires Windows hardware; targets are recorded as benchmarks, not guarantees.
