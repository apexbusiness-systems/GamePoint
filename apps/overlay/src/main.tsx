import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Persona = 'story' | 'mastery' | 'rank';

type CoachCue = {
  name: string;
  role: string;
  image: string;
  cue: string;
  tone: Persona;
};

const activePersona: Persona = 'mastery';

const coachCues: CoachCue[] = [
  {
    name: 'Ro',
    role: 'The Shotcaller',
    image: '/art/portrait-ro.png',
    cue: 'Trade on contact. Your second player is close enough to convert.',
    tone: 'mastery',
  },
  {
    name: 'Maya',
    role: 'The Anchor',
    image: '/art/portrait-maya.png',
    cue: 'Hold the angle. Do not overpeek while util is still landing.',
    tone: 'rank',
  },
  {
    name: 'Niko',
    role: 'The Analyst',
    image: '/art/portrait-niko.png',
    cue: 'They are low on utility. Group before the next hit.',
    tone: 'story',
  },
];

function App(): React.JSX.Element {
  return (
    <main className="overlay-shell" aria-label="GamePoint local overlay scaffold">
      <section className="stage">
        <div className="topbar">
          <strong>GamePoint</strong>
          <span className="status"><span className="dot" /> Capture paused</span>
        </div>
        <section className="live-preview">
          <img src="/art/component-live-overlay.png" alt="" />
          <div className="score-strip"><span>2</span><strong>1:12</strong><span>1</span></div>
          {coachCues.map((coach, index) => (
            <article className={`coach-callout callout-${index} ${coach.tone === activePersona ? 'active' : ''}`} key={coach.name}>
              <img src={coach.image} alt={`${coach.name}, ${coach.role}`} />
              <div>
                <strong>{coach.name}</strong>
                <small>{coach.role}</small>
                <span>{coach.cue}</span>
              </div>
              <time>{index === 0 ? '2m ago' : '1m ago'}</time>
            </article>
          ))}
          <div className="reticle" />
          <div className="overlay-hud">
            <span>100 ◎</span>
            <b>G</b>
            <span>25 / 75</span>
          </div>
        </section>

        <section className="consent">
          <strong>Consent required before capture</strong>
          <span>Age gate and privacy consent must pass before the local capture service can start.</span>
        </section>

        <section className="tactical-row" aria-label="Evidence and controls">
          <span>Evidence: Not verified</span>
          <span>Persona: {activePersona}</span>
          <span>Voice/audio: Disabled in v1.0</span>
          <button type="button">Pause capture</button>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
