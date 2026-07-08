# ADR-001: Overlay Host

## Status
Accepted for v1.0.

## Decision
GamePoint v1.0 uses an owned Tauri desktop picture-in-picture overlay in its own process. It is never injected into game processes and never uses memory reads, packet hooks, DLL injection, kernel drivers, or input automation into games.

## Rationale
A separate owned process keeps the trust boundary simple, avoids anti-cheat bypass patterns, and supports a visible capture indicator and consent-first UX.

## Consequences
- Capture and hotkeys are GamePoint controls only.
- Cloudflare is not in the capture path.
- Windows-specific capture is isolated to the local service boundary in later work packages.
