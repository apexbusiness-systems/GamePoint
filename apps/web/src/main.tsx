import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand" style={{ marginBottom: '1rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L22 7.7735V16.2265L12 22L2 16.2265V7.7735L12 2Z" stroke="var(--accent)" strokeWidth="2" />
          <path d="M12 7L17 9.88675V14.1132L12 17L7 14.1132V9.88675L12 7Z" fill="var(--accent)" />
        </svg>
        <h1>GAMEPOINT</h1>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-item active">
          <span style={{opacity: 0.5}}>⌂</span> Home
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>📺</span> Live Overlay
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>🗓</span> Sessions
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>▶</span> Replay Review
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>👥</span> Coach Squad
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>💬</span> Community
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>📈</span> Insights
        </a>
        <a href="#" className="nav-item">
          <span style={{opacity: 0.5}}>⚙</span> Settings
        </a>
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 0.5rem' }}>
        <div className="flex items-center gap-2" style={{ padding: '10px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
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
        <button className="btn-secondary" style={{ padding: '6px 10px', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>🔔</button>
      </div>
    </header>
  );
}

function HeroWidget() {
  return (
    <div className="panel widget-hero">
      <h1 style={{ fontSize: '3.5rem' }}>Coach in <br/><span style={{ borderBottom: '4px solid var(--accent)'}}>your</span> corner.</h1>
      <p style={{ display: 'none' }}>
        The coach in your corner: it watches the fight, it never touches the controls.
      </p>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Screen-only coaching.<br/>Real community. Real progress.</p>
      
      {/* Floating name tags on the background */}
      <div style={{ position: 'absolute', top: '70%', left: '35%', fontSize: '0.65rem', fontWeight: 'bold' }}>
        <span className="text-accent">MAYA</span><br/><span className="text-muted">The Anchor</span>
      </div>
      <div style={{ position: 'absolute', top: '75%', left: '50%', fontSize: '0.65rem', fontWeight: 'bold' }}>
        <span className="text-accent">RO</span><br/><span className="text-muted">The Shotcaller</span>
      </div>
      <div style={{ position: 'absolute', top: '72%', left: '70%', fontSize: '0.65rem', fontWeight: 'bold' }}>
        <span className="text-accent">NIKO</span><br/><span className="text-muted">The Analyst</span>
      </div>
      <div style={{ position: 'absolute', top: '70%', left: '85%', fontSize: '0.65rem', fontWeight: 'bold' }}>
        <span className="text-accent">JUNE</span><br/><span className="text-muted">The Builder</span>
      </div>

      <div className="flex gap-4">
        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>Go Live ((\u2022))</button>
        <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>🗓 Schedule a Session</button>
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
      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <a href="#" className="text-sm text-muted">View Coach Squad →</a>
      </div>
    </div>
  );
}

function FloatingOverlayPreview() {
  return (
    <div className="panel" style={{
      position: 'absolute',
      right: '2rem',
      top: '18rem',
      width: '450px',
      height: '320px',
      zIndex: 100,
      background: 'rgba(12, 14, 11, 0.95)',
      border: '1px solid var(--accent)',
      boxShadow: '0 24px 48px rgba(0,0,0,0.8)'
    }}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-accent font-bold text-xs">LIVE OVERLAY PREVIEW</div>
        <div className="flex gap-2">
          <span className="text-muted">_</span>
          <span className="text-muted">□</span>
          <span className="text-muted">x</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#000', borderRadius: 8, position: 'relative', backgroundImage: 'radial-gradient(rgba(212, 242, 88, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         <div style={{ position: 'absolute', top: '10%', left: '5%', background: 'rgba(0,0,0,0.8)', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', width: '40%' }}>
            <div className="text-xs text-accent">RO</div>
            <div className="text-xs" style={{ fontSize: '0.65rem' }}>Nice entry. Trade should be coming.</div>
         </div>
         <div style={{ position: 'absolute', bottom: '15%', right: '5%', background: 'rgba(0,0,0,0.8)', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', width: '40%' }}>
            <div className="text-xs text-accent">JUNE</div>
            <div className="text-xs" style={{ fontSize: '0.65rem' }}>Drop smoke here, then plant safe.</div>
         </div>
      </div>
    </div>
  );
}

function DashboardApp() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="dashboard-main" style={{ position: 'relative' }}>
        <DashboardHeader />
        
        <HeroWidget />
        <CoachSquadWidget />

        <div className="panel widget-live-match">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-sm">Live Match</h3>
            <span className="badge" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>• LIVE</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '1rem 0', margin: 'auto 0' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid var(--panel-border)' }} />
            <div className="text-2xl font-bold mono">2 - 1</div>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid var(--panel-border)' }} />
          </div>
          <div className="flex justify-between text-xs text-muted mb-4 mt-auto">
            <span>Your Team</span>
            <span className="mono text-accent">24:18</span>
            <span>Opponents</span>
          </div>
          <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}>VIEW OVERLAY</button>
        </div>

        <div className="panel widget-advice-feed">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-sm">Advice Feed</h3>
            <span className="badge text-accent" style={{ background: 'rgba(212, 242, 88, 0.1)', borderColor: 'var(--accent)' }}>7 new</span>
          </div>
          <div className="flex flex-col gap-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="text-sm">
              <strong className="text-accent">RO</strong> <span className="text-xs text-muted float-right">2m ago</span>
              <div className="text-xs text-muted mt-1">Good rotate. You drew attention top side.</div>
            </div>
            <div className="text-sm">
              <strong className="text-accent">MAYA</strong> <span className="text-xs text-muted float-right">3m ago</span>
              <div className="text-xs text-muted mt-1">Anchor the next push. Hold the angle.</div>
            </div>
            <div className="text-sm">
              <strong className="text-accent">NIKO</strong> <span className="text-xs text-muted float-right">4m ago</span>
              <div className="text-xs text-muted mt-1">Watch their eco. Big buy round coming.</div>
            </div>
            <div className="text-sm">
              <strong className="text-accent">JUNE</strong> <span className="text-xs text-muted float-right">5m ago</span>
              <div className="text-xs text-muted mt-1">Try a fast deploy on A. They're stacked B.</div>
            </div>
          </div>
          <a href="#" className="text-xs text-muted mt-4">View all advice →</a>
        </div>

        <div className="panel widget-session">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-sm">Session Upcoming</h3>
            <span className="text-xs text-muted">Edit</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 8, border: '1px solid var(--panel-border)', marginBottom: '1rem' }}>
            <div className="font-bold text-sm">Strategy Session</div>
            <div className="text-xs text-muted mb-2">with Niko</div>
            <div className="text-xs font-bold text-accent mb-3">Tomorrow • 7:00 PM</div>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}>Join Session</button>
          </div>
          <div className="text-xs font-bold mb-2 text-muted">Recent Sessions</div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span>▶ VOD Review</span>
              <span className="text-muted">May 12</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>▶ Macro Fundamentals</span>
              <span className="text-muted">May 10</span>
            </div>
          </div>
          <a href="#" className="text-xs text-muted mt-auto">View all sessions →</a>
        </div>

        <div className="panel widget-progress">
          <h3 className="font-bold text-sm mb-4">Your Progress</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ width: 140, height: 140 }}>
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="rgba(212, 242, 88, 0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <polygon points="50,25 70,45 65,70 50,80 25,60 30,35" fill="rgba(212, 242, 88, 0.2)" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>
            <span style={{position:'absolute', top: 5, fontSize: '0.6rem'}}>Decision<br/>Making<br/><strong className="text-accent">72</strong></span>
            <span style={{position:'absolute', right: 5, top: 50, fontSize: '0.6rem'}}>Game<br/>Sense<br/><strong className="text-accent">68</strong></span>
            <span style={{position:'absolute', bottom: 5, right: 25, fontSize: '0.6rem'}}>Mechanics<br/><strong className="text-accent">81</strong></span>
            <span style={{position:'absolute', bottom: 5, left: 25, fontSize: '0.6rem'}}>Positioning<br/><strong className="text-accent">78</strong></span>
            <span style={{position:'absolute', left: 5, top: 50, fontSize: '0.6rem'}}>Clutch<br/>Factor<br/><strong className="text-accent">89</strong></span>
          </div>
          <a href="#" className="text-xs text-accent text-center mt-auto" style={{ display: 'block' }}>View full report →</a>
        </div>

        <div className="panel widget-replay" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="badge text-accent" style={{ background: 'rgba(212,242,88,0.1)', borderColor: 'var(--accent)' }}>REPLAY REVIEW</span>
              <span className="font-bold text-sm">vs. Night Owls</span>
            </div>
            <div className="text-xs text-muted">May 12, 2023</div>
          </div>
          <div style={{ background: '#000', flex: 1, borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, backgroundImage: 'radial-gradient(rgba(212, 242, 88, 0.2) 1px, transparent 1px)', backgroundSize: '15px 15px', position: 'relative' }}>
              {/* Mock Heatmap */}
              <div style={{ position: 'absolute', top: '30%', left: '40%', width: 40, height: 40, background: 'var(--danger)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', top: '40%', left: '30%', width: 50, height: 50, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }} />
            </div>
            <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="text-accent">▶</span> <span className="text-xs text-muted mono">12:45 / 34:20</span>
              <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.2)' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel widget-strategy" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-accent">STRATEGY BOARD</h3>
            <span className="text-xs text-muted bg-dark px-2 rounded border" style={{ borderColor: 'var(--panel-border)', padding: '2px 8px' }}>Default Strategy ▼</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.5)', flex: 1, borderRadius: 8, display: 'flex', border: '1px solid var(--panel-border)' }}>
             <div style={{ width: 40, borderRight: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: '12px' }}>
                <span className="text-muted">✎</span>
                <span className="text-muted">⤡</span>
                <span className="text-muted">▤</span>
             </div>
             <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Mock Tactical Map */}
                <div style={{ position: 'absolute', top: '20%', left: '30%', width: 24, height: 24, background: 'rgba(212, 242, 88, 0.2)', border: '2px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>A</div>
                <div style={{ position: 'absolute', top: '60%', left: '50%', width: 24, height: 24, background: 'rgba(212, 242, 88, 0.2)', border: '2px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>B</div>
                <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                  <path d="M 40% 25% Q 60% 10% 80% 30%" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="4" />
                  <path d="M 30% 65% Q 40% 40% 50% 60%" stroke="var(--accent)" strokeWidth="2" fill="none" />
                </svg>
             </div>
          </div>
        </div>

        <div className="panel widget-community" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">COMMUNITY</h3>
            <div className="flex gap-4 text-xs">
               <span className="text-accent border-b border-accent pb-1">Feed</span>
               <span className="text-muted pb-1">LFG</span>
               <span className="text-muted pb-1">Events</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
              <div className="flex gap-2">
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div className="text-xs font-bold">ClutchKid <span className="text-muted font-normal">• 1h ago</span></div>
                  <div className="text-xs text-muted mt-1">Check out my latest review. Any tips on mid control?</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
              <div className="flex gap-2">
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)' }} />
                <div>
                  <div className="text-xs font-bold">StrategyLab <span className="text-muted font-normal">• 2h ago</span></div>
                  <div className="text-xs text-muted mt-1">New default execute for Bind. Works great post-patch.</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Share an update with the community..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: 4, padding: '10px', color: 'var(--text)', fontSize: '0.8rem' }} />
          </div>
        </div>
        
        <FloatingOverlayPreview />

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

