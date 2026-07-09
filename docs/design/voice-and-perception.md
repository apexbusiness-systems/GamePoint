# GamePoint Voice & Perception Framework

Design here is a deterministic communication layer, not decoration. These four rules are
extracted from the APEX visual-communication framework and bound to GamePoint's context —
a player mid-session, adrenaline up, attention split between the game and the HUD.
Enforced by: `apps/overlay/src/voice.test.mjs` (lexicon + encoding lint, CI) and
`apps/overlay/scripts/perception-check.mjs` (rendered-order check, evidence).

## 1. The 3-Second Sequence (perception gap)
A player glancing at the HUD for three seconds must register, in this exact order:
1. **System status** — absolute certainty first: "Watching" / "Capture off" / "Offline",
   as text + indicator, never color alone.
2. **The advice** — the single most valuable decision now, visually dominant.
3. **Adjustment** — mute, pause, settings; quiet, reachable, never competing.

Anything that doesn't serve one of those three tiers is stripped. If an element needs
explanation, the design has failed — confusion is objective. (Applied: the persona badge
was removed from the header — it's identity metadata, not a 3-second need — and lives in
settings.)

## 2. Predictive Empathy (calm under pressure)
The user is not analyzing pixels; they are mid-fight. The interface meets them there and
moves them from chaos toward calm control:
- **Color law: red means "recording" and nothing else.** The capture indicator owns red.
  Errors, low confidence, and offline states never shout — they use muted tones and give
  a diagnostic next step ("queued, will send when the connection returns"), not pressure.
- Degraded inference ("no advice this frame") is a designed state with a recovery hint,
  visually indistinguishable in temperature from idle.
- Low confidence is information, not alarm: gray, labeled, honest.

## 3. Voice Lexicon (identity upstream of pixels)
GamePoint's voice is a cornerman between rounds: precise, calm, evidence-led.
- **Never says:** magic, easy, cheap, playful, disruptive, effortless, instantly,
  guaranteed, unbeatable, "win more".
- **Operates by:** deterministic, engineered, verified, evidence-backed, calm, precise,
  paused (never "broken"), cleared (never "unlocked").
- The truth bar is voice: "Not verified:" is spoken plainly, styled visibly, never hidden.
- Scope: all user-facing copy (overlay, web, consent, store listings). Game vocabulary
  inside coaching content (e.g. "magic resist") is domain language, not brand voice, and
  is exempt.

## 4. Memory Encoding (the metaphor)
GamePoint is not "an overlay" or "an assistant" — commodity categories. The lasting
mental model:

> **The coach in your corner: it watches the fight, it never touches the controls.**

One sentence that encodes the entire compliance architecture (screen-vision only, no
injection, no automation, decision-support not sensory augmentation) as a psychological
twist. It appears verbatim at first-run consent and on the web landing — the two moments
of category formation — and nowhere else, so it stays sharp.
