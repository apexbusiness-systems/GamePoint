# GamePoint Compliance Matrix — Title Gate Source of Truth

A title is runtime-supported only when `runtime_eligible=true` **and** `compliance_status='cleared'` **and** every runtime knowledge source carries a commercially usable license. The retrieval function (`006_retrieval.sql`) enforces this structurally — an ineligible title returns zero rows regardless of application code.

Grounding: contract v1.1 (`docs/governance/contract-audit-v1.1.md`), game-point-builder skill compliance references (forge date Jul 2026). Verdicts are research findings, not legal advice; anything commercially significant gets a licensed-lawyer pass before GA.

`UNCERTAIN: research report absent` — contract v1.0 references a 2026-07-08 research report naming 20 PMF titles; it is not in this repo. The 16 titles grounded in the contract text and skill references are logged below. **The remaining 4 rows are intentionally absent, not invented.** Owner: JR Mendoza. Due: before Wave-2 planning.

| Slug | Display name | Publisher | Wave | Anti-cheat class | Publisher stance | Compliance status | Runtime eligible | Reviewed |
|---|---|---|---:|---|---|---|---|---|
| path-of-exile-2 | Path of Exile 2 | Grinding Gear Games | 1 | server_side *(inference)* | Official public API exists; overlay/companion tools widely tolerated. | cleared | true | 2026-07-08 |
| baldurs-gate-3 | Baldur's Gate 3 | Larian Studios | 1 | none | Single-player/co-op, no anti-cheat; companion tooling tolerated. Contract: cleared. | cleared | true | 2026-07-08 |
| elden-ring-nightreign | Elden Ring / Nightreign | FromSoftware / Bandai Namco | 1 | eac_disableable | Skill reference: overlay/guide tools widely tolerated; low-risk launch title. | cleared | true | 2026-07-08 |
| monster-hunter-wilds | Monster Hunter Wilds | Capcom | 1 | server_side *(inference)* | UNCERTAIN: no explicit stance located; contract designates Wave 1 with official sources. | cleared | true | 2026-07-08 |
| warframe | Warframe | Digital Extremes | 1 | server_side *(inference)* | Official Public Export data endpoint; community tooling openly supported. Contract: cleared. | cleared | true | 2026-07-08 |
| diablo-iv | Diablo IV | Blizzard Entertainment | 1 | server_side *(inference)* | Contract contradiction resolved conservatively (audit A4): Blizzard flagged verify_terms. | verify_terms | **false** | 2026-07-08 |
| old-school-runescape | Old School RuneScape | Jagex | 2 | server_side *(inference)* | Wiki content CC-BY-NC-SA — non-commercial license blocks runtime packs. | license_blocked | false | 2026-07-08 |
| minecraft | Minecraft | Mojang / Microsoft | 2 | none | Wiki licensing blocks commercial runtime use per contract. | license_blocked | false | 2026-07-08 |
| stardew-valley | Stardew Valley | ConcernedApe | 2 | none | Wiki licensing blocks commercial runtime use per contract. | license_blocked | false | 2026-07-08 |
| terraria | Terraria | Re-Logic | 2 | none | Contract: cleared (CC-BY-SA wiki). Not Wave 1 → registry only. | cleared | false | 2026-07-08 |
| league-of-legends | League of Legends | Riot Games | 2 | kernel (Vanguard) | Skill reference: Overwolf-class coaching tolerated; Vanguard false-positive risk must be disclosed pre-install. Riot terms: verify. | verify_terms | false | 2026-07-08 |
| valorant | Valorant | Riot Games | 2 | kernel (Vanguard) | Decision-support only; Advantage Check applies hardest here. | verify_terms | false | 2026-07-08 |
| destiny-2 | Destiny 2 | Bungie | 2 | kernel *(inference)* | Contract: Bungie verify_terms; API adapter stubbed behind refusing flag. | verify_terms | false | 2026-07-08 |
| call-of-duty-warzone | Call of Duty: Warzone / MW | Activision | 2 | kernel (Ricochet) | Skill reference: aggressive enforcement posture; higher-risk tier, internal sign-off required. | verify_terms | false | 2026-07-08 |
| grand-theft-auto-v | Grand Theft Auto V | Rockstar Games | 2 | server_side | Skill §IV.A: single-player scope only; EULA bars "guidance on how to cheat" (contract claim, not copyright); GTA Online blocked pending dedicated review. | legal_review | false | 2026-07-08 |
| grand-theft-auto-vi | Grand Theft Auto VI | Rockstar Games | 3 | *(unknown — unreleased)* | Ships 2026-11-19. Registry row only; no mastery claims pre-launch. Never brand with Rockstar marks. | legal_review | false | 2026-07-08 |

## Standing rules
- **Kernel anti-cheat titles:** screen-vision-only posture is mandatory and *still* carries industry-wide false-positive review risk — disclosed in the consent flow before install, never post-ban.
- **PvP-flagged titles** (`valorant`, `league-of-legends`, `call-of-duty-warzone`, `destiny-2`): Advantage Check runs as prompt constraint **and** router post-filter (WP-4).
- **GTA scope lock:** GTA Online is a separate gated review; publisher-issued single-player cheat codes are the only "cheats" ever surfaced (first-party public content).
- **Audio:** ADR-003 keeps v1.0 frame-only; the compliance gate bans audio-capture APIs repo-wide and `audio_opus_bytes` is structurally `null` in the wire contract.
- Any stance change → update this row + `titles.reviewed_at` + `revalidation_due` on affected sources, re-run the license gate.
