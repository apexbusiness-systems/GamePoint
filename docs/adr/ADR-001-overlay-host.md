# ADR-001: Overlay host — owned Tauri PiP window, not Overwolf (v1.0)

**Status:** Accepted · **Date:** 2026-07-08 · **Owner:** JR Mendoza · **WP:** WP-0

## Context

GamePoint needs an always-visible HUD over (or beside) a running game. Two
candidate hosts: (a) an owned out-of-process desktop overlay window, (b) the
Overwolf platform. Overwolf approval is app-and-title specific and is pending;
shipping v1.0 cannot depend on it. The Compliance Gate (Contract §1.1.1)
forbids any in-process/injected overlay outright.

## Decision

v1.0 ships an **owned Tauri 2.x PiP overlay**: a frameless, always-on-top
desktop window in its own process, never injected into any game process. It is
in the same capture/overlay class as OBS or Xbox Game Bar — an ordinary
OS window composited by the DWM.

## Rationale

- **Compliance-default:** an owned window requires no game-process access at
  all; the Architecture Check is satisfied structurally, and the CI banned-API
  gate keeps it that way.
- **No external approval on the critical path:** Overwolf review timelines and
  per-title scope would gate the entire v1.0 ship date.
- **Anti-cheat posture:** out-of-process windows are not hooked into the game
  and present the same profile as universally tolerated capture tools.
- **Portability:** the HUD is plain web UI (React + TS strict); a later
  Overwolf port reuses the same components.

## Consequences

- Exclusive-fullscreen games may hide the overlay; borderless-windowed is the
  documented supported mode for v1.0 (noted in the runbook and HUD copy).
- Track B (Overwolf distribution port) opens only after Overwolf app approval,
  as a separate contract; nothing in v1.0 may take a dependency on it.
- The overlay renders advice only; it never synthesizes input into the game
  (SendInput is on the banned list, enforced in CI).
