# Legal Guardrails

## Contents
- Trademark & nominative fair use
- Consent / wiretap (voice capture)
- Minors / COPPA
- Copyright discipline (knowledge packs, assets, DRM)
- Standing recommendation: publisher partnership over adversarial posture

**None of this is legal advice.** It's the operating discipline this skill enforces so the product stays defensible; get a licensed lawyer's sign-off before any commercially significant launch (paid tier, a litigated title's online mode, marketing that names a publisher).

## Trademark & nominative fair use

You may truthfully say, in body text, "GamePoint supports Grand Theft Auto VI" — that's nominative fair use (identifying a compatible product) in most jurisdictions, including the US and UK. You may **not**: use the publisher's name or a title's name in your own product name, app icon, or primary marketing asset in a way that implies affiliation or endorsement; use the publisher's logo, box art, or in-game screenshots in your UI or store listing; register a domain or social handle that reads as an official channel for the title. "GamePoint" as a standalone brand, with individual titles referenced only in supported-titles text/lists, is the correct pattern — never "GTA VI Assistant," "GTA Companion," or similar as a product name or SKU.

## Consent / wiretap (voice capture)

If GamePoint ever captures audio — the user's voice, in-game voice chat, or other players' voice — US wiretap law is a real exposure surface: several states (California, Illinois, and others) require **all-party consent** to record a conversation, not just one party's. Default posture:

- Voice capture is **off by default**. Visual-only capture + text HUD output is the safe default configuration.
- If voice input/output is offered (user talking to GamePoint, GamePoint talking back), that's the user consenting for their own voice — fine. The risk is **other players'** voice in a shared voice-chat channel being captured incidentally.
- If any feature could pick up other players' voice (e.g., listening to game audio that includes voice chat), disclose it explicitly at first run and default it off; don't bundle it silently into "screen + audio capture."

## Minors / COPPA

Gaming audiences skew young. If GamePoint's marketing or actual usage reaches users under 13 (US) or the relevant age threshold elsewhere: age-gate at signup, no behavioral/ad data collection on users under the threshold without verifiable parental consent, no targeted advertising to minors. Treat this as a hard requirement for any consumer launch, not a "we'll fix it later" item — COPPA enforcement is active and penalty-bearing.

## Copyright discipline

- **Knowledge packs**: build from official patch notes, publisher documentation, and CC-licensed community wikis. Synthesize and cite; don't bulk-copy paywalled guide content or reproduce strategy-guide text verbatim at any length that would displace the original.
- **In-app assets**: no publisher game art, music, or footage in GamePoint's own UI, icon, or marketing beyond what nominative fair use covers (which is text reference, not asset reuse).
- **No DRM circumvention, no reverse engineering of game binaries.** Screen-vision-only architecture (references/architecture.md) means this should never come up as a technical need — if a feature request implies it does, that's a signal the feature has drifted out of scope (SKILL.md §I.1).
- **Vision classifier training data**: use publicly available box art / UI chrome for title identification, not bulk-scraped copyrighted gameplay footage without license.

## Standing recommendation: publisher partnership over adversarial posture

The most durable version of this product isn't the one that out-maneuvers anti-cheat and EULA text — it's the one that gets a publisher relationship, the way Overwolf did (publisher-facing SDK, compliance agreements) and the way Microsoft's Gaming Copilot did (first-party position inside Xbox's own ecosystem). Screen-vision-only architecture is the credible-signal that makes that conversation possible: it's the same technical posture publishers already tolerate from Overwolf, OBS, and Discord. Treat outreach to a title's publisher as the long-term moat, not a nice-to-have — especially before expanding into any kernel-anti-cheat-protected competitive title's online mode.
