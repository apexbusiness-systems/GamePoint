import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/* ── Data ─────────────────────────────────────────────────────────── */

type TitleState = 'supported' | 'paused' | 'registry';
type TitleCard = { name: string; state: TitleState; note: string };

const titles: TitleCard[] = [
  { name: 'Path of Exile 2', state: 'supported', note: 'Official API sources. Anti-cheat class recorded as server-side (inference).' },
  { name: "Baldur's Gate 3", state: 'supported', note: 'Cleared. CC-BY-SA wiki and official patch notes.' },
  { name: 'Elden Ring / Nightreign', state: 'supported', note: 'Cleared. Low-risk tier; EAC is disableable offline.' },
  { name: 'Monster Hunter Wilds', state: 'supported', note: 'Official update notes. Publisher stance under continued review.' },
  { name: 'Warframe', state: 'supported', note: 'Cleared. Official Public Export data.' },
  { name: 'Diablo IV', state: 'paused', note: 'Paused until publisher terms review completes. Nothing is captured for paused titles.' },
  { name: 'Grand Theft Auto VI', state: 'registry', note: 'Registry only until after launch and legal review. No coaching claims before there is a game to verify against.' },
];

/* ── Scroll reveal ────────────────────────────────────────────────── */

function useReveal(): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); io.unobserve(el); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }): React.JSX.Element {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

/* ── Components ───────────────────────────────────────────────────── */

function Nav(): React.JSX.Element {
  return (
    <nav className="nav">
      <div className="nav-left">
        <span className="nav-mark">GP</span>
        <span className="nav-name">GAMEPOINT</span>
      </div>
      <div className="nav-right">
        <a href="#how" className="nav-link">How it works</a>
        <a href="#boundaries" className="nav-link">Boundaries</a>
        <a href="#titles" className="nav-link">Titles</a>
        <a href="#download" className="btn-dl">Get early access →</a>
      </div>
    </nav>
  );
}

function Hero(): React.JSX.Element {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-tag">SCREEN-ONLY AI COACHING FOR PC</p>
        <h1>
          See more.<br />
          <span className="accent">Play better.</span>
        </h1>
        <p className="hero-body">
          The coach in your corner: it watches the fight, it never touches the controls. 
          GamePoint reads your screen, not your game files. One frame, one
          suggestion, zero injection. Your game stays untouched.
        </p>
        <div className="hero-ctas">
          <a href="#download" className="btn-primary">Download for Windows</a>
          <a href="#boundaries" className="btn-ghost">Privacy boundary ↓</a>
        </div>
      </div>
      <div className="hero-right">
        <div className="overlay-demo">
          <div className="demo-screen">
            <div className="demo-screen-label">YOUR GAME — UNTOUCHED</div>
            <div className="demo-scanlines" />
          </div>
          <div className="demo-panel">
            <div className="demo-panel-header">
              <span className="demo-status-dot" />
              GAMEPOINT OVERLAY
            </div>
            <div className="demo-advice">
              <span className="demo-advice-label">ADVICE</span>
              Push high ground before the circle closes. You have 18s.
            </div>
            <div className="demo-metrics">
              <div className="demo-metric">
                <span className="demo-metric-val">87%</span>
                <span className="demo-metric-key">CONFIDENCE</span>
              </div>
              <div className="demo-metric">
                <span className="demo-metric-val">1.2s</span>
                <span className="demo-metric-key">LATENCY</span>
              </div>
              <div className="demo-metric">
                <span className="demo-metric-val">VERIFIED</span>
                <span className="demo-metric-key">SOURCE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar(): React.JSX.Element {
  return (
    <Reveal>
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-val">{'<'}1.5s</span>
          <span className="stat-key">MAX LATENCY</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-val">0</span>
          <span className="stat-key">GAME INJECTION</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-val">1</span>
          <span className="stat-key">FRAME PER REQUEST</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-val">LOCAL</span>
          <span className="stat-key">OVERLAY RUNTIME</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-val">RLS</span>
          <span className="stat-key">DATA ISOLATION</span>
        </div>
      </div>
    </Reveal>
  );
}

function HowSection(): React.JSX.Element {
  return (
    <section id="how" className="section">
      <Reveal>
        <div className="section-label">01 — HOW IT WORKS</div>
        <h2 className="section-h2">Three steps. Nothing hidden.</h2>
      </Reveal>
      <div className="how-grid">
        <Reveal className="how-step">
          <div className="step-num">01</div>
          <h3>You press the key</h3>
          <p>
            GamePoint captures one screen frame or a region you select. 
            Nothing happens until you trigger it. No background recording. 
            No continuous capture.
          </p>
        </Reveal>
        <Reveal className="how-step">
          <div className="step-num">02</div>
          <h3>We read the pixels</h3>
          <p>
            The frame goes through a budget-gated Supabase assist pipeline. 
            Max 1,200 input tokens, 786K pixels, $0.0005 cost ceiling. 
            No game memory, no packet hooks, no audio.
          </p>
        </Reveal>
        <Reveal className="how-step">
          <div className="step-num">03</div>
          <h3>You see the advice</h3>
          <p>
            A short coaching suggestion appears on the overlay. Confidence 
            score, source tier, and evidence ID attached. The frame is not 
            stored. Session metadata is safe-only.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function BoundariesSection(): React.JSX.Element {
  return (
    <section id="boundaries" className="section">
      <Reveal>
        <div className="section-label">02 — PRIVACY BOUNDARY</div>
        <h2 className="section-h2">What we do. What we never do.</h2>
      </Reveal>
      <div className="boundary-grid">
        <Reveal className="boundary-col">
          <div className="boundary-header yes">WHAT IT DOES</div>
          <ul className="boundary-list">
            <li>Processes one user-triggered frame</li>
            <li>Routes through approved Supabase assist path</li>
            <li>Returns advice text + confidence score</li>
            <li>Shows safe session metadata in evidence view</li>
            <li>Enforces cost and latency circuit breakers</li>
            <li>Respects title compliance gating</li>
          </ul>
        </Reveal>
        <Reveal className="boundary-col">
          <div className="boundary-header no">WHAT IT NEVER DOES</div>
          <ul className="boundary-list deny">
            <li>Game injection or memory reads</li>
            <li>Packet hooks or network interception</li>
            <li>Microphone or system audio capture</li>
            <li>Cloudflare-side frame streaming</li>
            <li>Background recording without consent</li>
            <li>Raw frame storage beyond processing</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function TitlesSection(): React.JSX.Element {
  return (
    <section id="titles" className="section">
      <Reveal>
        <div className="section-label">03 — SUPPORTED TITLES</div>
        <h2 className="section-h2">Compliance-gated. No exceptions.</h2>
        <p className="section-sub">
          Every title must pass a research report and legal review before 
          runtime support is enabled. No auto-promotion.
        </p>
      </Reveal>
      <div className="titles-list">
        {titles.map((t) => (
          <Reveal key={t.name} className="title-row">
            <div className="title-row-left">
              <span className="title-name">{t.name}</span>
              <span className={`title-status ${t.state}`}>
                {t.state === 'supported' ? '● SUPPORTED' : t.state === 'paused' ? '○ PAUSED' : '○ REGISTRY'}
              </span>
            </div>
            <p className="title-note">{t.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CtaSection(): React.JSX.Element {
  return (
    <section id="download" className="section cta-section">
      <Reveal>
        <div className="cta-block">
          <div className="cta-left">
            <h2>Ready to play smarter?</h2>
            <p>
              Windows installer is in early access. Local-only, release-gated, 
              consent-first.
            </p>
          </div>
          <a href="#download" className="btn-primary btn-large">
            Get early access →
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer(): React.JSX.Element {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-mark">GP</span>
        © {new Date().getFullYear()} APEX Business Systems LTD. Edmonton, AB.
      </div>
      <div className="footer-right">
        <a href="#boundaries">Privacy</a>
        <a href="#how">How it works</a>
        <a href="#titles">Titles</a>
      </div>
    </footer>
  );
}

/* ── App ──────────────────────────────────────────────────────────── */

function App(): React.JSX.Element {
  return (
    <>
      <div className="grain" />
      <div className="app">
        <Nav />
        <Hero />
        <StatsBar />
        <HowSection />
        <BoundariesSection />
        <TitlesSection />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
