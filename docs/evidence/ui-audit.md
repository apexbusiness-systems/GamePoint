# Overlay UI Audit & Redesign (WP-5b) — apex-frontend AUDIT → IMPLEMENT

## Audit of the inherited skeleton (21-line `main.tsx`)
| Gate | Finding |
|---|---|
| UX | All screens rendered simultaneously; consent was decorative, not blocking; persona hardcoded to `mastery`; no answer to "what happens next". |
| State | Zero states designed: no thinking/degraded/offline/refused/unsupported; advice text was a static string. |
| A11y | No focus styles, no `aria-live` for advice updates, color-only status dot, no reduced-motion handling. |
| System | Raw hex values, no tokens; smoke test asserted on source text (hollow). |
| Ship | No persistence, no telemetry hooks, no capture indicator. |

## Redesign (implemented, evidence: screenshots below + 11 node tests)
- **Flow:** blocking first-run consent (plain-language capture/retention/anti-cheat disclosure + COPPA checkbox; the accept button is disabled until the age gate passes) → one-input persona ("story / mastery / rank", skill §V — no settings maze) → HUD. Returning users land on the HUD directly; corrupt persisted settings fall back to defaults rather than crash.
- **State model (State Gate):** `idle | thinking | advice | degraded | refused | offline(queued) | unsupported-title` — each a designed message, including the compliance-mandated "unverified title" flag and the advantage-check refusal styled as a policy badge, not an error.
- **Truth bar in the UI:** "Not verified:" renders as an amber badge split from the advice body; evidence count is always visible next to a confidence chip (low/med/high with a shape+text cue, never color alone).
- **Trust affordances:** capture indicator always visible while capturing (pulsing red dot, static under `prefers-reduced-motion`); one-tap mute; pause capture in one tap; voice toggle rendered disabled + "coming later" (honest dark feature).
- **Stickiness:** session recap ("N tips · M evidence-backed · K refused by policy") makes value and policy integrity visible each session; persona badge keeps the product's promise ("coaching tuned to you") on screen.
- **A11y Gate:** `aria-live="polite"` advice region, `role="radiogroup"`/`role="status"` semantics, `:focus-visible` rings, ≥32 px targets, all text ≥7:1 contrast on the glass background, reduced-motion respected.
- **System:** token sheet (`--bg-glass`, `--accent`, spacing/radius scale) — zero raw hex in components.
- **Perf budget:** HUD is a single reducer projection; no polling — Realtime push only; fixture source for offline dev; bundle 465 kB (gzip 130 kB) dominated by supabase-js, acceptable for a desktop webview, tracked in wp6.

## Evidence
- Screenshots (Chromium, this environment): `docs/evidence/ui/1-consent.png`, `2-persona.png`, `3-hud-advice.png` — HUD shows advice + action, confidence: high chip, evidence count, session recap, opacity slider, disabled voice toggle.
- `node --test`: 11/11 green (state machine, blocking age gate, degrade/refusal/offline/unsupported states, opacity clamp, persistence fallback).
- `tsc --noEmit` clean, `vite build` clean.
- UNCERTAIN: not run — Tauri 2.x shell packaging (always-on-top frameless PiP window) requires the Windows release environment; frontend is host-agnostic and the shell wiring is enumerated in `docs/runbooks/wp5-bench.md` prerequisites.

## Addendum 2026-07-08: Voice & Perception framework applied
Principles from the APEX visual-communication framework, mapped to GamePoint in `docs/design/voice-and-perception.md` and enforced mechanically:
- **3-second sequence:** HUD re-ordered to status → advice → adjustment; persona badge demoted to settings (identity metadata, not a glance-tier need); idle copy de-duplicated against the status word. Verified in the rendered DOM: `PERCEPTION_SEQUENCE_OK status(37) < advice(81) < settings(261); status="Watching"` (`scripts/perception-check.mjs`).
- **Calm under pressure:** color law adopted — red belongs to the capture indicator alone; low confidence is now muted gray information, not an alarm; error/offline states keep diagnostic, unpressured copy.
- **Voice lexicon:** banned list (magic/easy/cheap/playful/disruptive/effortless/instantly/guaranteed/unbeatable/"win more") enforced by `voice.test.mjs` across overlay, web, and consent copy; game vocabulary in test fixtures explicitly exempt.
- **Memory encoding:** one metaphor — "The coach in your corner: it watches the fight, it never touches the controls." — placed verbatim at exactly the two category-formation moments (first-run consent, web landing hero), once per surface; the lint asserts both presence and single-use sharpness.
- Web landing now mirrors the seeded registry truthfully (5 supported Wave-1 titles, Diablo IV "Paused — terms review", GTA VI "Registry only").
- Screenshots refreshed; suite now 20 UI tests (11 state + 3 web + 3 voice + pluralization fixes), all green.
