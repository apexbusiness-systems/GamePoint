import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// --- Shared SVGs & Icons ---
const IconChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>;
const IconPlay = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const HexagonG = ({ color = "var(--text)" }) => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
    <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" stroke={color} strokeWidth="4" fill="rgba(255,255,255,0.02)"/>
    <text x="50" y="58" fontSize="32" fill={color} fontFamily="Bebas Neue" textAnchor="middle">G</text>
  </svg>
);
const HexagonC = ({ color = "var(--text)" }) => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
    <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" stroke={color} strokeWidth="4" fill="rgba(255,255,255,0.02)"/>
    <text x="50" y="58" fontSize="32" fill={color} fontFamily="Bebas Neue" textAnchor="middle">C</text>
  </svg>
);

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
        <a href="#" className="nav-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          Live Overlay
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Sessions
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Replay Review
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Coach Squad
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Community
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          Insights
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </a>
      </nav>
      <div className="mt-auto">
        <div className="flex items-center justify-between" style={{ padding: '8px', cursor: 'pointer' }}>
          <div className="flex items-center gap-3">
            <div className="avatar" />
            <div>
              <div className="text-sm font-bold">PlayerOne</div>
              <div className="text-xs text-muted">Level 24</div>
            </div>
          </div>
          <IconChevronDown />
        </div>
      </div>
    </aside>
  );
}

function GlobalFooter() {
  return (
    <footer className="global-footer">
      <div className="footer-left">
        <div className="flex items-center gap-2"><div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)'}}/> Overlay Active</div>
        <div className="flex items-center gap-2"><div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)'}}/> Connected</div>
      </div>
      <div className="footer-right">
        <span>Next Advice Sync  <span className="mono">00:07</span></span>
        <span>v1.2.0</span>
        <div className="flex gap-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>
    </footer>
  );
}

function HeroWidget() {
  return (
    <div className="panel widget-hero">
      <div className="hero-content">
        <h1>Coach in <br/><span className="hero-underline">your</span> corner.</h1>
        <p style={{ display: 'none' }}>The coach in your corner: it watches the fight, it never touches the controls.</p>
        <p>Screen-only coaching.<br/>Real community. Real progress.</p>
        <div className="flex gap-4">
          <button className="btn-primary"><IconPlay/> Go Live</button>
          <button className="btn-secondary"><IconCalendar/> Schedule a Session</button>
        </div>
      </div>
      
      {/* Absolute floating tags directly over the background characters */}
      <div className="floating-tag" style={{ top: '65%', left: '35%' }}>
        <div className="tag-name"><div style={{width:4, height:4, background:'var(--accent)', borderRadius:'50%'}}/>MAYA</div>
        <div className="tag-role">The Anchor</div>
      </div>
      <div className="floating-tag" style={{ top: '60%', left: '48%' }}>
        <div className="tag-name"><div style={{width:4, height:4, background:'var(--accent)', borderRadius:'50%'}}/>RO</div>
        <div className="tag-role">The Shotcaller</div>
      </div>
      <div className="floating-tag" style={{ top: '70%', left: '60%' }}>
        <div className="tag-name"><div style={{width:4, height:4, background:'var(--accent)', borderRadius:'50%'}}/>NIKO</div>
        <div className="tag-role">The Analyst</div>
      </div>
      <div className="floating-tag" style={{ top: '75%', left: '75%' }}>
        <div className="tag-name"><div style={{width:4, height:4, background:'var(--accent)', borderRadius:'50%'}}/>JUNE</div>
        <div className="tag-role">The Builder</div>
      </div>
    </div>
  );
}

function SquadWidget() {
  const coaches = [
    { name: 'MAYA', role: 'The Anchor', online: true },
    { name: 'RO', role: 'The Shotcaller', online: true },
    { name: 'NIKO', role: 'The Analyst', online: true },
    { name: 'JUNE', role: 'The Builder', online: true },
  ];
  return (
    <div className="panel widget-squad">
      <div className="panel-header">
        <div>
          <div className="panel-title" style={{textTransform:'none', letterSpacing:'normal', fontSize:'1rem'}}>Coach Squad</div>
          <div className="text-xs text-muted">Your crew. Your edge.</div>
        </div>
      </div>
      <div className="squad-grid">
        {coaches.map(c => (
          <div key={c.name} className="coach-card">
            <div className="coach-name">{c.name}</div>
            <div className="coach-role">{c.role}</div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <div style={{width:6, height:6, borderRadius:'50%', background:'var(--accent)'}}/> Online
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <a href="#" className="text-xs text-muted tracking-widest uppercase flex items-center gap-2">
          View Coach Squad <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}

function LiveMatchWidget() {
  return (
    <div className="panel widget-live-match">
      <div className="panel-header">
        <div className="panel-title">Live Match</div>
        <span className="badge online" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)' }}>LIVE</span>
      </div>
      <div className="flex justify-between items-center" style={{ padding: '1.5rem 0' }}>
        <div className="hex-logo"><HexagonG color="var(--accent)" /></div>
        <div className="text-4xl font-bold mono">2 - 1</div>
        <div className="hex-logo"><HexagonC color="var(--text-muted)" /></div>
      </div>
      <div className="flex justify-between text-xs text-muted uppercase tracking-widest mb-4">
        <span>Your Team</span>
        <span className="mono text-accent">24:18</span>
        <span>Opponents</span>
      </div>
      <button className="btn-secondary uppercase tracking-widest text-xs justify-center" style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)' }}>VIEW OVERLAY <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
    </div>
  );
}

function AdviceFeedWidget() {
  const advices = [
    { coach: 'RO', role: 'The Shotcaller', time: '2m ago', text: 'Good rotate. You drew attention top side.', avatar: 'avatar-ro', color: '#f59e0b' },
    { coach: 'MAYA', role: 'The Anchor', time: '3m ago', text: 'Anchor the next push. Hold the angle.', avatar: 'avatar-maya', color: 'var(--accent)' },
    { coach: 'NIKO', role: 'The Analyst', time: '4m ago', text: 'Watch their econ. Big buy round coming.', avatar: 'avatar-niko', color: '#3b82f6' },
    { coach: 'JUNE', role: 'The Builder', time: '5m ago', text: 'Try a fast deploy on A. They\'re stacked B.', avatar: 'avatar-june', color: '#a855f7' },
  ];
  return (
    <div className="panel widget-advice-feed">
      <div className="panel-header">
        <div className="panel-title">Advice Feed</div>
        <span className="badge" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.1)' }}>7 new</span>
      </div>
      <div className="flex-col gap-4" style={{ flex: 1, overflowY: 'auto' }}>
        {advices.map((a, i) => (
          <div key={i} className="flex gap-3 pb-3 mb-3 border-b border-white/5">
            <div className={`avatar ${a.avatar}`} style={{ width: 28, height: 28, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs"><strong style={{ color: a.color }}>{a.coach}</strong> <span className="text-muted">{a.role}</span></div>
                <div className="text-xs text-muted">{a.time}</div>
              </div>
              <div className="text-xs text-muted leading-relaxed">{a.text}</div>
            </div>
          </div>
        ))}
      </div>
      <a href="#" className="text-xs text-muted tracking-widest uppercase flex items-center gap-2 mt-auto">
        View all advice <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  );
}

function SessionWidget() {
  return (
    <div className="panel widget-session">
      <div className="panel-header">
        <div className="panel-title">Session Upcoming</div>
        <span className="text-xs text-muted cursor-pointer">Edit</span>
      </div>
      <div className="session-card">
        <div className="session-card-bg" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="font-bold text-sm">Strategy Session</div>
          <div className="text-xs text-muted mb-2">with Niko</div>
          <div className="text-xs text-accent tracking-widest uppercase mb-4">Tomorrow - 7:00 PM</div>
          <button className="btn-secondary text-xs uppercase tracking-widest" style={{ padding: '6px 12px' }}>Join Session</button>
        </div>
      </div>
      <div className="text-xs font-bold text-muted uppercase tracking-widest mt-4 mb-3">Recent Sessions</div>
      <div className="flex-col gap-3">
        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
          <div className="flex gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            <div>
              <div className="font-bold">VOD Review</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>vs. Night Owls</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted">May 12</span>
            <span className="text-accent cursor-pointer">Watch</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            <div>
              <div className="font-bold">Macro Fundamentals</div>
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>with Maya</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted">May 10</span>
            <span className="text-accent cursor-pointer">Watch</span>
          </div>
        </div>
      </div>
      <a href="#" className="text-xs text-muted tracking-widest uppercase flex items-center gap-2 mt-auto">
        View all sessions <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  );
}

function ProgressWidget() {
  return (
    <div className="panel widget-progress">
      <div className="panel-title mb-4">Your Progress</div>
      <div className="radar-container">
        {/* Precise Hexagonal Radar Chart */}
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ maxHeight: 180 }}>
          {/* Base Hexagons */}
          <polygon points="50,5 89,27 89,73 50,95 11,73 11,27" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2" />
          {/* Axis Lines */}
          <line x1="50" y1="5" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="89" y1="27" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="89" y1="73" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="50" y1="95" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="11" y1="73" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="11" y1="27" x2="50" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          {/* Data Polygon */}
          <polygon points="50,22 70,35 80,68 50,80 20,70 30,30" fill="var(--accent-dim)" stroke="var(--accent)" strokeWidth="2" />
          {/* Data Points */}
          <circle cx="50" cy="22" r="3" fill="var(--accent)" />
          <circle cx="70" cy="35" r="3" fill="var(--accent)" />
          <circle cx="80" cy="68" r="3" fill="var(--accent)" />
          <circle cx="50" cy="80" r="3" fill="var(--accent)" />
          <circle cx="20" cy="70" r="3" fill="var(--accent)" />
          <circle cx="30" cy="30" r="3" fill="var(--accent)" />
        </svg>
        <div style={{position:'absolute', top:'0', textAlign:'center', width:'100%', fontSize:'0.65rem'}}>Decision Making<br/><strong className="text-accent text-sm">72</strong></div>
        <div style={{position:'absolute', top:'20%', right:'5%', textAlign:'center', fontSize:'0.65rem'}}>Game Sense<br/><strong className="text-accent text-sm">68</strong></div>
        <div style={{position:'absolute', bottom:'15%', right:'5%', textAlign:'center', fontSize:'0.65rem'}}>Mechanics<br/><strong className="text-accent text-sm">81</strong></div>
        <div style={{position:'absolute', bottom:'0', textAlign:'center', width:'100%', fontSize:'0.65rem'}}>Positioning<br/><strong className="text-accent text-sm">76</strong></div>
        <div style={{position:'absolute', bottom:'15%', left:'5%', textAlign:'center', fontSize:'0.65rem'}}>Clutch Factor<br/><strong className="text-accent text-sm">89</strong></div>
      </div>
      <a href="#" className="text-xs text-accent tracking-widest uppercase flex items-center justify-center gap-2 mt-auto">
        View full report <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  );
}

function ReplayWidget() {
  return (
    <div className="panel widget-replay">
      <div className="flex justify-between items-center px-4 pt-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="badge text-accent" style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent)' }}>REPLAY REVIEW</span>
          <span className="font-bold text-sm tracking-widest uppercase">vs. Night Owls</span>
        </div>
        <div className="text-xs text-muted tracking-widest uppercase">Map: Haven - May 12, 2025</div>
      </div>
      <div className="flex" style={{ flex: 1, borderTop: '1px solid var(--panel-border)' }}>
        <div className="flex-col" style={{ flex: 1, background: '#000', position: 'relative' }}>
          {/* Tactical map background placeholder */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: 100, height: 100, background: 'var(--danger)', borderRadius: '50%', filter: 'blur(32px)', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '40%', left: '60%', width: 120, height: 120, background: 'var(--accent)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.4 }} />
          <div className="flex items-center justify-between px-4 py-2 mt-auto" style={{ background: 'rgba(0,0,0,0.8)', borderTop: '1px solid var(--panel-border)' }}>
            <div className="flex gap-3 text-muted">
              <IconPlay />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span className="mono text-xs text-text">12:45 / 34:20</span>
            </div>
            <div style={{ flex: 1, margin: '0 16px', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <div style={{ width: '40%', height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
            </div>
            <div className="flex gap-3 text-muted">
              <span className="text-xs border px-1 rounded border-white/20">1x</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15...z"/></svg>
            </div>
          </div>
        </div>
        <div className="flex-col" style={{ width: 200, borderLeft: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.3)', padding: '1rem' }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3">Key Moments</div>
          <div className="flex-col gap-3 mb-6">
            <div className="flex gap-2 items-start"><span className="text-xs mono text-muted">0:45</span><span className="text-xs">Early pick mid</span></div>
            <div className="flex gap-2 items-start"><span className="text-xs mono text-accent">1:32</span><span className="text-xs font-bold text-accent">Rotation to A</span></div>
            <div className="flex gap-2 items-start"><span className="text-xs mono text-muted">2:18</span><span className="text-xs">Post-plant setup</span></div>
            <div className="flex gap-2 items-start"><span className="text-xs mono text-muted">3:05</span><span className="text-xs">Clutch attempt</span></div>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest mb-3">Coach Notes</div>
          <div className="flex gap-2">
            <div className="avatar avatar-ro" style={{width: 24, height: 24, flexShrink: 0}} />
            <div className="text-xs text-muted"><strong className="text-text">RO</strong><br/>Great patience here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategyWidget() {
  return (
    <div className="panel widget-strategy">
      <div className="flex justify-between items-center px-4 py-3 border-b border-panel-border">
        <div className="panel-title text-accent">STRATEGY BOARD</div>
        <div className="flex items-center gap-2 text-xs border border-panel-border px-2 py-1 rounded bg-black/20 cursor-pointer">Default Strategy <IconChevronDown/></div>
      </div>
      <div className="flex" style={{ flex: 1 }}>
        <div className="flex-col" style={{ flex: 1, background: '#080a08', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
            <path d="M 30% 30% Q 50% 15% 75% 35%" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            <polygon points="75%,35% 70%,32% 72%,38%" fill="var(--accent)" />
            <path d="M 25% 70% Q 40% 45% 65% 65%" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <polygon points="65%,65% 60%,62% 62%,68%" fill="#f59e0b" />
          </svg>
          <div style={{ position: 'absolute', top: '25%', left: '25%', width: 32, height: 32, border: '2px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          <div style={{ position: 'absolute', top: '60%', left: '60%', width: 32, height: 32, border: '2px solid #f59e0b', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
        </div>
        <div className="flex-col" style={{ width: 100, borderLeft: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.3)', padding: '1rem', gap: '1.5rem' }}>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3 text-center">Tools</div>
            <div className="flex-col gap-3 text-xs text-muted items-center">
              <div className="flex gap-2 items-center text-accent"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Arrow</div>
              <div className="flex gap-2 items-center hover:text-white cursor-pointer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> Circle</div>
              <div className="flex gap-2 items-center hover:text-white cursor-pointer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg> Line</div>
              <div className="flex gap-2 items-center hover:text-white cursor-pointer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/></svg> Zone</div>
              <div className="flex gap-2 items-center hover:text-white cursor-pointer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> Text</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3 text-center">Layers</div>
            <div className="flex-col gap-2 text-xs text-muted items-center">
              <div className="flex gap-2 items-center text-text"><input type="checkbox" checked readOnly/> Routes</div>
              <div className="flex gap-2 items-center text-text"><input type="checkbox" checked readOnly/> Notes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityWidget() {
  return (
    <div className="panel widget-community">
      <div className="panel-header px-4 pt-4 mb-2">
        <div className="panel-title">COMMUNITY</div>
        <div className="flex gap-4 text-xs tracking-widest uppercase font-bold">
          <span className="text-accent border-b-2 border-accent pb-1">Feed</span>
          <span className="text-muted pb-1 cursor-pointer hover:text-white">LFG</span>
          <span className="text-muted pb-1 cursor-pointer hover:text-white">Events</span>
        </div>
      </div>
      <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="flex-col px-4 pb-4" style={{ flex: 1, borderRight: '1px solid var(--panel-border)' }}>
          <input type="text" placeholder="Share an update with the community..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '0.85rem', outline: 'none', marginBottom: '1rem' }} />
          <div className="flex-col gap-3" style={{ overflowY: 'auto', paddingRight: 4 }}>
            <div className="flex gap-3 border-b border-white/5 pb-3">
              <div className="avatar" style={{width: 32, height: 32, flexShrink: 0}} />
              <div>
                <div className="text-sm font-bold">ClutchKid <span className="text-muted font-normal text-xs ml-2">1h ago</span></div>
                <div className="text-xs text-muted mt-1">Check out my latest review. Any tips on mid control?</div>
                <div className="flex gap-4 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> 12</span>
                  <span className="flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 5</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pb-3">
              <div className="avatar avatar-maya" style={{width: 32, height: 32, flexShrink: 0}} />
              <div>
                <div className="text-sm font-bold text-accent">StrategyLab <span className="text-muted font-normal text-xs ml-2">2h ago</span></div>
                <div className="text-xs text-muted mt-1">New default execute for Bind. Works great post-patch.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col px-4 pb-4" style={{ width: 220 }}>
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Active Thread</div>
          <div className="text-sm font-bold mb-3">#general</div>
          <div className="flex-col gap-3 flex-1" style={{ overflowY: 'auto' }}>
            <div className="flex gap-2">
              <div className="avatar" style={{width: 24, height: 24, flexShrink: 0}} />
              <div className="text-xs text-muted"><strong className="text-text">NovaWind</strong> 10m<br/>Great win last night team! 🔥</div>
            </div>
            <div className="flex gap-2">
              <div className="avatar avatar-ro" style={{width: 24, height: 24, flexShrink: 0}} />
              <div className="text-xs text-muted"><strong className="text-accent">RO</strong> 9m<br/>Remember: communicate early with round calls.</div>
            </div>
            <div className="flex gap-2">
              <div className="avatar" style={{width: 24, height: 24, flexShrink: 0}} />
              <div className="text-xs text-muted"><strong className="text-text">You</strong> 7m<br/>Thanks for the calls, Ro.</div>
            </div>
          </div>
          <input type="text" placeholder="Message #general..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: 4, padding: '6px 10px', color: 'var(--text)', fontSize: '0.75rem', outline: 'none', marginTop: '10px' }} />
        </div>
      </div>
    </div>
  );
}

function LiveOverlayModal() {
  return (
    <div className="live-overlay-modal">
      <div className="live-overlay-header">
        <div className="text-accent font-bold text-xs uppercase tracking-widest">LIVE OVERLAY PREVIEW</div>
        <div className="flex gap-3 text-muted">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" x2="19" y1="12" y2="12"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="5" y="5" rx="2" ry="2"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </div>
      </div>
      <div className="live-overlay-content">
        {/* Game HUD Placeholders */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4 }}><HexagonG color="var(--accent)" /><span className="font-bold text-sm">GAMEPOINT</span></div>
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex gap-4 text-xs font-bold mono items-center">
            <span>2</span> <span className="text-xl">1:12</span> <span>1</span>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
           <HexagonG color="var(--accent)" />
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: '20%', fontSize: '1.5rem', fontWeight: 'bold' }}>🛡️ 100</div>
        <div style={{ position: 'absolute', bottom: 10, right: '20%', fontSize: '1.5rem', fontWeight: 'bold' }}>🔫 25</div>

        {/* Floating Coach Cards */}
        <div className="overlay-coach-card" style={{ top: '15%', left: '5%' }}>
          <div className="flex gap-2 items-center border-b border-white/10 pb-2 mb-2">
            <div className="avatar avatar-ro" style={{width: 24, height: 24}}/>
            <div>
              <div className="text-xs font-bold text-accent">RO</div>
              <div className="text-xs text-muted" style={{fontSize: '0.6rem'}}>The Shotcaller</div>
            </div>
            <div className="text-xs text-muted ml-auto" style={{fontSize: '0.6rem'}}>2m ago</div>
          </div>
          <div className="text-xs text-muted leading-relaxed">Nice entry. Trade should be coming.</div>
        </div>

        <div className="overlay-coach-card" style={{ top: '45%', left: '5%' }}>
          <div className="flex gap-2 items-center border-b border-white/10 pb-2 mb-2">
            <div className="avatar avatar-maya" style={{width: 24, height: 24}}/>
            <div>
              <div className="text-xs font-bold" style={{color: '#f59e0b'}}>MAYA</div>
              <div className="text-xs text-muted" style={{fontSize: '0.6rem'}}>The Anchor</div>
            </div>
            <div className="text-xs text-muted ml-auto" style={{fontSize: '0.6rem'}}>1m ago</div>
          </div>
          <div className="text-xs text-muted leading-relaxed">Hold this angle. Don't overpeek.</div>
        </div>

        <div className="overlay-coach-card" style={{ top: '25%', right: '5%' }}>
          <div className="flex gap-2 items-center border-b border-white/10 pb-2 mb-2">
            <div className="avatar avatar-niko" style={{width: 24, height: 24}}/>
            <div>
              <div className="text-xs font-bold text-text">NIKO</div>
              <div className="text-xs text-muted" style={{fontSize: '0.6rem'}}>The Analyst</div>
            </div>
            <div className="text-xs text-muted ml-auto" style={{fontSize: '0.6rem'}}>Just now</div>
          </div>
          <div className="text-xs text-muted leading-relaxed">They're low on util. Good time to hit.</div>
        </div>

        <div className="overlay-coach-card" style={{ top: '55%', right: '5%' }}>
          <div className="flex gap-2 items-center border-b border-white/10 pb-2 mb-2">
            <div className="avatar avatar-june" style={{width: 24, height: 24}}/>
            <div>
              <div className="text-xs font-bold text-danger">JUNE</div>
              <div className="text-xs text-muted" style={{fontSize: '0.6rem'}}>The Builder</div>
            </div>
            <div className="text-xs text-muted ml-auto" style={{fontSize: '0.6rem'}}>1m ago</div>
          </div>
          <div className="text-xs text-muted leading-relaxed">Drop smoke here, then plant safe.</div>
        </div>
      </div>
    </div>
  );
}

function DashboardApp() {
  return (
    <div className="app-container">
      <div className="main-content-row">
        <Sidebar />
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="welcome">
              <h2>Welcome back, <strong>PlayerOne</strong></h2>
            </div>
            <div className="header-actions">
              <span className="badge online"><span className="text-accent">Overlay active</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/></svg></span>
              <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%', width: 32, height: 32, justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><circle cx="19" cy="5" r="3" fill="#f59e0b" stroke="#000"/></svg>
              </button>
            </div>
          </header>
          
          <div className="dashboard-grid">
            <HeroWidget />
            <SquadWidget />

            <LiveMatchWidget />
            <AdviceFeedWidget />
            <SessionWidget />
            <ProgressWidget />

            <ReplayWidget />
            <StrategyWidget />
            <CommunityWidget />
          </div>

          <LiveOverlayModal />
        </main>
      </div>
      <GlobalFooter />
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
