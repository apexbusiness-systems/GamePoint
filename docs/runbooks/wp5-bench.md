# Runbook: WP-5 Windows Bench (JR's machine)

Prereqs: Windows 11, `stable-x86_64-pc-windows-msvc` toolchain, VS Build Tools.

```powershell
cd services\capture-win
cargo clippy --all-targets -- -D warnings   # must be clean on real Windows too
cargo test                                   # includes cfg(windows) paths
cargo build --release
```

Measure (targets are benchmarks to record, not vendor guarantees):
1. **Hot path p50/p95/p99** — run the svc binary with `RUST_LOG=svc=info`; the
   orchestrator logs `hot_path_ms` per hotkey. 200 hotkeys across 3 Wave-1 titles;
   compute percentiles. Target: < 50 ms p95.
2. **CPU%** — Task Manager / `typeperf "\Process(svc)\% Processor Time"` during a
   10-minute capture session per title. Target: < 2%.
3. **Hotkey-to-HUD** — timestamp overlay receipt (Realtime message `received_at` −
   hotkey press). Target: < 500 ms p95 (network-dependent).
4. Screenshot the HUD receiving a live response (include OS clock).

Record measured numbers in `docs/evidence/wp5-bench.md`. A missed target is
reported as `UNCERTAIN: target missed — measured <value>`, never rounded down.
