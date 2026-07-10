# Do not do — hard prohibitions

1. No game-memory reads, injection, DLLs, packet hooks, or input automation — ever, for any reason.
2. No microphone/system-audio capture; `audio_opus_bytes` stays structurally null.
3. Never hand-flip a title to supported — compliance-matrix + SQL gate is the only path.
4. Never put service-role keys, model keys, or PATs in browser bundles, Cloudflare, or GitHub
   Actions (unless a deploy job explicitly requires it); Supabase Edge secrets only.
5. Never run the mutating pgTAP suite against production (it creates users).
6. No continuous capture/streaming in v1 (frame-only, ADR-003).
7. No Rockstar branding pre-GTA-VI clearance; GTA scope is single-player only.
8. Never bypass the compliance or license CI gates to make a build pass.
9. Do not write to the user's mounted GamePoint folder from bash (silent write truncation);
   work in a clean clone and deliver via PR.
