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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          Live Overlay
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Sessions
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Replay Review
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Coach Squad
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Community
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          Insights
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
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
        <span className="badge online"><span className="text-accent tracking-widest uppercase">Overlay active</span></span>
        <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
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
      <p>Screen-only coaching.<br/>Real community. Real progress.</p>
      
      <div className="flex gap-4 mt-4">
        <button className="btn-primary flex items-center justify-center gap-2" style={{ padding: '12px 24px', fontSize: '1rem' }}>
          Go Live
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
        </button>
        <button className="btn-secondary flex items-center justify-center gap-2" style={{ padding: '12px 24px', fontSize: '1rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Schedule Session
        </button>
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
            <div className="badge online uppercase tracking-widest text-xs" style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px' }}>Online</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
        <a href="#" className="text-sm text-muted uppercase tracking-widest transition-colors hover:text-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          View Coach Squad
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}

function FloatingOverlayPreview() {
  return (
    <div className="floating-overlay">
      <div className="flex justify-between items-center mb-4">
        <div className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          LIVE OVERLAY PREVIEW
        </div>
        <div className="flex gap-3 text-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" x2="19" y1="12" y2="12"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </div>
      </div>
      <div className="tactical-grid" style={{ flex: 1, background: '#080a08', borderRadius: 8, position: 'relative' }}>
         <div style={{ position: 'absolute', top: '15%', left: '10%', background: 'rgba(0,0,0,0.8)', padding: '12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', width: '45%', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>
            <div className="text-xs text-accent font-bold mb-1">RO</div>
            <div style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--text-muted)' }}>Nice entry. Trade should be coming.</div>
         </div>
         <div style={{ position: 'absolute', bottom: '20%', right: '10%', background: 'rgba(0,0,0,0.8)', padding: '12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', width: '45%', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}>
            <div className="text-xs text-accent font-bold mb-1">JUNE</div>
            <div style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--text-muted)' }}>Drop smoke here, then plant safe.</div>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm tracking-widest uppercase">Live Match</h3>
            <span className="badge uppercase tracking-widest pulse-glow" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>• LIVE</span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '1rem 0', margin: 'auto 0' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="text-3xl font-bold mono">2 - 1</div>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted mb-4 mt-auto uppercase tracking-widest">
            <span>Your Team</span>
            <span className="mono text-accent">24:18</span>
            <span>Opponents</span>
          </div>
          <button className="btn-secondary uppercase tracking-widest hover:border-accent hover:text-accent transition-colors" style={{ width: '100%', borderColor: 'rgba(212,242,88,0.3)', color: 'var(--accent)' }}>VIEW OVERLAY</button>
        </div>

        <div className="panel widget-advice-feed">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm tracking-widest uppercase">Advice Feed</h3>
            <span className="badge text-accent uppercase tracking-widest" style={{ background: 'rgba(212, 242, 88, 0.1)', borderColor: 'var(--accent)' }}>7 new</span>
          </div>
          <div className="flex flex-col gap-4" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            <div className="text-sm border-b border-white/5 pb-4">
              <strong className="text-accent tracking-widest">RO</strong> <span className="text-xs text-muted float-right">2m ago</span>
              <div className="text-xs text-muted mt-1 leading-relaxed">Good rotate. You drew attention top side.</div>
            </div>
            <div className="text-sm border-b border-white/5 pb-4">
              <strong className="text-accent tracking-widest">MAYA</strong> <span className="text-xs text-muted float-right">3m ago</span>
              <div className="text-xs text-muted mt-1 leading-relaxed">Anchor the next push. Hold the angle.</div>
            </div>
            <div className="text-sm border-b border-white/5 pb-4">
              <strong className="text-accent tracking-widest">NIKO</strong> <span className="text-xs text-muted float-right">4m ago</span>
              <div className="text-xs text-muted mt-1 leading-relaxed">Watch their eco. Big buy round coming.</div>
            </div>
            <div className="text-sm">
              <strong className="text-accent tracking-widest">JUNE</strong> <span className="text-xs text-muted float-right">5m ago</span>
              <div className="text-xs text-muted mt-1 leading-relaxed">Try a fast deploy on A. They're stacked B.</div>
            </div>
          </div>
          <a href="#" className="text-xs text-muted mt-4 tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
            View all advice <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div className="panel widget-session">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm tracking-widest uppercase">Session Upcoming</h3>
            <span className="text-xs text-muted uppercase tracking-widest cursor-pointer hover:text-accent transition-colors">Edit</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 8, border: '1px solid var(--panel-border)', marginBottom: '1.5rem', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="font-bold text-sm">Strategy Session</div>
            <div className="text-xs text-muted mb-3">with Niko</div>
            <div className="text-xs font-bold text-accent mb-4 tracking-widest uppercase">Tomorrow • 7:00 PM</div>
            <button className="btn-secondary uppercase tracking-widest" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>Join Session</button>
          </div>
          <div className="text-xs font-bold mb-3 text-muted tracking-widest uppercase">Recent Sessions</div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> VOD Review</span>
              <span className="text-muted">May 12</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> Macro Fundamentals</span>
              <span className="text-muted">May 10</span>
            </div>
          </div>
          <a href="#" className="text-xs text-muted mt-auto tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors">
            View all sessions <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div className="panel widget-progress">
          <h3 className="font-bold text-sm mb-4 tracking-widest uppercase">Your Progress</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', position: 'relative', flex: 1 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', maxWidth: 160, maxHeight: 160 }}>
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="rgba(212, 242, 88, 0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2" />
              <polygon points="50,30 70,45 70,60 50,70 30,60 30,45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2" />
              <polygon points="50,25 70,45 65,70 50,80 25,60 30,35" fill="rgba(212, 242, 88, 0.15)" stroke="var(--accent)" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="90" y1="30" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="90" y1="70" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="50" y1="90" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="10" y1="70" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="10" y1="30" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </svg>
            <span style={{position:'absolute', top: '0', fontSize: '0.65rem', textAlign: 'center'}}>Decision<br/>Making<br/><strong className="text-accent text-sm">72</strong></span>
            <span style={{position:'absolute', right: '0', top: '40%', fontSize: '0.65rem', textAlign: 'center'}}>Game<br/>Sense<br/><strong className="text-accent text-sm">68</strong></span>
            <span style={{position:'absolute', bottom: '0', right: '15%', fontSize: '0.65rem', textAlign: 'center'}}>Mechanics<br/><strong className="text-accent text-sm">81</strong></span>
            <span style={{position:'absolute', bottom: '0', left: '15%', fontSize: '0.65rem', textAlign: 'center'}}>Positioning<br/><strong className="text-accent text-sm">78</strong></span>
            <span style={{position:'absolute', left: '0', top: '40%', fontSize: '0.65rem', textAlign: 'center'}}>Clutch<br/>Factor<br/><strong className="text-accent text-sm">89</strong></span>
          </div>
          <a href="#" className="text-xs text-accent text-center mt-auto tracking-widest uppercase flex items-center justify-center gap-2 hover:text-white transition-colors">
            View full report <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div className="panel widget-replay" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="badge text-accent tracking-widest uppercase" style={{ background: 'rgba(212,242,88,0.1)', borderColor: 'var(--accent)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                REPLAY REVIEW
              </span>
              <span className="font-bold text-sm tracking-widest uppercase">vs. Night Owls</span>
            </div>
            <div className="text-xs text-muted tracking-widest uppercase">May 12, 2023</div>
          </div>
          <div className="tactical-grid" style={{ background: '#080a08', flex: 1, borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              {/* High-Fidelity Mock Heatmap */}
              <div style={{ position: 'absolute', top: '25%', left: '35%', width: 60, height: 60, background: 'var(--danger)', borderRadius: '50%', filter: 'blur(24px)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: '35%', left: '25%', width: 80, height: 80, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(32px)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', top: '30%', left: '30%', border: '1px solid var(--accent)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(212,242,88,0.5)' }}>
                <div style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%' }} />
              </div>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
              <button className="text-accent hover:scale-110 transition-transform">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <span className="text-xs text-muted mono tracking-widest">12:45 / 34:20</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent)', borderRadius: 2, boxShadow: '0 0 8px var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel widget-strategy" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-accent tracking-widest uppercase">STRATEGY BOARD</h3>
            <span className="text-xs text-muted px-2 py-1 rounded border tracking-widest uppercase cursor-pointer hover:border-white/20 transition-colors" style={{ borderColor: 'var(--panel-border)', background: 'rgba(255,255,255,0.02)' }}>
              Default Strategy ▼
            </span>
          </div>
          <div style={{ background: '#080a08', flex: 1, borderRadius: 8, display: 'flex', border: '1px solid var(--panel-border)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
             <div style={{ width: 48, borderRight: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '16px', background: 'rgba(0,0,0,0.3)' }}>
                <button className="text-muted hover:text-accent transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                <button className="text-accent transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                <button className="text-muted hover:text-accent transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></button>
             </div>
             <div className="tactical-grid" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* High-Fidelity Tactical Map Elements */}
                <div style={{ position: 'absolute', top: '25%', left: '30%', width: 28, height: 28, background: 'rgba(212, 242, 88, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 0 12px rgba(212,242,88,0.2)' }}>A</div>
                <div style={{ position: 'absolute', top: '65%', left: '55%', width: 28, height: 28, background: 'rgba(212, 242, 88, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 0 12px rgba(212,242,88,0.2)' }}>B</div>
                <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                  <path d="M 35% 30% Q 60% 15% 85% 35%" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  <polygon points="85%,35% 80%,32% 82%,38%" fill="var(--accent)" />
                  <path d="M 30% 70% Q 40% 45% 55% 65%" stroke="var(--accent)" strokeWidth="2" fill="none" />
                  <polygon points="55%,65% 50%,62% 52%,68%" fill="var(--accent)" />
                </svg>
             </div>
          </div>
        </div>

        <div className="panel widget-community" style={{ gridColumn: 'span 4' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm tracking-widest uppercase">COMMUNITY</h3>
            <div className="flex gap-4 text-xs tracking-widest uppercase font-bold">
               <span className="text-accent border-b-2 border-accent pb-1 cursor-pointer">Feed</span>
               <span className="text-muted pb-1 cursor-pointer hover:text-white transition-colors">LFG</span>
               <span className="text-muted pb-1 cursor-pointer hover:text-white transition-colors">Events</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}>
              <div className="flex gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div className="text-sm font-bold tracking-widest">CLUTCHKID <span className="text-muted font-normal text-xs ml-2">1h ago</span></div>
                  <div className="text-sm text-muted mt-1 leading-relaxed">Check out my latest review. Any tips on mid control?</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}>
              <div className="flex gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)' }} />
                <div>
                  <div className="text-sm font-bold tracking-widest text-accent">STRATEGYLAB <span className="text-muted font-normal text-xs ml-2">2h ago</span></div>
                  <div className="text-sm text-muted mt-1 leading-relaxed">New default execute for Bind. Works great post-patch.</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" placeholder="Share an update with the community..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 8, padding: '12px 40px 12px 16px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }} />
              <button style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
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
