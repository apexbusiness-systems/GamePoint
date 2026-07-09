# Architecture Decision Records — Index

> **Source of truth:** [`docs/adr/`](../docs/adr/)
> This file is a navigational index only. Read the full ADR for context and rationale.

| ADR | Title | Status | One-Line Summary |
|-----|-------|--------|-----------------|
| [ADR-001](../docs/adr/ADR-001-overlay-host.md) | Overlay Host | Accepted | Windows overlay is a local-only surface; no cloud frame streaming. |
| [ADR-002](../docs/adr/ADR-002-relational-first-retrieval.md) | Relational-First Retrieval | Accepted | Retrieval is Postgres/RLS-first before any vector or embedding store. |
| [ADR-003](../docs/adr/ADR-003-frame-only-v1.md) | Frame-Only V1 | Accepted | V1 processes single frames only; no continuous video or audio capture. |
| [ADR-004](../docs/adr/ADR-004-model-alias-cost-circuit.md) | Model Alias + Cost Circuit | Accepted | Models are aliased; cost/latency budgets enforced as circuit breakers. |
| [ADR-005](../docs/adr/ADR-005-cloudflare-frontend-hosting.md) | Cloudflare Frontend Hosting | Accepted | `apps/web` is Cloudflare Pages; Supabase stays the backend authority. |
