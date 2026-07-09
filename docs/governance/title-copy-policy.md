# Title Copy Policy

Applies to every string that ships to a user: the public marketing/demo landing
(`apps/web/src/main.tsx`), the authenticated app (`apps/web/src/app.tsx`), and overlay
fixtures (`apps/overlay/src/*`). Grounds GAP A of the 2026-07-09 Cowork execution pass —
see `audit/gamepoint-cowork-evidence.md`.

## Rules

1. **No unsupported title names in shipped copy.** A title name may only appear in
   product-facing text if it has a row in `governance/compliance-matrix.md`.
2. **No real map, level, or team names** from any title — cleared or not. Use invented,
   generic names (e.g., "Latest Run" rather than a real map name).
3. **No tactical-shooter mechanic-specific jargon** — angles/peeking, utility/smokes,
   plants/bombsites, buy economy, retakes, executes — unless the referenced title is both
   `compliance_status=cleared` and `runtime_eligible=true` in the compliance matrix. As of
   this pass, zero cleared titles are tactical shooters (Wave 1 is Path of Exile 2,
   Baldur's Gate 3, Elden Ring/Nightreign, Monster Hunter Wilds, Warframe), so v1 ships
   title-agnostic coaching language only — positioning, resource management, timing,
   teamwork — with no genre-specific mechanic claims.
4. **Fixture/demo examples must match the cleared title class.** Overlay dev fixtures and
   marketing preview data should read as generically applicable to ARPG/soulslike/co-op
   play, not any other genre, until the matrix clears something else.
5. **Coach Squad names/roles are a brand layer over one coaching engine.** Copy must never
   imply four separate concurrent AI agents; each coach maps 1:1 to a single
   `coaching_mode` value (`simple`/`guided`/`tactical`/`pro`).

## Enforcement

`apps/web/src/app.test.mjs` includes source-string checks against a banned-term list
(`title copy policy` test) and a structural check that Coach Squad cards map to
`coaching_mode`. There is no CI gate for copy content yet —
`governance/ci/compliance-gate.sh` enforces the API/audio-capture bans only, not shipped
text. Any new user-facing string should be checked against this policy at review time.
