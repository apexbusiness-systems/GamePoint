# ADR-003: Frame-Only v1.0

## Status
Accepted for v1.0.

## Decision
GamePoint v1.0 excludes audio capture and voice capture entirely. Assist contracts may reserve nullable audio fields for v1.1, but v1.0 rejects or ignores non-null audio input by policy.

## Rationale
Frame-only capture reduces privacy risk, avoids accidental voice/chat collection, and keeps the first release focused on visible-screen coaching.

## Consequences
- No microphone, WASAPI loopback, Opus encode, or audio dispatch modules are included.
- UI may show disabled future audio controls only when clearly labeled unavailable.
- Tests must prove audio payloads cannot activate audio behavior.
