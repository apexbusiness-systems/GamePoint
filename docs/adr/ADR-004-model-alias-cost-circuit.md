# ADR-004: Model Alias and Cost Circuit Layer

## Status
Accepted for v1.0.

## Decision
GamePoint code uses provider/model aliases from environment or config and enforces measured budgets, telemetry, and cost circuit breakers before escalation.

Required aliases:

- `VISION_MODEL_PRIMARY`
- `VISION_MODEL_ESCALATION`
- `TEXT_EMBEDDING_MODEL`
- `MODEL_PROVIDER_PRIMARY`
- `MODEL_PROVIDER_FALLBACK`

## Rationale
Aliases avoid hardcoded stale vendor claims. Cost circuits preserve quality through routing, retrieval narrowing, cache checks, and schema enforcement rather than blind use of larger models.

## Consequences
- No provider call may occur before auth/session/title gates.
- Escalation is disabled when budgets, policy, auth, or title gates fail.
- Live provider pricing remains `UNCERTAIN` until verified in release evidence.
