import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L22 7.7735V16.2265L12 22L2 16.2265V7.7735L12 2Z" stroke="var(--accent)" strokeWidth="2" />
          <path d="M12 7L17 9.88675V14.1132L12 17L7 14.1132V9.88675L12 7Z" fill="var(--accent)" />
        </svg>
        <h1>GAMEPOINT</h1>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-item active">Home</a>
        <a href="#" className="nav-item">Live Overlay</a>
        <a href="#" className="nav-item">Sessions</a>
        <a href="#" className="nav-item">Replay Review</a>
        <a href="#" className="nav-item">Coach Squad</a>
        <a href="#" className="nav-item">Community</a>
        <a href="#" className="nav-item">Insights</a>
        <a href="#" className="nav-item">Settings</a>
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 0.5rem' }}>
        <div className="flex items-center gap-2" style={{ padding: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--panel-border)' }} />
          <div>
            <div className="text-sm font-bold">PlayerOne</div>
            <div className="text-xs text-muted">Level 24</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="welcome">
        <h2>Welcome back, <strong>PlayerOne</strong></h2>
      </div>
      <div className="header-actions">
        <span className="badge online"><span className="text-accent">Overlay active</span></span>
        <button className="btn-secondary" style={{ padding: '6px 10px' }}>🔔</button>
      </div>
    </header>
  );
}

function HeroWidget() {
  return (
    <div className="panel widget-hero">
      <h1>Coach in <br/><span>your</span> corner.</h1>
      <p style={{ display: 'none' }}>
        The coach in your corner: it watches the fight, it never touches the controls.
      </p>
      <p>Screen-only AI coaching.<br/>Real community. Real progress.</p>
      <div className="flex gap-4 mt-4">
        <button className="btn-primary">Go Live</button>
        <button className="btn-secondary">Schedule a Session</button>
      </div>
    </div>
  );
}

function CoachSquadWidget() {
  const coaches = [
    { name: 'MAYA', role: 'The Anchor' },
    { name: 'RO', role: 'The Shotcaller' },
    { name: 'NIKO', role: 'The Analyst' },
    { name: 'JUNE', role: 'The Builder' },
  ];

  return (
    <div className="panel widget-squad">
      <div className="squad-header">
        <div>
          <h3>Coach Squad</h3>
          <p>Your crew. Your edge.</p>
        </div>
        <a href="#" className="text-sm text-muted">View Coach Squad →</a>
      </div>
      <div className="squad-grid">
        {coaches.map((c) => (
          <div key={c.name} className="coach-card">
            <div className="coach-name">{c.name}</div>
            <div className="coach-role">{c.role}</div>
            <div className="badge online" style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', padding: 0 }}>Online</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardApp() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardHeader />
        
        <HeroWidget />
        <CoachSquadWidget />

        <div className="panel widget-live-match">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-sm">Live Match</h3>
            <span className="badge" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>• LIVE</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '1rem 0' }}>
            <div style={{ width: 48, height: 48, background: 'var(--panel-border)', borderRadius: 8 }} />
            <div className="text-xl font-bold mono">2 - 1</div>
            <div style={{ width: 48, height: 48, background: 'var(--panel-border)', borderRadius: 8 }} />
          </div>
          <div className="flex justify-between text-xs text-muted mb-4">
            <span>Your Team</span>
            <span className="mono">24:18</span>
            <span>Opponents</span>
          </div>
          <button className="btn-secondary" style={{ width: '100%' }}>VIEW OVERLAY</button>
        </div>

        <div className="panel widget-advice-feed">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-sm">Advice Feed</h3>
            <span className="badge text-accent">7 new</span>
          </div>
          <div className="flex flex-col gap-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="text-sm text-muted">
              <strong className="text-accent">RO</strong>
              <div className="text-xs">Good rotate. You drew attention top side.</div>
            </div>
            <div className="text-sm text-muted">
              <strong className="text-accent">MAYA</strong>
              <div className="text-xs">Anchor the next push. Hold the angle.</div>
            </div>
          </div>
          <a href="#" className="text-xs text-muted mt-4">View all advice →</a>
        </div>

        <div className="panel widget-progress">
          <h3 className="font-bold text-sm mb-4">Your Progress</h3>
          {/* Mock Radar Chart */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
            <svg viewBox="0 0 100 100" style={{ width: 120, height: 120 }}>
              <polygon points="50,10 90,35 90,80 50,100 10,80 10,35" fill="none" stroke="var(--panel-border)" strokeWidth="1" />
              <polygon points="50,30 80,45 75,70 50,85 25,70 20,45" fill="var(--accent-dim)" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>
          </div>
          <a href="#" className="text-xs text-accent text-center mt-4" style={{ display: 'block' }}>View full report →</a>
        </div>

        <div className="panel widget-replay">
          <h3 className="font-bold text-sm mb-4">Replay Review</h3>
          <div style={{ background: '#000', flex: 1, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">▶ Video Player Placeholder</span>
          </div>
        </div>

        <div className="panel widget-strategy">
          <h3 className="font-bold text-sm mb-4">Strategy Board</h3>
          <div style={{ background: 'var(--panel-border)', flex: 1, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">Map & Tactics Placeholder</span>
          </div>
        </div>

        <div className="panel widget-community">
          <h3 className="font-bold text-sm mb-4">Community</h3>
          <div className="text-sm text-muted">
            <p className="mb-2"><strong>ACTIVE THREAD: #general</strong></p>
            <p className="mb-2"><span className="text-accent">ClutchKid:</span> Great win last night team!</p>
            <p><span className="text-accent">Ro:</span> Remember, communicate early.</p>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Message #general..." style={{ flex: 1, background: 'var(--panel-border)', border: 'none', borderRadius: 4, padding: '8px', color: 'var(--text)' }} />
          </div>
        </div>

      </main>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DashboardApp />
    </React.StrictMode>
  );
}
