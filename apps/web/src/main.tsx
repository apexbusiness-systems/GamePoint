import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type TitleState = 'supported' | 'blocked';

type TitleCard = {
  name: string;
  state: TitleState;
  note: string;
};

const titles: TitleCard[] = [
  {
    name: 'Verified titles',
    state: 'blocked',
    note: 'UNCERTAIN: title research report is absent; runtime support remains paused until cleared.',
  },
  {
    name: 'Grand Theft Auto VI',
    state: 'blocked',
    note: 'Registry only. Legal and compliance review is required before runtime support.',
  },
];

function App(): React.JSX.Element {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Screen-only coaching for PC play</p>
        <h1>GamePoint gives short, visible-screen advice without touching your game.</h1>
        <p className="lede">The Windows overlay stays local, capture starts only after consent, and unsupported titles stay paused until compliance review clears them.</p>
        <div className="actions"><a href="#download">Download for Windows</a><a href="#privacy" className="secondary">Read privacy boundary</a></div>
      </section>
      <section id="privacy" className="grid">
        <article><h2>What it does</h2><p>Processes one user-triggered frame or region of interest through the approved Supabase assist path.</p></article>
        <article><h2>What it never does</h2><p>No game injection, memory reads, packet hooks, microphone capture, system audio capture, or Cloudflare frame streaming.</p></article>
        <article><h2>Your evidence view</h2><p>Session summaries show safe metadata and evidence status, not raw frame content or private chat text.</p></article>
      </section>
      <section id="titles">
        <h2>Supported title status</h2>
        <div className="cards">{titles.map((title) => <article key={title.name} className="card"><strong>{title.name}</strong><span>{title.state === 'supported' ? 'Supported' : 'Not runtime supported'}</span><p>{title.note}</p></article>)}</div>
      </section>
      <section id="download" className="download"><h2>Install path</h2><p>Windows installer publishing is prepared in later work packages. Until then, deployment remains local-only and release-gated.</p></section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
