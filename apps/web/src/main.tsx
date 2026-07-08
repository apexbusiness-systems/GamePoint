import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Coach = {
  name: string;
  role: string;
  image: string;
  cue: string;
};

type NavItem = {
  label: string;
  icon: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', icon: '⌂', active: true },
  { label: 'Live Overlay', icon: '▣' },
  { label: 'Sessions', icon: '◴' },
  { label: 'Replay Review', icon: '▧' },
  { label: 'Coach Squad', icon: '◎' },
  { label: 'Community', icon: '◇' },
  { label: 'Insights', icon: '▥' },
  { label: 'Settings', icon: '⚙' },
];

const coaches: Coach[] = [
  { name: 'Maya', role: 'The Anchor', image: '/art/portrait-maya.png', cue: 'Hold the angle. Do not overpeek.' },
  { name: 'Ro', role: 'The Shotcaller', image: '/art/portrait-ro.png', cue: 'Trade on contact. Second is close.' },
  { name: 'Niko', role: 'The Analyst', image: '/art/portrait-niko.png', cue: 'Low on utility. Group before hit.' },
  { name: 'June', role: 'The Builder', image: '/art/portrait-june.png', cue: 'Drop smoke here, then plant safe.' },
];

const advice = [
  ['Ro', 'Good rotate. You drew attention top side.'],
  ['Maya', 'Anchor the next push. Hold the angle.'],
  ['Niko', 'Watch their econ. Big buy round coming.'],
  ['June', 'Try a fast deploy on A. They are stacked B.'],
];

function Sidebar(): React.JSX.Element {
  return (
    <aside className="sidebar" aria-label="GamePoint navigation">
      <div className="brand">
        <span className="brand-mark">G</span>
        <strong>GamePoint</strong>
      </div>
      <nav>
        {navItems.map((item) => (
          <a className={item.active ? 'active' : undefined} href={`#${item.label.toLowerCase().replaceAll(' ', '-')}`} key={item.label}>
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="player-card">
        <img src="/art/portrait-ro.png" alt="" />
        <div>
          <strong>PlayerOne</strong>
          <span>Level 24</span>
        </div>
      </div>
    </aside>
  );
}

function CoachSquad(): React.JSX.Element {
  return (
    <section className="panel squad-panel" id="coach-squad">
      <div className="panel-head">
        <div>
          <h2>Coach Squad</h2>
          <p>Your crew. Your edge.</p>
        </div>
      </div>
      <div className="coach-row">
        {coaches.map((coach) => (
          <article className="coach-card" key={coach.name}>
            <img src={coach.image} alt={`${coach.name}, ${coach.role}`} />
            <strong>{coach.name}</strong>
            <span>{coach.role}</span>
            <small><i /> Online</small>
          </article>
        ))}
      </div>
      <button className="ghost-button" type="button">View Coach Squad →</button>
    </section>
  );
}

function HeroPanel(): React.JSX.Element {
  return (
    <section className="hero-panel" id="home">
      <img src="/art/coach-table.png" alt="" />
      <div className="hero-scrim" />
      <div className="hero-copy">
        <p>Welcome back, <strong>PlayerOne</strong></p>
        <h1>Coach in<br /><em>your</em> corner.</h1>
        <span>Screen-only coaching. Real community. Real progress.</span>
        <div className="hero-micro">
          <small>Overlay safe</small>
          <small>4 coaches online</small>
          <small>Sync 00:07</small>
        </div>
        <div className="hero-actions">
          <button type="button">Go Live <b>⌁</b></button>
          <button className="secondary" type="button">▣ Schedule a Session</button>
        </div>
      </div>
      <div className="floating-status"><i /> Overlay active <b>▥</b></div>
    </section>
  );
}

function LiveCards(): React.JSX.Element {
  return (
    <div className="live-grid">
      <section className="panel score-panel">
        <div className="panel-head">
          <h2>Live Match</h2>
          <span className="live-badge">● LIVE</span>
        </div>
        <div className="score-line">
          <span className="hex">G</span>
          <strong>2 - 1</strong>
          <span className="hex opponent">G</span>
        </div>
        <button className="outline-button" type="button">View Overlay →</button>
      </section>

      <section className="panel advice-panel">
        <div className="panel-head">
          <h2>Advice Feed</h2>
          <span>7 new</span>
        </div>
        {advice.map(([name, text]) => {
          const coach = coaches.find((item) => item.name === name) ?? coaches[0];
          return (
            <article className="advice-item" key={text}>
              <img src={coach.image} alt="" />
              <div>
                <strong>{name}</strong>
                <p>{text}</p>
              </div>
              <time>2m</time>
            </article>
          );
        })}
      </section>

      <section className="panel session-panel">
        <div className="panel-head">
          <h2>Session Upcoming</h2>
          <span>Edit</span>
        </div>
        <div className="session-card">
          <div>
            <strong>Strategy Session</strong>
            <span>with Niko</span>
            <small>Tomorrow · 7:00 PM</small>
          </div>
          <img src="/art/portrait-niko.png" alt="" />
        </div>
        <button className="ghost-button" type="button">Join Session</button>
      </section>

      <section className="panel progress-panel">
        <div className="panel-head">
          <h2>Your Progress</h2>
        </div>
        <div className="radar">
          <span>Decision<br />Making<br /><b>72</b></span>
          <span>Game<br />Sense<br /><b>68</b></span>
          <span>Mechanics<br /><b>81</b></span>
          <span>Positioning<br /><b>78</b></span>
          <div className="radar-shape" />
        </div>
        <button className="ghost-button" type="button">View full report ↗</button>
      </section>
    </div>
  );
}

function OverlayPreview(): React.JSX.Element {
  return (
    <section className="panel overlay-preview" id="live-overlay">
      <div className="panel-head">
        <h2>Live Overlay Preview</h2>
        <span>⚙ ×</span>
      </div>
      <div className="game-window">
        <img className="overlay-source" src="/art/component-live-overlay.png" alt="" />
        <div className="score-strip" aria-label="Live scoreboard">
          <span>2</span>
          <strong>1:12</strong>
          <span>1</span>
        </div>
        <div className="coach-callout callout-left">
          <img src="/art/portrait-ro.png" alt="" />
          <div><strong>Ro</strong><small>The Shotcaller</small><span>Nice entry. Trade should be coming.</span></div>
          <time>2m ago</time>
        </div>
        <div className="coach-callout callout-mid">
          <img src="/art/portrait-maya.png" alt="" />
          <div><strong>Maya</strong><small>The Anchor</small><span>Hold this angle. Do not overpeek.</span></div>
          <time>1m ago</time>
        </div>
        <div className="coach-callout callout-right">
          <img src="/art/portrait-niko.png" alt="" />
          <div><strong>Niko</strong><small>The Analyst</small><span>They are low on util. Good time to hit.</span></div>
          <time>1m ago</time>
        </div>
        <div className="coach-callout callout-june">
          <img src="/art/portrait-june.png" alt="" />
          <div><strong>June</strong><small>The Builder</small><span>Drop smoke here, then plant safe.</span></div>
          <time>Now</time>
        </div>
        <div className="reticle" />
        <div className="overlay-hud">
          <span>100 ◎</span>
          <b>G</b>
          <span>25 / 75</span>
        </div>
      </div>
    </section>
  );
}

function ReplayAndStrategy(): React.JSX.Element {
  return (
    <div className="lower-grid">
      <section className="panel replay-panel" id="replay-review">
        <div className="panel-head">
          <div>
            <h2>Replay Review</h2>
            <p>vs. Night Owls · Map: Haven · May 12, 2025</p>
          </div>
          <span>↻ ›</span>
        </div>
        <div className="replay-body">
          <div className="heatmap">
            <img src="/art/component-replay-review.png" alt="" />
            <span className="heat heat-a" />
            <span className="heat heat-b" />
            <span className="heat heat-c" />
            <div className="video-controls">
              <b>▶</b><b>▮▮</b><span>12:45 / 34:20</span><i />
            </div>
            <div className="event-timeline">
              <i /><i /><i /><i /><i />
            </div>
          </div>
          <div className="moments">
            {['0:45 Early pick mid', '1:32 Rotation to A', '2:18 Post-plant setup', '3:05 Clutch attempt'].map((item) => (
              <span key={item}>{item}</span>
            ))}
            <article className="coach-note">
              <img src="/art/portrait-ro.png" alt="" />
              <div><strong>Ro</strong><p>Great patience here.</p></div>
              <time>2:18</time>
            </article>
          </div>
        </div>
      </section>

      <section className="panel strategy-panel">
        <div className="panel-head">
          <h2>Strategy Board</h2>
          <span>Default Strategy⌄</span>
        </div>
        <div className="strategy-shell">
          <div className="tool-rail" aria-label="Strategy tools">
            {['+', '⌗', '╱', '○', '□', '◎'].map((tool) => <button key={tool} type="button">{tool}</button>)}
          </div>
          <div className="board">
            <img src="/art/component-strategy-board.png" alt="" />
            <span className="node node-a">A</span>
            <span className="node node-b">B</span>
            <span className="node node-c">R</span>
            <span className="route route-a" />
            <span className="route route-b" />
            <span className="route route-c" />
          </div>
          <div className="tool-list">
            <strong>Tools</strong>
            {['Arrow', 'Circle', 'Line', 'Zone', 'Text', 'Clear'].map((tool) => <span key={tool}>▸ {tool}</span>)}
            <strong>Layers</strong>
            <span>☑ Routes</span>
            <span>☑ Notes</span>
          </div>
        </div>
      </section>

      <section className="panel community-panel" id="community">
        <div className="panel-head">
          <h2>Community</h2>
          <span>Feed · LFG · Events</span>
        </div>
        <div className="community-shell">
          <div className="feed-column">
            <label>Share an update with the community...</label>
            <article>
              <img src="/art/portrait-june.png" alt="" />
              <div>
                <strong>ClutchKid</strong>
                <small>Posted a VOD review · 1h ago</small>
                <p>Check out my latest review. Any tips on mid control?</p>
                <span>♡ 12   ↻ 5</span>
              </div>
            </article>
            <article>
              <img src="/art/portrait-maya.png" alt="" />
              <div>
                <strong>StrategyLab</strong>
                <small>Posted a strategy · 3h ago</small>
                <p>New default execute for Bind. Works great post-patch.</p>
                <span>♡ 18   ↻ 7</span>
              </div>
            </article>
          </div>
          <div className="thread-column">
            <strong>Active Thread <em>#general</em></strong>
            {['NovaMind: Great win last night team!', 'PlayerPerfect: That retake on B was clean.', 'Ro: Remember: communicate early, win rounds.', 'You: Thanks for the calls, Ro.'].map((message) => (
              <span key={message}>{message}<small>9m ago</small></span>
            ))}
            <button type="button">Message #general... ▷</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <main className="cockpit">
      <Sidebar />
      <div className="workspace">
        <div className="top-grid">
          <HeroPanel />
          <CoachSquad />
        </div>
        <LiveCards />
        <OverlayPreview />
        <ReplayAndStrategy />
        <footer>
          <span><i /> Overlay Active</span>
          <span>Connected</span>
          <span>No game injection · Not runtime supported until cleared</span>
          <span>Next Advice Sync · 00:07</span>
          <span>v1.2.0</span>
        </footer>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
