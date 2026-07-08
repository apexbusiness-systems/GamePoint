# Architecture — Screen-Vision-Only Pipeline

## Contents
- Data-flow diagram
- Component breakdown
- Latency budget
- Storage schema
- Why screen-vision-only is the whole legal strategy

## Why screen-vision-only is the whole legal strategy

Anti-cheat systems and publisher EULAs draw their line at the game process boundary. Tools that inject a DLL, hook the process, read memory, or automate inputs sit on the "cheat tool" side of every precedent this skill found (Epsilon/GTAV, EAC/Vanguard enforcement patterns). Tools that only read pixels the OS already renders to screen — the same capture class as OBS, Discord's overlay, Xbox Game Bar, and NVIDIA's own overlay — sit on the "companion app" side, the side the market comps (Questie.ai, STATUP.GG, Mobalytics, Microsoft Gaming Copilot, NVIDIA G-Assist) already occupy commercially. Every architecture decision below protects that line.

## Data-flow diagram

```
┌─────────────┐   1-3fps    ┌──────────────┐   window title   ┌─────────────────┐
│  OS Capture │────frames──▶│ Frame Sampler│──── + hash ──────▶│ Title Identifier │
│ (Graphics   │             │ (throttle,   │                   │  (fast path:     │
│  Capture /  │             │  diff-check) │                   │  process/window  │
│  ScreenCap- │             └──────────────┘                   │  name; fallback: │
│  tureKit)   │                                                 │  vision classify)│
└─────────────┘                                                 └────────┬─────────┘
                                                                          │
                                                                          ▼
┌──────────────┐  persona +  ┌───────────────┐  knowledge pack  ┌─────────────────┐
│   PiP HUD    │◀── output ──│  Reasoning     │◀── (RAG lookup) │  Title Knowledge │
│ (text/voice, │             │  Engine        │                  │  Pack (per       │
│  configurable│             │  (multimodal   │                  │  compliance-     │
│  opacity)    │             │  LLM, Advantage│                  │  matrix.md entry)│
└──────────────┘             │  Check as hard │                  └─────────────────┘
                              │  system rule)  │
                              └───────┬────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Session Memory │  (opt-in persistence;
                              │ (pattern track)│   default: purge on close)
                              └───────────────┘
```

## Component breakdown

**OS Capture** — Use the platform's native windowed/borderless capture API only (Windows.Graphics.Capture, macOS ScreenCaptureKit, or equivalent on other targets). Never a driver, never a process hook. This single choice is what keeps GamePoint out of every kernel-anti-cheat's threat model by design, not by luck.

**Frame Sampler** — Throttle to 1–3 fps for the reasoning loop regardless of display refresh rate. Diff-check consecutive frames (perceptual hash) to skip redundant LLM calls when the screen hasn't meaningfully changed — this is a cost control, not just a legal one, but it also keeps the product's behavior closer to "glances and advises" than "continuous sensory feed," which matters for the Advantage Check.

**Title Identifier** — Fast path: OS process/window-title match against the compliance matrix. Fallback (borderless/streamed/ambiguous titles): a lightweight on-device vision classifier trained on publicly available box art / UI chrome, not on copyrighted gameplay footage bulk-scraped without license. Unidentified titles route to generic reasoning with an explicit "unverified title, take this with caution" flag in the HUD — never silently claim expertise on titles the system hasn't onboarded.

**Title Knowledge Pack** — RAG index built per §IV of SKILL.md, sourced from official patch notes, publisher documentation, and CC-licensed wikis. Version-pinned per game patch (stale advice after a balance patch is a trust failure, not just an accuracy one).

**Reasoning Engine** — Multimodal LLM call. The Advantage Check (SKILL.md §I.2) is enforced as a system-level constraint on the model's output, not a soft instruction — implement it as a post-generation classifier pass that blocks/rewrites any output revealing information the player couldn't perceive themselves in a live competitive match, before it ever reaches the HUD.

**PiP HUD** — User-configurable position, opacity, text vs. voice, one-tap mute. Modes (Simple/Guided/Tactical/Pro) set defaults from the one-input persona; user can override anytime.

**Session Memory** — Tracks patterns (repeated deaths at the same encounter, missed timers, positioning habits) for personalization within a session. Default: session-only, purged on app close. Cross-session persistence is opt-in and disclosed at the consent screen (see references/legal-guardrails.md).

## Latency budget (target, not measured — validate against your actual stack)

| Stage | Budget |
|---|---|
| Frame capture → sampler | <50ms |
| Title identification (fast path) | <20ms |
| Reasoning engine round-trip | <1500ms (voice), <2500ms (text, can tolerate more) |
| HUD render | <30ms |
| **Total, capture → advice on screen** | **Target <2s for a fresh call; <100ms for a cached/diff-skipped frame** |

## Storage schema (minimal, PII-conscious)

```
session {
  session_id, title_id, persona_mode, started_at, ended_at
}
advice_event {
  session_id, timestamp, title_id, mode, latency_ms, confidence,
  -- NEVER store raw frame content or screen text by default --
}
knowledge_pack {
  title_id, source_url, license_type, ingested_at, patch_version
}
```

Raw frames are processed in-memory and discarded after the reasoning call unless the user has explicitly opted into session replay/debug logging — and even then, redact chat text and usernames before persisting.
