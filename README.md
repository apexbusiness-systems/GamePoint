# GamePoint

Screen-vision-only AI game companion. Windows capture service (Rust), PiP overlay
client (Tauri), Supabase-hosted knowledge and retrieval plane, event-driven
multimodal inference, and per-title knowledge packs.

**Owner:** JR Mendoza · **Org:** APEX Business Systems Ltd. · **Contract:** GamePoint Execution Contract v1.0 (2026-07-07)

## Compliance posture (non-negotiable)

GamePoint observes only what the player can see: OS-level frame capture of the
game window, on hotkey. It never reads game memory, never injects into game
processes, never automates input, never hooks network packets, and ships no
kernel driver. This is enforced at build time by
[`governance/ci/compliance-gate.sh`](governance/ci/compliance-gate.sh) and
governed per title by
[`governance/compliance-matrix.md`](governance/compliance-matrix.md).

## Repository topology

```
apex-gamepoint/
├── supabase/
│   ├── migrations/            # 001..007, sequential, IF NOT EXISTS guarded   (WP-1)
│   ├── functions/
│   │   ├── _shared/           # cors.ts, zod schemas, auth helpers            (WP-4)
│   │   ├── assist/            # POST: frame payload in → coaching JSON out    (WP-4)
│   │   ├── retrieval-plan/    # internal: relational filter → vector rerank   (WP-4)
│   │   └── ingest-webhook/    # pipeline callbacks (service-role only)        (WP-4)
│   └── seed/seed.sql          # 20 titles, knowledge_sources, waves, licenses (WP-1)
├── services/
│   └── capture-win/           # Rust workspace (Windows target)               (WP-5)
│       ├── crates/capture/    # DXGI Desktop Duplication + D3D11 texture pool
│       ├── crates/audio/      # WASAPI loopback + Opus encode on dispatch
│       ├── crates/ringbuf-x/  # SPSC metadata/audio rings
│       ├── crates/dispatch/   # tonic gRPC client, protobuf payload, blake3
│       └── crates/svc/        # hotkey, tray, config, orchestration
├── apps/
│   └── overlay/               # Tauri 2.x PiP HUD (React + TS strict)         (WP-5)
├── packages/
│   ├── contracts/             # protobuf + Zod + generated types              (WP-2)
│   ├── ingest/                # Python 3.12 knowledge pipeline                (WP-3)
│   └── router/                # inference router lib (TS): nano→mini cascade  (WP-4)
├── governance/
│   ├── compliance-matrix.md   # per-title verdict log (Title Gate source of truth)
│   └── ci/                    # compliance-gate.sh, license-gate.py
├── docs/                      # ADRs, runbooks, consent copy, evidence packs
└── .github/workflows/         # ci.yml (lint/test/gates), release.yml
```

Each work package (WP-0 … WP-7) lands as one revertable PR; language toolchain
manifests land with the WP that introduces code for them. See
`docs/evidence/` for the verbatim verification artifacts required by the
contract's Evidence Standard (§6).

## Local development

Copy `ENV.example` to `.env` (gitignored) and fill in values. Secrets are never
committed; server-side secrets are set with `supabase secrets set` and read via
`Deno.env.get()`.
