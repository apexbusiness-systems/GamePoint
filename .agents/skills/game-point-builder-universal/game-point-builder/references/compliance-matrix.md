# Compliance Matrix — Per-Title Verdict Log

## Contents
- How to use this file
- Worked examples (GTA V/VI, League of Legends, Valorant, Call of Duty, Elden Ring)
- Blank entry template

## How to use this file

Every title GamePoint supports gets one entry here, written by running §IV of SKILL.md. This is the audit trail — if a publisher or a court ever asks "on what basis did you support this title," this file is the answer. Update the "review date" whenever a title's ToS, anti-cheat, or litigation posture changes; re-check at minimum before every major version bump of the source game.

None of the verdicts below are legal advice — they're research findings as of the forge date (Jul 2026), written to the standard of "what would a careful operator conclude from public sources." Anything commercially significant (a paid tier, a publisher partnership pitch, expansion into a litigated title's online mode) should get a licensed-lawyer pass before launch, per this org's standing practice of flagging jurisdiction-specific legal decisions for qualified review.

---

## Grand Theft Auto V / VI (Rockstar Games / Take-Two Interactive)

- **Publisher stance**: GTAV EULA prohibits cheating and explicitly bars "providing guidance or instruction to any individual or entity on how to cheat" — broader than a simple anti-cheat clause. GTA VI's EULA is not yet public; assume materially similar language until confirmed.
- **Litigation precedent**: Take-Two/Rockstar v. Epsilon defendants (UK High Court, summary judgment 2020) — won on copyright grounds against mod-menu creators who copied the GTAV executable/libraries to build a memory-modifying cheat tool. Screen-vision-only coaching does not copy the game binary, so it sits outside that specific copyright theory — but it does not automatically clear the EULA's broader "guidance on how to cheat" language, which is a contract claim, not a copyright one.
- **Release status**: GTA VI confirmed for Nov 19, 2026 (Rockstar Newswire), single-player campaign confirmed; GTA Online status for the new title unconfirmed as of forge date.
- **Anti-cheat class**: GTA Online multiplayer has historically relied on a mix of server-side detection and its own EULA/ToS enforcement rather than a third-party kernel anti-cheat (unlike Valorant/CoD) — but Rockstar's enforcement team is known to actively pursue tool-makers, not just individual users.
- **Verdict**: **Scope granted: single-player only, screen-vision-only, no branding using Rockstar/Take-Two trademarks.** GTA Online support: **blocked pending dedicated legal review** — do not silently expand.
- **Review date**: Set at forge date (Jul 2026); re-check at GTA VI launch (Nov 19, 2026) and before any GTA Online scope expansion.

---

## League of Legends (Riot Games)

- **Publisher stance**: Riot has an established, semi-official tolerance for Overwolf-class overlay/coaching apps (Mobalytics, Porofessor, STATUP.GG all operate openly on the Overwolf platform, which maintains publisher relationships).
- **Anti-cheat class**: Riot Vanguard (kernel-level) — flags "third-party software" broadly, including some benign overlays, per community-reported false positives. Not targeted at coaching overlays specifically, but any kernel-anti-cheat titled carries background false-positive risk regardless of intent.
- **Verdict**: **Scope granted: full coaching/decision-support, screen-vision-only.** Disclose Vanguard false-positive risk to users pre-install.
- **Review date**: Set at forge date; re-check if Riot changes its Overwolf-class tool policy.

---

## Valorant (Riot Games)

- Same publisher/Vanguard posture as League. Riot's own transparency reporting confirms Vanguard issues a high volume of bans monthly and that third-party software conflicts are a documented false-positive source — disclose this explicitly in GamePoint's Valorant onboarding flow.
- **Verdict**: **Scope granted: decision-support only (no enemy-position or wallhack-equivalent output — Advantage Check applies hardest here given Valorant's competitive-integrity stance).**

---

## Call of Duty: Warzone / MW (Activision)

- **Anti-cheat class**: Ricochet (kernel-level), aggressive enforcement posture, documented targeting of overlay/injected tools in community ban-appeal literature.
- **Verdict**: **Scope granted: screen-vision-only, decision-support only, explicit pre-install false-positive disclosure.** Treat as higher-risk tier — require an internal sign-off before marketing this title as supported.

---

## Elden Ring (FromSoftware / Bandai Namco)

- **Publisher stance**: Primarily single-player; no kernel anti-cheat in the base game. Third-party overlay/guide tools are widely tolerated in the community.
- **Verdict**: **Scope granted: full coaching, low risk tier.** Good candidate for an early, low-legal-friction launch title alongside GTA V (single-player).

---

## Blank Entry Template

```
## <Title> (<Publisher>)
- Publisher stance:
- Litigation precedent (if any):
- Anti-cheat class:
- Knowledge source(s) used:
- Verdict: <full / single-player-only / decision-support-only / blocked>
- Review date:
```
