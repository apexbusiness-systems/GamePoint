# .understand-anything — GamePoint

> Auto-generated codebase visualization and canonical behavior rules.
> For durable agent memory, corrections, and session continuity → see [`memory/omni-recall/`](../memory/omni-recall/start-here.md).

## Contents

| File | Purpose |
|------|---------|
| `E2E_CANONICAL_BEHAVIOR.md` | Invariants and hard rules that govern production behavior |
| `IDENTITY.md` / `ARCHITECTURE.md` / `TOPOLOGY.md` | What the product is, how the pieces connect |
| `ENVIRONMENT.md` | Every env var, where it lives, and what must never reach the browser |
| `DECISIONS.md` | ADR index (001–009) — navigational only, ADRs are canonical |
| `CONVENTIONS.md` / `CREDENTIALS.md` | Code conventions; credential *names* and placement (never values) |
| `knowledge-graph.json` | Machine-generated codebase graph (nodes, edges, layers) |
| `knowledge-graph.html` | Interactive HTML visualization of the graph |
| `graph-features.mjs` | Enhancement module: watch-mode, drill-down, heatmap, tour |
| `graph-meta.json` | Build metadata for the knowledge graph |

## Rules

1. `E2E_CANONICAL_BEHAVIOR.md` is manually curated — agents must read it before modifying production-critical paths.
2. `knowledge-graph.*` files are auto-generated — do not hand-edit.
3. This folder is **not** durable agent memory. It is a codebase comprehension surface.
