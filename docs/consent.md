# GamePoint consent screen copy — v1 (WP-0)

Contract §1.1.5 Data/Consent Check. This copy is rendered verbatim by the
overlay's blocking first-run consent screen (WP-5). The user cannot reach the
HUD without completing every step. A persistent capture indicator is shown
whenever capture is armed.

---

## Screen 1 — What GamePoint sees

**GamePoint only sees what you see.**

When you press the assist hotkey, GamePoint captures a single frame (or a
cropped region) of your game screen — the same pixels on your monitor. That's
it. GamePoint never:

- reads game memory or files inside the game,
- injects anything into the game process,
- presses keys or moves your mouse for you,
- inspects your network traffic.

## Screen 2 — What leaves your device

To generate advice, the captured frame and basic context (which game, which
coaching mode, a timestamp) are sent over an encrypted connection to
GamePoint's inference service.

- **Frames are processed in memory and discarded immediately after your advice
  is generated.** They are not stored by default.
- We keep operational metrics only (which game, response time, model cost,
  confidence). We never store your frame, any text read from it, usernames, or
  chat content.

## Screen 3 — Microphone and system audio

**Voice and audio capture are OFF by default.** GamePoint v1.0 does not listen
to your microphone. A system-audio option may arrive later; if it does, it will
be off until you turn it on, and this consent screen will be shown again.

## Screen 4 — Age

GamePoint is not directed at children. You must confirm you are **13 or
older** to use GamePoint (COPPA). If you are under 13, GamePoint will not run.

> [ ] I confirm I am 13 or older.

## Screen 5 — Your agreement

> [ ] I understand GamePoint captures my game screen **only when I press the
> hotkey**, sends that frame for processing, and discards it after answering.
> [ ] I understand a capture indicator is always visible while capture is armed,
> and I can turn capture off at any time from the tray or the HUD.

Buttons: **[Agree and continue]** (enabled only when all boxes are checked) ·
**[Quit]**

Footer: You can withdraw consent at any time in Settings → Privacy, which
disables capture immediately. Privacy policy: link rendered from app config.

---

## Implementation requirements (binding on WP-5)

1. Consent is blocking: no capture code path is reachable before acceptance is
   persisted (versioned; copy changes re-trigger consent).
2. Age gate failure hard-exits; no retry-until-pass UI patterns.
3. Capture indicator is visible whenever the hotkey is armed, not merely during
   the capture instant.
4. Voice toggle in Settings is rendered disabled and labeled "coming later"
   (feature-flagged dark) in v1.0.
5. Telemetry rows (`advice_events`) contain no content columns — enforced by
   schema in WP-1, not by policy.
