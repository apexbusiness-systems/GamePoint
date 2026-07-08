# GamePoint Consent and Privacy Boundary

GamePoint v1.0 is a screen-vision-only coaching companion. It processes a user-triggered frame or region of interest after consent, age gate, session, and title checks pass.

## Required User Consent

Before capture starts, the app must show a blocking consent flow that explains:

- GamePoint looks only at visible screen frames selected by the local app.
- GamePoint does not inject into games, read game memory, hook packets, or automate inputs.
- GamePoint does not capture microphone audio, system audio, or voice in v1.0.
- Frame bytes are processed in memory by default and are not stored unless a future explicit debug consent exists.
- Telemetry is operational metadata only and excludes frame bytes, OCR text, usernames, chat content, tokens, and raw prompts.

## Age Gate

Capture remains disabled until the user passes the age gate required for the product region and account policy.

## Unsupported Titles

If a title is not runtime eligible, capture is paused and the app must explain: "GamePoint has not verified this title yet. Capture is paused for this game until support is cleared."

## Voice

The consent screen leads with the product's single metaphor, verbatim: "GamePoint is the coach in your corner: it watches the fight, it never touches the controls." Lexicon rules for all user-facing copy: docs/design/voice-and-perception.md.
