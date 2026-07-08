# Component Parity Audit — GamePoint Web Cockpit + Overlay

Date: 2026-07-08 · Auditor: Claude Code (parity pass vs `apps/web/public/art/component-*.png`)

## 1. Live Overlay Preview (`component-live-overlay.png`)

Current gaps:
- Title bar lacks the red status dot + uppercase lime treatment of the reference titlebar.
- No GAMEPOINT brand chip inside the game window (reference: top-left lime hex + wordmark).
- Score strip lacks the flanking mini agent-avatar rows the reference shows.

Fixes:
- Add `.title-dot` red status dot to component panel titlebars.
- Add `.gp-chip` brand chip inside `.game-window`.
- Add avatar micro-strips to `.score-strip`.

Acceptance: titlebar text `LIVE OVERLAY PREVIEW` w/ dot + controls; score strip w/ avatars; 4 coach callouts w/ portrait, name, role, advice, timestamp; reticle; bottom HUD (health · GP hex · ammo).

## 2. Strategy Board (`component-strategy-board.png`)

Current gaps:
- Routes are straight gradient bars; reference shows curved arrows (lime + amber arcs) with arrowheads and X block-marks.
- No bottom status strip (`Next Advice Sync · 00:07`).
- Dropdown is plain text, not a control; tool rail buttons are icon-only with no accessible names.

Fixes:
- Replace straight `.route` spans with an inline SVG overlay: curved lime/amber paths + arrowheads + X marks, `routeDraw` animation.
- Add `.board-status` strip with sync readout.
- Make strategy selector a `<button>` control; add `aria-label` to each tool-rail button.

Acceptance: title, working-looking dropdown control, left tool rail (labeled), map texture, curved routes w/ arrowheads, A/B/R nodes, X marks, right Tools list, Layers toggles, sync strip.

## 3. Replay Review (`component-replay-review.png`)

Current gaps:
- Key moments are plain rows; reference uses time chips (`0:45` etc.) + label, under a `Key Moments` header.
- Coach note lacks its `Coach Notes` header.
- No bottom status strip (`Overlay Active · Connected`).

Fixes:
- Restructure moments into chip + label rows with `Key Moments` / `Coach Notes` headers.
- Add `.replay-status` strip.
- Keep heatmap blobs blended into the video image (`mix-blend-mode: screen` already integrated).

Acceptance: title, metadata line, video surface w/ integrated heatmap, playback controls, scrub/event timeline w/ markers, Key Moments chips, Coach Notes entry, status strip.

## 4. Community + Active Thread (`component-community.png`)

Current gaps:
- Tabs are a plain text span; reference shows Feed (active chip) / LFG / Events.
- Thread messages lack avatars; reference chat rows each show one.
- Post reactions use only glyph text; second post lacks its map-thumbnail feel.

Fixes:
- Real tab chips with active state.
- Structured thread messages: avatar + author + text + timestamp.
- Reaction row with like/reply counts; keep two dense post cards + composer.

Acceptance: Feed/LFG/Events tabs, composer, ≥2 post cards w/ avatar + meta + reactions, active thread `#general` w/ avatared messages + message composer.

## Cross-cutting

- A11y: `aria-label` on icon-only controls; global `:focus-visible` outline; `prefers-reduced-motion` already honored.
- Overlay app: add GAMEPOINT brand chip, 4th (June/amber) callout, score-strip avatars to match the reference directly; compliance copy preserved verbatim.
- Compliance copy retained: `No game injection`, `Not runtime supported until cleared`, `Consent required before capture`, `Voice/audio: Disabled in v1.0`.
