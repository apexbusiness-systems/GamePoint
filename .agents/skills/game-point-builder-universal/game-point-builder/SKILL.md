---
name: game-point-builder
description: "Ideates, architects, builds, and maintains GamePoint — a research-based AI game companion that watches the screen via a picture-in-picture overlay, identifies whichever game is running, and gives real-time coaching. Use when: designing or coding a live game-assistant/overlay app, adding a new title to one, or auditing a game-overlay product for ToS, anti-cheat, or trademark risk. Does not cover memory-reading trainers, aimbots, or input-automation tools — this skill actively blocks that path and redirects to the compliant screen-vision architecture instead."
license: "Proprietary - APEX Business Systems Ltd. Edmonton, AB, Canada. https://apexbusiness-systems.com"
---

# GAME-POINT-BUILDER v1.0 — Universal Edition

> A companion, not a cheat. Screen vision in, coaching out — never memory reads, never input automation, never a publisher's trademark without license.

## CONTRACT

**Input**: Any task to ideate, architect, build, harden, extend, or audit GamePoint (or a same-category product).
**Output**: A title-agnostic PiP game-companion app — compliant by construction, not by afterthought.
**Success**: Passes the Compliance Gate (§I), matches the reference architecture (§III), and every title it supports has a logged entry in `references/compliance-matrix.md`.
**Fails when**: A build request tries to skip §I, asks for memory reads/input automation/DRM circumvention, or brands the product using a publisher's trademark without license → **REFUSE that path, offer the compliant alternative.**

This skill assumes zero prior research was done for you. Verified facts as of forge date (Jul 2026): GTA VI ships Nov 19, 2026 (Rockstar, confirmed), single-player campaign confirmed, GTA Online status for the new title not yet confirmed. Take-Two/Rockstar have litigated and won against GTA V mod-menu makers (Take-Two v. defendants re: "Epsilon," UK High Court 2020) on copyright grounds (copying the executable/libraries) — screen-vision-only tools sit outside that specific copyright theory, but GTAV's EULA separately bars "providing guidance... on how to cheat," which is broader language. Treat every title-specific legal claim in this skill as current-as-of-forge; re-verify before a GA launch.

---

## I. COMPLIANCE GATE — Run Before Any Code

Every build, every new title, every feature ships through this gate. It is not optional and it is not a formality — it is the entire difference between "companion app" (legal, monetizable, the category NVIDIA/Microsoft/Overwolf/Questie.ai already validated) and "cheat tool" (litigated, bannable, IP-infringing).

```
1. ARCHITECTURE CHECK  → Does this feature read game memory, inject a DLL/hook into the
                          game process, or automate inputs? 
                          YES → STOP. Not GamePoint. Redirect to §III compliant pattern.
                          NO  → continue.

2. ADVANTAGE CHECK     → In a live competitive multiplayer match, does the output reveal
                          information the player couldn't perceive themselves (enemy position
                          through a wall, aim assistance, item-through-fog)?
                          YES → STOP. That's a sensory-augmentation cheat, not coaching.
                          NO (it's decision-support: builds, timers, macro calls, rotations,
                          "here's what a strong player would consider") → continue.

3. TITLE GATE          → Is this title in references/compliance-matrix.md with a logged
                          verdict? NO → run §IV Per-Title Onboarding Protocol first.

4. TRADEMARK CHECK     → Does any user-facing name, icon, marketing asset, or UI element use
                          a publisher's trademark, logo, or copyrighted art without license?
                          YES → STOP. Use nominative fair use only (see references/
                          legal-guardrails.md §Trademark) — truthful text reference ("works
                          with [Title]"), never branding, never implied endorsement.

5. DATA/CONSENT CHECK  → Does capture include voice audio or other players' identifiable
                          data? → apply references/legal-guardrails.md §Consent before shipping.
```

If any check fails, do not patch around it — the fix is almost always architectural (move the feature to screen-vision-only, reword the output as decision-support, rename the SKU). `UNCERTAIN: <gap>` and ask rather than assume a title/jurisdiction is clear.

---

## II. DECISION ROUTER

| Task | Protocol |
|---|---|
| New build / MVP | → §III Architecture, then §IV for the first title |
| Add a new title | → §IV Per-Title Onboarding Protocol |
| Feature request that touches capture, memory, or input | → §I Compliance Gate first, always |
| GTA V / GTA VI specifically | → §IV.A (dedicated protocol — read before touching this title) |
| Coaching quality / persona design | → §V |
| Pricing / packaging | → §VI |
| Audit an existing overlay product | → run §I as a checklist against the live product; log gaps |

---

## III. REFERENCE ARCHITECTURE — Screen-Vision Only

This is the one design decision that makes the entire product category legal. Build nothing that deviates from it without a documented, title-specific legal exception.

```
CAPTURE   → OS-level frame grab only (Windows.Graphics.Capture / macOS ScreenCaptureKit /
            equivalent). NEVER a DLL injected into the game process, NEVER a memory read,
            NEVER a network packet hook. This is the same capture class as OBS, Discord
            overlay, and NVIDIA's overlay — the class every major anti-cheat already
            tolerates, vs. the injected/hooked class every anti-cheat hunts.
SAMPLE    → Throttle to 1–3 fps for the reasoning loop (full-motion capture is unnecessary
            cost AND it reads as "real-time sensory augmentation" rather than coaching —
            keep the cadence closer to "glance and advise" than "live radar").
IDENTIFY  → Window-title / process-name detection for the fast path; a lightweight vision
            classifier as fallback for borderless/streamed titles. Route to the title's
            knowledge pack in compliance-matrix.md — if the title isn't onboarded, fall
            back to generic reasoning and flag "unverified title" in the UI.
REASON    → Multimodal LLM call (vision + text) constrained by the persona (§V) and by the
            Advantage Check (§I.2) as a hard system-level constraint, not a suggestion the
            model can be talked out of.
PERSONA   → One input at first launch (playstyle + goal, e.g., "casual campaign, story
            first" vs. "ranked climber, efficiency first") sets verbosity, tone, and
            proactivity for every session after — no repeated setup.
OUTPUT    → PiP HUD: text and/or voice, position/opacity user-configurable, one-tap mute.
MEMORY    → Session-scoped pattern tracking (deaths, missed timers, repeated mistakes) —
            opt-in persistence only; default is session-only, purged on close.
CONSENT   → First-run screen: what is captured, what leaves the device, how long it's kept,
            and an explicit toggle for voice capture (off by default — see
            references/legal-guardrails.md §Consent).
```

Full data-flow diagram, storage schema, and latency budget: `references/architecture.md`.

---

## IV. PER-TITLE ONBOARDING PROTOCOL

Before GamePoint claims "expert mastery" of any title, run this once and log the result in `references/compliance-matrix.md`:

```
1. PUBLISHER STANCE  → Read the title's EULA/ToS for "third-party software" language.
                        Search "[publisher] third party overlay policy" and "[title] banned
                        for overlay" — precedent from the actual community tells you more
                        than the ToS text alone (e.g., Overwolf-class tools are tolerated
                        for League/Valorant-adjacent titles; GTA Online and CoD have
                        litigated aggressively against tools that touch the client).
2. ANTI-CHEAT CLASS  → Kernel-level (Vanguard, EAC, BattlEye) → screen-vision-only is your
                        only safe posture; even then, flag to the user that ANY third-party
                        overlay (including this one) can trigger a false-positive review —
                        this is a known industry-wide issue, not unique to GamePoint.
                        No anti-cheat / single-player only → lower risk, still trademark-gate.
3. KNOWLEDGE SOURCE  → Build the title's knowledge pack from licensable sources: official
                        patch notes, publisher documentation, CC-licensed wikis. Do not bulk-
                        scrape paywalled guides or reproduce copyrighted strategy content
                        verbatim — synthesize, cite, don't copy (same discipline as any
                        research deliverable).
4. LOG VERDICT       → Append to compliance-matrix.md: title, publisher stance, anti-cheat
                        class, scope granted (full / single-player-only / decision-support-
                        only / blocked), review date.
```

### IV.A — GTA V / GTA VI Dedicated Protocol (read before building this title)

GTA is the flagship intent behind this skill — build it right, not fast:

- **GTA VI is not released** (confirmed Nov 19, 2026 launch). Do not ship "expert mastery" claims for it before launch; there is no legitimate gameplay data to train or verify against. Pre-launch, build the title-agnostic engine and stage GTA VI as day-one-ready infrastructure, not day-one content.
- **Never brand the product around Rockstar/Take-Two's trademarks.** No "GTA" in the product name, icon, or marketing; no Rockstar logos or game art in the UI. Nominative reference only, in body text: "GamePoint supports Grand Theft Auto VI." Reference: `references/legal-guardrails.md §Trademark`.
- **Single-player campaign first.** GTA Online carries direct, litigated precedent (Take-Two v. Epsilon defendants) targeting tools that interact with the client and an EULA clause explicitly barring "guidance... on how to cheat." Screen-vision coaching sits outside that case's copyright theory but not necessarily outside the EULA's plain text. Ship single-player (campaign, story missions, free roam offline) first; scope GTA Online support as a separate, later legal review — do not silently expand into it.
- **Cheat codes: publisher-issued only.** Rockstar publishes its own in-game cheat codes (phone-entry codes) for single-player — surfacing those on request is fine, it's public first-party content. Never surface third-party trainers, mod-menu code, or exploits framed as "cheats" — that is the exact category Rockstar has sued over.
- Full legal citation trail: `references/compliance-matrix.md §GTA`.

---

## V. PERSONA & COACHING ENGINE

```
ONE-INPUT SETUP → single question at first launch: "What are you playing for — story,
                   mastery, or rank?" drives every default downstream (verbosity, proactivity,
                   tone). No settings maze.
TRUTH BAR        → every claim the agent makes must be traceable to the title's knowledge
                    pack or to what's visibly on screen. No invented item stats, no invented
                    map callouts. If uncertain, say so — a coach who guesses loses trust
                    faster than one who says "not sure, here's how to check."
COACHING MODES    → mirror the validated market pattern (Simple / Guided / Tactical / Pro —
                    see references/monetization-gtm.md for the comp set this is modeled on).
PROACTIVITY       → default to reactive (answers when asked); proactive nudges (unprompted
                    call-outs) are opt-in per session, never default-on for competitive
                    titles where an unprompted call-out could itself read as an advantage
                    tool — keep it decision-support even when unprompted.
```

---

## VI. MONETIZATION & GTM SNAPSHOT

Validated category, not speculative — see `references/monetization-gtm.md` for the full comp table (Questie.ai, STATUP.GG, Mobalytics/Porofessor, NVIDIA G-Assist, Microsoft Gaming Copilot). Freemium + subscription is the proven model; price GamePoint against the $5–$20/mo band those comps already cleared, not against a novel category.

---

## VII. BUILD STANDARDS (APEX-Level, non-negotiable)

```
□ Strict typing, no `any` / untyped escape hatches
□ Input/output schema validation at every boundary (capture → vision → LLM → UI)
□ Idempotent title-onboarding pipeline (re-running it must not duplicate knowledge packs)
□ Blast-radius containment: a new title's knowledge pack must not alter another title's
  behavior; a failed vision call degrades to "no advice this frame," never a crash
□ Observability: every advice event logs (title, mode, latency, confidence) for audit —
  no PII/screen-content in the log by default
□ No new paid vendor/dependency without explicit approval; prefer proprietary IP
  (in-house knowledge packs, in-house classifier) over third-party SDKs where feasible
□ UNCERTAIN: <gap> instead of invented title data, invented legal clearance, or invented
  publisher approval
```

---

## VIII. FAILURE MODES

| Mode | Signal | Countermeasure |
|---|---|---|
| Scope creep into memory-read/injection | "just this once, for accuracy" feature request | Refuse; redirect to §III pattern — accuracy comes from better vision sampling, not memory reads |
| Anti-cheat false-positive ban | User reports ban after install on a kernel-anti-cheat title | Documented, industry-wide risk (§IV.2) — disclose pre-install, not post-ban |
| Trademark drift in marketing | Landing page/App Store listing uses publisher logos or "GTA VI Assistant" naming | Trademark Check (§I.4) at every asset review, not just at code review |
| Unlicensed knowledge scraping | Title knowledge pack built from a paywalled guide site | Source discipline (§IV.3) — licensable sources only, synthesize don't copy |
| Advice crosses into wallhack territory | Real-time enemy-position callouts in ranked play | Advantage Check (§I.2) — reword to decision-support or cut the feature |
| GTA Online scope creep before review | Single-player build silently starts answering GTA Online questions | §IV.A scope lock — GTA Online is a separate, gated review |

---

## IX. REFERENCES

- `references/architecture.md` — full data-flow, capture-to-HUD latency budget, storage schema
- `references/compliance-matrix.md` — per-title verdict log (start populated with GTA V/VI, League, Valorant, CoD, Elden Ring as worked examples)
- `references/legal-guardrails.md` — trademark/nominative-fair-use, consent/wiretap, minors/COPPA, copyright discipline
- `references/monetization-gtm.md` — comp table, pricing bands, positioning

**Version**: 1.0.0 · **Archetype**: Domain + Compliance Gate + Toolkit · **Portability**: Model-agnostic — every gate in §I is a manual checklist any agent can run; no vendor-specific tool calls in this file.
