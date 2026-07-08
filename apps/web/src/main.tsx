import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type TitleState = 'supported' | 'paused' | 'registry';

type TitleCard = {
  name: string;
  state: TitleState;
  note: string;
};

// Mirrors supabase/seed/seed.sql — a title appears as supported here only when
// runtime_eligible=true and compliance_status='cleared' in the registry.
const titles: TitleCard[] = [
  { name: 'Path of Exile 2', state: 'supported', note: 'Official API sources. Anti-cheat class recorded as server-side (inference).' },
  { name: "Baldur's Gate 3", state: 'supported', note: 'Cleared. CC-BY-SA wiki and official patch notes.' },
  { name: 'Elden Ring / Nightreign', state: 'supported', note: 'Cleared. Low-risk tier; EAC is disableable offline.' },
  { name: 'Monster Hunter Wilds', state: 'supported', note: 'Official update notes. Publisher stance under continued review.' },
  { name: 'Warframe', state: 'supported', note: 'Cleared. Official Public Export data.' },
  { name: 'Diablo IV', state: 'paused', note: 'Paused until publisher terms review completes. Nothing is captured for paused titles.' },
  { name: 'Grand Theft Auto VI', state: 'registry', note: 'Registry only until after launch and legal review. No coaching claims before there is a game to verify against.' },
];

const stateLabel: Record<TitleState, string> = {
  supported: 'Supported',
  paused: 'Paused — terms review',
  registry: 'Registry only',
};

function App(): React.JSX.Element {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Screen-only coaching for PC play</p>
        <h1>The coach in your corner: it watches the fight, it never touches the controls.</h1>
        <p className="lede">
          GamePoint reads only what is on your screen, only when you ask, and answers with
          evidence-backed coaching. No injection, no memory reads, no input automation —
          engineered that way, verified in CI, enforced in the database schema.
        </p>
        <div className="actions">
          <a href="#download">Download for Windows</a>
          <a href="#privacy" className="secondary">Read the privacy boundary</a>
        </div>
      </section>
      <section id="privacy" className="grid">
        <article>
          <h2>What it does</h2>
          <p>On your hotkey, one frame is analyzed against the title&apos;s verified knowledge pack. Every claim carries its evidence or is marked &quot;Not verified.&quot;</p>
        </article>
        <article>
          <h2>What it never does</h2>
          <p>No game injection, memory reads, packet hooks, input automation, microphone or system-audio capture. In competitive play it coaches decisions — it never reveals what you could not see yourself.</p>
        </article>
        <article>
          <h2>What is kept</h2>
          <p>Nothing by default. Frames are processed in memory and discarded. Telemetry is operational metadata only — no frame content, usernames, or chat.</p>
        </article>
      </section>
      <section id="titles">
        <h2>Title status</h2>
        <p className="lede">A title is listed as supported only after a logged compliance review. Paused means paused — capture stays off for that game.</p>
        <div className="cards">
          {titles.map((title) => (
            <article key={title.name} className="card">
              <strong>{title.name}</strong>
              <span>{stateLabel[title.state]}</span>
              <p>{title.note}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="download" className="download">
        <h2>Install path</h2>
        <p>The signed Windows installer ships with the v1.0 release gate. Until then, builds are local-only and release-gated.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
