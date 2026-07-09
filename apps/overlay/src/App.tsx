import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  Action,
  confidenceTier,
  initialState,
  loadSettings,
  OverlayState,
  personaLabel,
  Playstyle,
  reduce,
  splitNotVerified,
} from './state';
import { demoScript, FixtureResponseSource, makeResponseSource } from './realtime';
import { resolveBinding } from './config';

const STORAGE_KEY = 'gamepoint.overlay.v1';

function usePersistedReducer(): [OverlayState, React.Dispatch<Action>] {
  const [state, dispatch] = useReducer(
    reduce,
    undefined,
    () => initialState(loadSettings(localStorage.getItem(STORAGE_KEY))),
  );
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
  }, [state.settings]);
  return [state, dispatch];
}

// --- Screens -----------------------------------------------------------------------

function ConsentScreen({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const [ofAge, setOfAge] = React.useState(false);
  return (
    <section className="card flow" aria-labelledby="consent-title">
      <h1 id="consent-title">Before GamePoint can coach you</h1>
      <p className="metaphor">
        GamePoint is the coach in your corner: it watches the fight, it never touches the
        controls.
      </p>
      <ul className="plain">
        <li><strong>What is captured:</strong> your screen, only while capture is on, only when you press the assist hotkey.</li>
        <li><strong>What leaves this device:</strong> a single frame per assist, sent encrypted for analysis, processed in memory and discarded after the answer.</li>
        <li><strong>What is kept:</strong> nothing by default — no frames, no recordings, no chat, no usernames.</li>
        <li><strong>Voice:</strong> off, and not available in this version.</li>
        <li><strong>Anti-cheat note:</strong> GamePoint never touches game processes, but any third-party overlay can draw a false-positive review on kernel anti-cheat titles. Read the per-title notes before ranked play.</li>
      </ul>
      <label className="check">
        <input type="checkbox" checked={ofAge} onChange={(e) => setOfAge(e.target.checked)} />
        I am 13 or older (required)
      </label>
      <button
        className="primary"
        disabled={!ofAge}
        onClick={() =>
          dispatch({ type: 'consent/accept', ageGatePassed: ofAge, now: new Date().toISOString() })
        }
      >
        I understand — enable GamePoint
      </button>
    </section>
  );
}

function PersonaScreen({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const options: { value: Playstyle; label: string; hint: string }[] = [
    { value: 'story', label: 'Story', hint: 'Gentle nudges, no spoilers, immersion first' },
    { value: 'mastery', label: 'Mastery', hint: 'Deep mechanics, builds, and why — not just what' },
    { value: 'rank', label: 'Rank', hint: 'Terse, macro-focused calls for climbing' },
  ];
  return (
    <section className="card flow" aria-labelledby="persona-title">
      <h1 id="persona-title">What are you playing for?</h1>
      <p className="muted">One answer sets tone, depth, and pace everywhere. Change it anytime.</p>
      <div className="persona-grid" role="radiogroup" aria-label="Coaching style">
        {options.map((o) => (
          <button
            key={o.value}
            className="persona-option"
            onClick={() => dispatch({ type: 'persona/set', playstyle: o.value })}
          >
            <strong>{o.label}</strong>
            <span className="muted">{o.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AdviceBody({ state }: { state: OverlayState }) {
  const { hud } = state;
  switch (hud.kind) {
    case 'idle':
      // The status word already says Watching/Capture off — no redundancy here.
      return (
        <p className="muted">
          {state.captureActive
            ? 'Press your assist hotkey at any decision point.'
            : 'Nothing is being watched. Start capture when you are ready.'}
        </p>
      );
    case 'thinking':
      return <p className="muted pulse">Reading the frame…</p>;
    case 'degraded':
      return (
        <p className="muted">
          No advice this frame — the decision point wasn’t clear. Try again with the relevant
          UI on screen.
        </p>
      );
    case 'refused':
      return (
        <p>
          <span className="badge policy">Coaching only</span> GamePoint won’t call out live
          opponent info you couldn’t see yourself. Ask about builds, timers, or strategy instead.
        </p>
      );
    case 'offline':
      return (
        <p className="muted">
          Offline — {hud.queued} request{hud.queued === 1 ? '' : 's'} queued. They’ll send when
          the connection returns.
        </p>
      );
    case 'unsupported':
      return (
        <p>
          <span className="badge warn">Unverified title</span>{' '}
          {hud.titleName ?? 'This game'} hasn’t passed GamePoint’s compliance review, so live
          coaching is off. General questions still work in the companion app.
        </p>
      );
    case 'advice': {
      const { prefix, body } = splitNotVerified(hud.response.advice_text);
      return (
        <div className="flow-tight">
          <p className="advice">
            {prefix && <span className="badge warn">{prefix}</span>} {body}
          </p>
          {hud.response.recommended_action !== 'none' && (
            <p className="action">→ {hud.response.recommended_action}</p>
          )}
        </div>
      );
    }
  }
}

/** Tier-1 status word: absolute certainty of what the system is doing right now. */
function statusWord(state: OverlayState): string {
  if (state.hud.kind === 'offline') return 'Offline';
  return state.captureActive ? 'Watching' : 'Capture off';
}

function Hud({ state, dispatch }: { state: OverlayState; dispatch: React.Dispatch<Action> }) {
  const advice = state.hud.kind === 'advice' ? state.hud.response : null;
  const tier = advice ? confidenceTier(advice.confidence) : null;
  return (
    <section className="card flow" aria-label="GamePoint coaching HUD">
      {/* 3-second sequence, tier 1: system status — text + indicator, never color alone. */}
      <header className="hud-bar">
        <span className="status" role="status">
          <span
            className={`capture-indicator ${state.captureActive ? 'on' : ''}`}
            aria-hidden="true"
          />
          {statusWord(state)}
        </span>
        <span className="spacer" />
        <button
          className="ghost"
          aria-pressed={state.settings.muted}
          onClick={() => dispatch({ type: 'mute/toggle' })}
        >
          {state.settings.muted ? 'Unmute' : 'Mute'}
        </button>
        <button className="ghost" onClick={() => dispatch({ type: 'capture/toggle' })}>
          {state.captureActive ? 'Pause' : 'Start capture'}
        </button>
      </header>

      <div aria-live="polite" className="advice-region">
        <AdviceBody state={state} />
      </div>

      {advice && (
        <footer className="hud-bar chips">
          <span className={`chip conf-${tier}`}>
            <span className="chip-dot" aria-hidden="true" /> Confidence: {tier}
          </span>
          <span className="chip">
            Evidence: {advice.evidence_ids.length > 0 ? `${advice.evidence_ids.length} source${advice.evidence_ids.length === 1 ? '' : 's'}` : 'none'}
          </span>
        </footer>
      )}

      <details className="settings">
        <summary>Session &amp; settings</summary>
        <div className="flow-tight">
          {state.settings.playstyle && (
            <p className="muted">
              Coaching style: <span className="badge subtle">{personaLabel(state.settings.playstyle)}</span>
            </p>
          )}
          <p className="muted">
            This session: {state.session.adviceCount} tip{state.session.adviceCount === 1 ? '' : 's'} ·{' '}
            {state.session.verifiedCount} evidence-backed · {state.session.refusals} refused by
            policy
          </p>
          <label className="row">
            HUD opacity
            <input
              type="range"
              min={0.35}
              max={1}
              step={0.05}
              value={state.settings.hudOpacity}
              onChange={(e) => dispatch({ type: 'opacity/set', value: Number(e.target.value) })}
            />
          </label>
          <label className="row disabled" title="Voice capture ships later; off by design in v1.0">
            Voice input <input type="checkbox" disabled /> <span className="badge subtle">coming later</span>
          </label>
        </div>
      </details>
    </section>
  );
}

export default function App() {
  const [state, dispatch] = usePersistedReducer();
  // A3: bind to the session config handed off by the web app (gpc URL param).
  const binding = useMemo(() => resolveBinding(window.location.search), []);
  const sourceRef = useRef(
    makeResponseSource(
      import.meta.env,
      binding.mode === 'configured'
        ? { url: binding.config.supabase_url, key: binding.config.publishable_key }
        : undefined,
    ),
  );
  const sessionId = useMemo(
    () => (binding.mode === 'configured' ? binding.config.session_id : crypto.randomUUID()),
    [binding],
  );

  // Deliver responses only while capturing on the HUD screen. An invalid config
  // never degrades into fixture mode — capture stays off until it is corrected.
  useEffect(() => {
    if (binding.mode === 'invalid') return;
    if (state.screen !== 'hud' || !state.captureActive) return;
    const unsubscribe = sourceRef.current.subscribe(sessionId, (response) =>
      dispatch({ type: 'response/received', response, nowMs: Date.now() }),
    );
    return unsubscribe;
  }, [state.screen, state.captureActive, sessionId, binding.mode]);

  const demoHotkey = useCallback(() => dispatch({ type: 'hotkey/pressed', nowMs: Date.now() }), []);
  useEffect(() => {
    // Dev affordance: F9 simulates the assist hotkey when running the fixture source.
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F9' && sourceRef.current instanceof FixtureResponseSource) demoHotkey();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [demoHotkey]);

  return (
    <main className="overlay" style={{ opacity: state.settings.hudOpacity }}>
      {binding.mode === 'invalid' && (
        <div className="binding-banner refused" role="alert">
          Session config refused: {binding.error}. Launch the overlay from the GamePoint web app.
        </div>
      )}
      {binding.mode === 'configured' && (
        <div className="binding-banner bound">
          Bound to session {binding.config.session_id.slice(0, 8)}… · {binding.config.title_slug}
        </div>
      )}
      {state.screen === 'consent' && <ConsentScreen dispatch={dispatch} />}
      {state.screen === 'persona' && <PersonaScreen dispatch={dispatch} />}
      {state.screen === 'hud' && <Hud state={state} dispatch={dispatch} />}
    </main>
  );
}

export { demoScript };
