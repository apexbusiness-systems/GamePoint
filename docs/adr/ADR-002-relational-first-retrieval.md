# ADR-002: Relational-First Retrieval

## Status
Accepted for v1.0.

## Decision
Runtime retrieval filters by `title_id`, compliance status, runtime-eligible source license, and confirmed claim status before vector rerank.

## Rationale
Relational gates are deterministic and auditable. Vector similarity is useful only after title isolation and license/compliance barriers have removed unsafe rows.

## Consequences
- Retrieval cannot return cross-title data.
- Quarantined or unconfirmed claims are not reachable by runtime clients.
- pgvector is used as a ranking layer, not as the compliance boundary.
