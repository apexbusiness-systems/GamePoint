# ADR-006: Dispatch Transport is HTTPS/JSON, not gRPC

## Status
Accepted for v1.0 (contract amendment A1, see `docs/governance/contract-audit-v1.1.md`).

## Context
Contract v1.0 specified a tonic gRPC client in `crates/dispatch`. The inference plane is Supabase Edge Functions (Deno/HTTP); no gRPC server exists or is planned, so a gRPC client would be dead code with a heavy dependency tree.

## Decision
`crates/dispatch` sends the `AssistRequest` payload as JSON over HTTPS to the `assist` Edge Function: one reused connection, exponential backoff with jitter (max 3 retries), blake3 checksum field over the frame bytes, bounded offline queue (drop-oldest, capacity 32). Frame bytes travel base64-encoded inside the JSON body in v1.0; a binary multipart upgrade is a measured optimization, not a prerequisite.

## Consequences
- One wire format end-to-end, validated by the same golden fixtures in Rust (serde) and TS (Zod).
- No protobuf toolchain; contracts codegen is a file-copy sync with drift detection (ADR-007).
