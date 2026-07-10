# ADR-010: Voice — local-only TTS output + closed-vocabulary, push-to-talk STT input, session-consent-gated

## Status
Accepted for v1.1 scope. Supersedes the "no voice" *consequence* of ADR-003 for this narrow,
gated case only — ADR-003's frame-only decision and rationale stand unchanged; this ADR
exercises the reservation ADR-003 itself left open: *"Assist contracts may reserve nullable
audio fields for v1.1."*

## Decision
GamePoint may speak coaching advice aloud (TTS) and accept push-to-talk voice commands (STT),
under all of the following, non-negotiable conditions:

1. **Local-only.** TTS uses the OS/WebView2-provided `speechSynthesis` engine. STT uses the
   browser `SpeechRecognition` API. No new cloud vendor is introduced by this ADR.
2. **No background listening.** The microphone is active only while the user physically holds
   the push-to-talk control. `recognition.continuous = false`; one utterance per hold, mirroring
   the existing hotkey-triggered, single-frame capture cadence (ADR-003).
3. **Session-scoped consent, every launch.** Voice consent lives in `OverlayState.voice`
   (in-memory), never in `PersistedSettings` (the only slice written to `localStorage`). It is
   `false` on every fresh app load — there is no "remember my choice."
4. **Zero wire-contract change.** `AssistRequest.audio_opus_bytes` stays `z.null()` and
   `audio_duration_ms` stays `0`, exactly as ADR-003 requires. Raw audio never leaves this
   module and is never stored. `AssistRequest` has no free-text query field today — voice input
   is **not** a dictation/chat channel. A recognized utterance is matched, closed-vocabulary,
   against the existing `HotkeyIntent` enum (`assist` | `explain` | `recap`) and dispatched
   exactly like a hotkey press. Unmatched speech sends no request and spends no tokens.
5. **Owns the color law, not a new one.** The mic indicator reuses
   `docs/design/voice-and-perception.md` rule 2 verbatim ("red means 'recording' and nothing
   else") — same token, same visual grammar as the existing capture indicator.

## Rationale
Voice is additive value (hands-free trigger, spoken advice) without reopening the privacy or
cost posture ADR-003 and the compliance gate protect. Keeping recognition push-to-talk and
closed-vocabulary — rather than continuous/open dictation — holds firm to three things at once:
the "always know when it's on" requirement, the existing assist-budget circuit breakers
(`packages/router`, ADR-004/009) which were sized for structured requests, and zero added
compute/database cost (no audio stored, no continuous inference).

## Consequences
- `governance/ci/compliance-gate.sh` is **not modified** by this ADR. This implementation calls
  no `WASAPI`/`Opus`-named API anywhere in source — the browser engine owns audio capture
  internally, invisible to the gate's source-level string bans. If a future iteration adds a
  native (Rust) audio-capture path, that PR must add a narrowly-scoped, explicitly-reviewed
  allowlist carve-out at that time — not before, and not wider than one named module.
- `packages/contracts/src/index.ts` is **not modified** by this ADR, for the same reason: no
  new field, no schema change. The compliance gate's structural check
  (`audio_opus_bytes: z.null()`) continues to pass unmodified.
- **UNVERIFIED — flagged, not silently assumed:** whether the installed WebView2 runtime's
  `SpeechRecognition` implementation processes audio on-device or via a cloud speech backend is
  not verifiable from a Linux sandbox with no Windows host. `ENABLE_VOICE_INPUT` in
  `apps/overlay/src/voice-agent.ts` defaults to `false` for exactly this reason. Before shipping
  STT to real users, JR must verify locally (e.g., monitor network activity while speaking, or
  confirm against current Microsoft WebView2 documentation for the installed runtime version).
  If cloud-routed, replace `browserSpeechRecognizer()` with a bundled on-device engine
  (Whisper.cpp tiny/base via a new Rust crate) before flipping the flag. TTS output
  (`speechSynthesis`) is not gated behind this flag — it is a well-established on-device
  Chromium/WebView2 behavior (OS-installed SAPI/neural voices), lower risk by construction
  (output-only, nothing captured).
- Legal note (not legal advice — flagged for the standing GA legal-review pass per
  `docs/governance/contract-audit-v1.1.md`): push-to-talk + on-device-only capture is materially
  lower risk than passive recording, but a held-open mic can incidentally pick up a third
  party's voice (e.g., a teammate audible over speakers). Consent copy states this explicitly;
  no technical mitigation beyond PTT scoping is implemented here.

## Enforcement
- `apps/overlay/src/voice-agent.ts` — `matchVoiceIntent()` is closed-vocabulary by construction
  (no free-text passthrough exists in the type signature).
- `apps/overlay/src/state.ts` — `voice: VoiceState` lives outside `PersistedSettings`; a
  `voice/consent-set(false)` action hard-resets the entire voice slice, so revoking mid-session
  can never leave a stale "listening" or "output enabled" flag behind.
- `apps/overlay/src/voice-agent.test.mjs` and `apps/overlay/src/state.test.mjs` cover the intent
  matcher, the consent gate, and the reducer's structural guards (voice actions are no-ops
  without consent, exactly like `capture/toggle` is a no-op while `captureLocked`).
