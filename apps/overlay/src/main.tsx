import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Persona = 'story' | 'mastery' | 'rank';

const persona: Persona = 'mastery';

function App(): React.JSX.Element {
  return (
    <main className="hud" aria-label="GamePoint local overlay scaffold">
      <section className="consent"><strong>Consent required before capture</strong><span>Age gate and privacy consent must pass before the local capture service can start.</span></section>
      <section className="status"><span className="dot" /> Capture paused</section>
      <section><p className="advice">No useful coaching from this frame. Try again when the screen shows the decision point clearly.</p><p>Persona: {persona}</p></section>
      <section className="chips"><span>Confidence: waiting</span><span>Evidence: Not verified</span><button type="button">Pause capture</button></section>
      <section className="settings"><strong>Voice/audio</strong><span>Disabled in v1.0.</span></section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
