# GamePoint Visual and Character Animation Direction

## Visual thesis

GamePoint should feel like a midnight strategy room: dark tactical glass, warm illustrated coach portraits, lime targeting marks, amber game energy, and restrained HUD motion.

## Faithful character animation plan

The best production path is a two-layer system:

1. Ship CSS and React motion now for page presence, UI pulses, tactical routes, portrait breathing, hover reveals, and overlay state feedback.
2. Move the coach characters into Rive for production character animation once source layered art is available.

Rive is the strongest fit for the coach squad because its state machines let one character file respond to product state: idle, hover, selected, thinking, urgent advice, success, warning, and offline. Rive's own docs describe state machines as the logic that controls interactive animations, and its runtime supports web and React delivery.

Spine remains the better fit if GamePoint later needs game-grade skeletal animation, walk cycles, complex character rigs, or PixiJS/WebGL scenes. The official Spine Pixi runtime is maintained for PixiJS v8, which makes it a credible future option for a heavier interactive command-room scene.

Lottie is best reserved for lighter vector loops such as icons, badges, loaders, and simple celebratory moments. Lottie-web is mature and efficient, but complex interactivity is less natural than Rive state machines for coach personalities.

## Character motion states

- Idle: subtle breathing, eye movement, hair/hoodie drift, low-opacity scan glow.
- Listening: lean-in pose, lime rim light, small waveform or signal tick.
- Thinking: slowed blink, board-light reflection, rotating tactical marker.
- Advice: quick posture change, speech panel appears from character side.
- Warning: amber edge glow, sharper head turn, pulse once only.
- Win moment: short smile, nod, small lime spark, no confetti-heavy treatment.
- Offline: desaturate, reduce glow, no idle motion except low scan shimmer.

## Asset requirements

- Layered character source art for Maya, Ro, Niko, and June.
- Separate head, torso, arms, hands, hair, glasses, mouth, eyes, accessories, and rim-light layers.
- Neutral, listening, alert, and celebratory poses for each coach.
- Transparent PNG fallback exports for static pages and email/social previews.
- Rive files with named state machines and documented inputs.

## Implementation notes

- Keep characters as anchors, not decoration. Each coach should map to a product function.
- Use the coach color system sparingly: lime for active guidance, amber for tactical urgency, muted gray for paused states.
- Preserve readable product surfaces. The characters should frame attention, not obscure advice, buttons, or compliance copy.
- Respect `prefers-reduced-motion` and provide static portrait fallbacks.
- Avoid full-body animation until the portrait state machine feels excellent. The first high-value motion is face, shoulders, glow, and advice panel timing.

## Research basis

- Rive positions itself as an interactive experience engine with web and React runtimes, and its docs define state machines as the logic that controls interactive animations.
- Esoteric Software documents maintained Spine PixiJS runtimes for PixiJS v8, which supports a future skeletal animation route.
- Airbnb's lottie-web describes Lottie as an After Effects exported animation runtime for web and mobile, making it suitable for lightweight vector animation loops.
