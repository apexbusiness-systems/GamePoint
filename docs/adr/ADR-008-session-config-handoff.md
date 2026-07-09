# ADR-008: Session Config Handoff (Web → Overlay) + Assist Error Taxonomy

## Status
Accepted for v1.1 (plan items A3 + A4, 2026-07-09).

## Context
Before this ADR the overlay invented its own `crypto.randomUUID()` session id, so
HUD subscriptions never corresponded to a real `sessions` row and the assist
loop could not be exercised end to end. Separately, the assist Edge Function
returned ad-hoc error JSON with no machine-readable code, no correlation id,
and no rate limiting.

## Decision
1. **SessionConfig contract.** `packages/contracts` defines a versioned
   (`SESSION_CONFIG_VERSION = 1`) Zod schema plus `encodeSessionConfig` /
   `decodeSessionConfig` (base64url JSON). The authenticated web app exports the
   config for a real session ("Copy overlay config"); the overlay resolves it
   from the `gpc` URL param. Three explicit binding states: `configured`,
   `fixture` (no config; demo mode, labeled), `invalid` (refused with a visible
   reason — never a silent fallback to fixture).
2. **Secret wall.** `looksLikeServerSecret` structurally refuses `sb_secret_*`
   keys and JWTs whose payload role is `service_role` at *both* ends (web build
   time and overlay decode time). Charter invariant 10 becomes code, not
   convention.
3. **Assist error taxonomy.** Every non-200 assist response carries
   `error_code` (`AUTH_REQUIRED | INVALID_REQUEST | SESSION_NOT_OWNED |
   TITLE_NOT_ELIGIBLE | RATE_LIMITED | METHOD_NOT_ALLOWED`), the legacy
   human-readable `error`, and `request_id`.
4. **Request correlation.** `request_id` (client-supplied via optional
   `AssistRequest.request_id`, else server-generated) is stored on
   `advice_events` and `coaching_responses`, echoed in the `x-gp-request-id`
   response header, and reaches the HUD through the broadcast row.
5. **Rate limiting.** Sliding 60-second window per user
   (`ASSIST_RATE_LIMIT_PER_MIN`, default 12) counted relationally from
   `advice_events` joined to the caller's sessions. Rate-limited rejects write
   no telemetry row, so a saturated user can always recover.
6. **Session lifecycle.** Migration 008 adds `sessions.status`
   (`active|ended`, checked), `ended_at`, `client_version`, and repairs the
   latent `coaching_responses.latency_ms` column the 007 insert path assumed.

## Consequences
- The Rust dispatch mirror stays valid: new `AssistRequest` fields are optional
  and the golden fixture is unchanged. Adding `request_id`/`client_version` to
  the serde mirror is a follow-up three-point change per ADR-007.
- The overlay still runs fixture mode with zero configuration, so demos and
  tests need no backend — but a malformed config is a hard, visible refusal.
- Rate limiting is per-user, DB-counted, and infrastructure-free; if p95 cost
  of the count query becomes material it can move to a dedicated counter table
  without contract changes.
