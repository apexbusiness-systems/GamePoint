# ADR-002: Relational-first retrieval, vector rerank second

**Status:** Accepted · **Date:** 2026-07-08 · **Owner:** JR Mendoza · **WP:** WP-0 (implemented WP-1 §006)

## Context

Coaching answers must come only from the active title's knowledge pack, only
from confirmed claims, and only from runtime-eligible (license-cleared)
sources. A pure vector-similarity search over one global embedding space makes
those guarantees probabilistic: a nearest neighbor can leak across titles, from
quarantined licenses, or from unverified claims.

## Decision

Retrieval is a SQL function (`retrieval_candidates`) that applies **relational
filters first** — `title_id = $1 AND runtime_eligible = true AND status =
'confirmed'` plus optional category filters — and performs **cosine rerank
second** over only the surviving candidate set (pgvector HNSW,
`vector_cosine_ops`).

## Rationale

- **Blast radius (Contract §1.2):** `title_id` scoping in the WHERE clause makes
  cross-title leakage structurally impossible, not just unlikely; tested in
  WP-3's blast-radius test.
- **License and quarantine enforcement at the data plane:** a
  `license_blocked` source or `quarantined` claim is unreachable at runtime
  even if an application-layer check is forgotten — the query cannot return it.
- **Filtered-ANN correctness:** HNSW with a highly selective post-filter can
  return fewer/worse results than requested; prefiltering to the title's
  partition (btree on `title_id`) then ranking avoids that failure mode.
- **Cost/latency:** per-title candidate sets are small; rerank is cheap and
  predictable, which protects the <500 ms hotkey-to-HUD budget.

## Consequences

- Every retrieval query path MUST go through `retrieval_candidates`; ad-hoc
  vector queries against `embeddings` from Edge Functions are a review-blocking
  defect.
- The embeddings table carries `title_id` denormalized (with btree index) to
  keep the prefilter cheap.
- WP-1 pgTAP must prove: zero rows returned for `runtime_eligible = false`
  titles regardless of embedding similarity.
