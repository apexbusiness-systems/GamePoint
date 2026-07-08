# ADR-007: Zod is the Single Contract Source

## Status
Accepted for v1.0 (contract amendment A2).

## Decision
`packages/contracts/src/index.ts` (Zod schemas + inferred TS types) is the canonical definition of `AssistRequest`, `CoachingResponse`, and telemetry shapes. Consumers:

- **Edge Functions:** `packages/contracts/scripts/sync-edge.mjs` copies the schema module to `supabase/functions/_shared/contracts.ts`; CI recomputes the hash and fails on drift.
- **Rust capture service:** `crates/dispatch` defines serde structs field-for-field; parity is proven by parsing/serializing the shared golden fixtures in `packages/contracts/fixtures/` from both toolchains in CI.
- **Overlay:** imports the package directly.

## Consequences
- No protobuf/codegen toolchain; determinism is trivial (copy + hash).
- Adding a field is a three-point change (Zod, serde struct, fixture) and CI fails loudly if any point is missed.
