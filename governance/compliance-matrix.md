# GamePoint Compliance Matrix — Title Gate source of truth

Contract §1.1.3: a title ships as "supported" only with a row here logging
publisher stance, anti-cheat class, scope granted, and review date.
Rows below are seeded **only from facts attested in the GamePoint Execution
Contract v1.0 (2026-07-07)**. Cells the contract does not attest are marked
`UNCERTAIN` — per §1.2, `UNCERTAIN` beats invented data or invented legal
clearance. The authoritative 20-title research report (2026-07-08) **was not
provided to this execution session**; see "Open gaps" below.

Legend — `anti_cheat_class`: none | server_side | eac_disableable | kernel.
`compliance_status`: cleared | verify_terms | license_blocked | legal_review.
`runtime_eligible` is the **current** value (default false); Wave 1 titles flip
to true only after their pack is built from cleared/official sources (WP-3) and
this row is updated with the granting review.

| # | slug | display_name | publisher | wave | anti_cheat_class | publisher_stance | knowledge license flag | compliance_status | runtime_eligible | reviewed_at |
|---|------|--------------|-----------|------|------------------|------------------|------------------------|-------------------|------------------|-------------|
| 1 | path-of-exile-2 | Path of Exile 2 | Grinding Gear Games | 1 | server_side | UNCERTAIN — pending research report | official API planned (WP-3 adapter); wiki license UNCERTAIN | verify_terms | false | 2026-07-08 |
| 2 | baldurs-gate-3 | Baldur's Gate 3 | Larian Studios | 1 | none | UNCERTAIN — pending research report | cleared (contract seed spec) | cleared | false | 2026-07-08 |
| 3 | elden-ring-nightreign | Elden Ring / Nightreign | FromSoftware / Bandai Namco | 1 | eac_disableable (inference) | UNCERTAIN — pending research report | UNCERTAIN | verify_terms | false | 2026-07-08 |
| 4 | monster-hunter-wilds | Monster Hunter Wilds | Capcom | 1 | UNCERTAIN | UNCERTAIN — pending research report | UNCERTAIN | verify_terms | false | 2026-07-08 |
| 5 | warframe | Warframe | Digital Extremes | 1 | UNCERTAIN | UNCERTAIN — pending research report | cleared (contract seed spec; official Public Export API) | cleared | false | 2026-07-08 |
| 6 | diablo-iv | Diablo IV | Blizzard Entertainment | 1 | UNCERTAIN | UNCERTAIN — pending research report | verify_terms (contract: Blizzard API terms; ingest adapter refuses to run until cleared) | verify_terms | false | 2026-07-08 |
| 7 | terraria | Terraria | Re-Logic | UNCERTAIN | none | UNCERTAIN — pending research report | cleared (contract seed spec) | cleared | false | 2026-07-08 |
| 8 | old-school-runescape | Old School RuneScape | Jagex | UNCERTAIN | UNCERTAIN | UNCERTAIN — pending research report | license_blocked (contract seed spec — non-commercial wiki license; quarantine namespace only) | license_blocked | false | 2026-07-08 |
| 9 | minecraft | Minecraft | Mojang / Microsoft | UNCERTAIN | UNCERTAIN | UNCERTAIN — pending research report | license_blocked (contract seed spec) | license_blocked | false | 2026-07-08 |
| 10 | stardew-valley | Stardew Valley | ConcernedApe | UNCERTAIN | none | UNCERTAIN — pending research report | license_blocked (contract seed spec) | license_blocked | false | 2026-07-08 |
| 11 | destiny-2 | Destiny 2 | Bungie | UNCERTAIN | UNCERTAIN | UNCERTAIN — pending research report | verify_terms (contract: Bungie API terms; adapter refuses to run until cleared) | verify_terms | false | 2026-07-08 |
| 12 | gta-vi | Grand Theft Auto VI | Rockstar Games | 3 | UNCERTAIN | UNCERTAIN — registry row only; not runtime-eligible until post 2026-11-19 | UNCERTAIN | legal_review | false | 2026-07-08 |

## Open gaps (blockers for Pre-Flight P5)

- **UNCERTAIN: rows 13–20 unknown.** The contract requires all 20 PMF titles;
  only the 12 above are attested by the contract text. The 2026-07-08 research
  report is the source of truth for the full list and was not available to this
  session. Owner: JR Mendoza. Needed: the report, or the 8 remaining titles with
  wave + license flags.
- **UNCERTAIN: Riot title identity.** The contract's seed spec flags
  "Riot … verify_terms" but does not name the title (League of Legends and/or
  VALORANT). No row is seeded rather than guessing; note VALORANT's kernel
  anti-cheat (Vanguard) would make it a high-scrutiny row under §1.1.1.
- **UNCERTAIN: whether Elden Ring and Nightreign are one registry row or two.**
  The contract counts the Wave 1 set as "6-title" with "Elden Ring/Nightreign"
  as one slot; seeded as one row pending the report.
- All `publisher_stance` cells require the research report before any
  `verify_terms` row can move to `cleared`. No stance is invented here.

## Change protocol

Any Compliance Gate hit mid-WP is logged here (title, date, what fired, the
compliant alternative) before work resumes. Vendor/license fact changes update
the affected row and `revalidation_due` in `knowledge_sources`, then re-run only
the affected gate (Contract §5).
