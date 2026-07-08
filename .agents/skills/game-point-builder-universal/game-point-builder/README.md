# game-point-builder (Universal Edition)

Ideates, architects, builds, and maintains **GamePoint** — a research-based, screen-vision AI game companion that identifies whichever game is running and gives real-time coaching through a picture-in-picture overlay. Model-agnostic: works with Claude, GPT, Gemini, or any instruction-following agent — every gate is a manual checklist, no vendor-specific tool calls.

## Install

- **Claude.ai**: Settings → Capabilities → upload this folder (or the packed zip).
- **Any agent framework**: drop the `game-point-builder/` folder into your skills/tools directory; point your agent's system prompt or skill-loader at `SKILL.md`.
- **skills.sh-style ecosystems**: `npx skills add <your-repo-url> --skill game-point-builder` (once hosted in a repo).

## Before / After

**Before** (no skill): asked to build a "GTA VI game assistant," a generic agent will likely (a) name and market the product using Rockstar's trademark, (b) not distinguish decision-support coaching from wallhack-equivalent output in competitive titles, (c) default to whatever capture method is easiest — including memory reads or process hooks that put the product in the same technical/legal category as litigated cheat tools, and (d) claim "expert mastery" of a game (GTA VI) that hasn't shipped yet.

**With this skill**: the Compliance Gate (SKILL.md §I) runs before any code is written. The agent is architecturally blocked from memory-read/injection paths, is required to log a per-title legal verdict (references/compliance-matrix.md) before claiming title support, defaults to screen-vision-only capture (the same class OBS/Discord/NVIDIA's own overlay use), and treats GTA VI specifically as single-player-first, non-Rockstar-branded, until GTA Online's status is separately reviewed post-launch.

## What's inside

```
game-point-builder/
├── SKILL.md                       — decision router + Compliance Gate (read this first)
├── references/
│   ├── architecture.md            — screen-vision-only pipeline, latency budget, storage schema
│   ├── compliance-matrix.md       — per-title legal verdict log (GTA V/VI, League, Valorant, CoD, Elden Ring worked examples)
│   ├── legal-guardrails.md        — trademark, consent/wiretap, minors/COPPA, copyright discipline
│   └── monetization-gtm.md        — comp table (Questie.ai, STATUP.GG, NVIDIA G-Assist, Microsoft Gaming Copilot) + pricing bands
├── evals/trigger-eval.json        — authored trigger set (not yet run through forge.py — see scorecard.json)
├── scorecard.json                 — honest status of every measurable claim
└── MANIFEST.json
```

## Runtime footer

Built for use inside APEX-OmniHub's Guardian → Planner → Executor pipeline as well as standalone agent use. Registry path convention (if ingested into OmniHub): `omni-skills/game-point-builder/1.0.0/`.

## Replaces

None — this is a new skill, not a successor to `apex-game-dev` (which covers general game *development*, not a game-*assistant* product).
