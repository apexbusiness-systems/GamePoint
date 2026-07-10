// Overlay state: pure, framework-free, node-tested. The UI is a projection of
// this reducer — every screen/state in the apex-frontend State Gate exists here.
import { z } from 'zod';
import type { CoachingResponse, HotkeyIntent } from 'contracts';

export type Playstyle = 'story' | 'mastery' | 'rank';

// --- Persisted settings (versioned, Zod-validated at the storage boundary) -------

export const PersistedSettings = z.object({
  version: z.literal(1),
  consent: z.object({
    accepted: z.boolean(),
    ageGatePassed: z.boolean(),
    acceptedAt: z.string().nullable(),
  }),
  playstyle: z.union([z.literal('story'), z.literal('mastery'), z.literal('rank')]).nullable(),
  muted: z.boolean(),
  hudOpacity: z.number().min(0.35).max(1),
  proactiveNudges: z.boolean(), // opt-in per skill §V; default false
});
export type PersistedSettings = z.infer<typeof PersistedSettings>;

export const defaultSettings: PersistedSettings = {
  version: 1,
  consent: { accepted: false, ageGatePassed: false, acceptedAt: null },
  playstyle: null,
  muted: false,
  hudOpacity: 0.92,
  proactiveNudges: false,
};

export function loadSettings(raw: string | null): PersistedSettings {
  if (!raw) return defaultSettings;
  try {
    return PersistedSettings.parse(JSON.parse(raw));
  } catch {
    return defaultSettings; // corrupt/older payloads never crash the overlay
  }
}

// --- Voice (WP-6 / ADR-010): deliberately NOT part of PersistedSettings ---------
// Consent must be re-asked every session ("no remember my choice") — keeping this slice
// outside PersistedSettings guarantees that by construction, since only state.settings is
// ever written to localStorage (see usePersistedReducer in App.tsx). A fresh app load always
// produces initialVoiceState, with no code path that could accidentally persist it.

export interface VoiceState {
  consented: boolean; // session-only opt-in; never true on a fresh load
  outputEnabled: boolean; // TTS: speak advice_text aloud
  listening: boolean; // true only while the push-to-talk control is physically held
  lastIntent: HotkeyIntent | null;
  lastError: string | null;
}

export const initialVoiceState: VoiceState = {
  consented: false,
  outputEnabled: false,
  listening: false,
  lastIntent: null,
  lastError: null,
};

// --- App flow -------------------------------------------------------------------

export type Screen = 'consent' | 'persona' | 'hud';

export type HudStatus =
  | { kind: 'idle' }                       // capturing, waiting for a hotkey
  | { kind: 'thinking'; sinceMs: number }  // request in flight
  | { kind: 'advice'; response: CoachingResponse; receivedAt: number }
  | { kind: 'degraded' }                   // "no advice this frame"
  | { kind: 'refused' }                    // advantage-check refusal
  | { kind: 'offline'; queued: number }
  | { kind: 'unsupported'; titleName: string | null }; // unverified title flag

export interface OverlayState {
  screen: Screen;
  settings: PersistedSettings;
  hud: HudStatus;
  captureActive: boolean;
  /** A3: true when a session config arrived but failed validation. Structural lock —
   *  capture can never activate until the config is corrected (no silent fixture fallback). */
  captureLocked: boolean;
  session: { adviceCount: number; verifiedCount: number; refusals: number };
  /** WP-6: session-only voice state — see VoiceState above for why this isn't persisted. */
  voice: VoiceState;
}

export function initialState(settings: PersistedSettings): OverlayState {
  const consented = settings.consent.accepted && settings.consent.ageGatePassed;
  return {
    screen: !consented ? 'consent' : settings.playstyle === null ? 'persona' : 'hud',
    settings,
    hud: { kind: 'idle' },
    captureActive: false,
    captureLocked: false,
    session: { adviceCount: 0, verifiedCount: 0, refusals: 0 },
    voice: initialVoiceState,
  };
}

export type Action =
  | { type: 'consent/accept'; ageGatePassed: boolean; now: string }
  | { type: 'persona/set'; playstyle: Playstyle }
  | { type: 'binding/refused' }
  | { type: 'capture/toggle' }
  | { type: 'hotkey/pressed'; nowMs: number }
  | { type: 'response/received'; response: CoachingResponse; nowMs: number }
  | { type: 'response/failed'; offline: boolean; queued: number }
  | { type: 'title/unsupported'; titleName: string | null }
  | { type: 'title/supported' }
  | { type: 'mute/toggle' }
  | { type: 'opacity/set'; value: number }
  // WP-6 / ADR-010 — session-only voice actions (never touch PersistedSettings).
  | { type: 'voice/consent-set'; consented: boolean }
  | { type: 'voice/output-toggle' }
  | { type: 'voice/ptt-start' }
  | { type: 'voice/ptt-end' }
  | { type: 'voice/intent-recognized'; intent: HotkeyIntent; nowMs: number }
  | { type: 'voice/error'; message: string };

const REFUSAL_MARKER = 'never calls out live opponent information';

export function reduce(state: OverlayState, action: Action): OverlayState {
  switch (action.type) {
    case 'consent/accept': {
      if (!action.ageGatePassed) return state; // age gate is blocking, not advisory
      const settings: PersistedSettings = {
        ...state.settings,
        consent: { accepted: true, ageGatePassed: true, acceptedAt: action.now },
      };
      return { ...state, settings, screen: settings.playstyle === null ? 'persona' : 'hud' };
    }
    case 'persona/set': {
      const settings = { ...state.settings, playstyle: action.playstyle };
      return { ...state, settings, screen: 'hud' };
    }
    case 'binding/refused':
      // Invalid config is a hard stop: capture off now and locked until corrected.
      return { ...state, captureLocked: true, captureActive: false, hud: { kind: 'idle' } };
    case 'capture/toggle':
      if (state.captureLocked) return state; // locked: toggle is structurally inert
      return { ...state, captureActive: !state.captureActive, hud: { kind: 'idle' } };
    case 'hotkey/pressed':
      if (!state.captureActive || state.screen !== 'hud') return state;
      return { ...state, hud: { kind: 'thinking', sinceMs: action.nowMs } };
    case 'response/received': {
      const refused =
        action.response.source_tier === 'policy' &&
        action.response.advice_text.includes(REFUSAL_MARKER);
      const degraded =
        action.response.source_tier === 'none' && action.response.confidence === 0;
      const session = {
        adviceCount: state.session.adviceCount + (refused || degraded ? 0 : 1),
        verifiedCount:
          state.session.verifiedCount + (!refused && !degraded && !action.response.not_verified ? 1 : 0),
        refusals: state.session.refusals + (refused ? 1 : 0),
      };
      const hud: HudStatus = refused
        ? { kind: 'refused' }
        : degraded
          ? { kind: 'degraded' }
          : { kind: 'advice', response: action.response, receivedAt: action.nowMs };
      return { ...state, hud, session };
    }
    case 'response/failed':
      return {
        ...state,
        hud: action.offline ? { kind: 'offline', queued: action.queued } : { kind: 'degraded' },
      };
    case 'title/unsupported':
      return { ...state, hud: { kind: 'unsupported', titleName: action.titleName } };
    case 'title/supported':
      return state.hud.kind === 'unsupported' ? { ...state, hud: { kind: 'idle' } } : state;
    case 'mute/toggle':
      return { ...state, settings: { ...state.settings, muted: !state.settings.muted } };
    case 'opacity/set': {
      const value = Math.min(1, Math.max(0.35, action.value));
      return { ...state, settings: { ...state.settings, hudOpacity: value } };
    }

    // --- WP-6 / ADR-010 -----------------------------------------------------------
    case 'voice/consent-set':
      // Revoking consent hard-resets the whole slice — no lingering listening/output
      // flag can survive a "no" (mirrors captureLocked's structural-lock pattern).
      return { ...state, voice: action.consented ? { ...state.voice, consented: true } : initialVoiceState };
    case 'voice/output-toggle':
      if (!state.voice.consented) return state; // structurally gated, same as capture/toggle
      return { ...state, voice: { ...state.voice, outputEnabled: !state.voice.outputEnabled } };
    case 'voice/ptt-start':
      if (!state.voice.consented) return state;
      return { ...state, voice: { ...state.voice, listening: true, lastError: null } };
    case 'voice/ptt-end':
      return { ...state, voice: { ...state.voice, listening: false } };
    case 'voice/intent-recognized': {
      const voice = { ...state.voice, listening: false, lastIntent: action.intent };
      // Same structural guard as hotkey/pressed — a voice-recognized intent is just an
      // alternate trigger for the identical existing request flow, never a parallel path.
      if (!state.captureActive || state.screen !== 'hud') return { ...state, voice };
      return { ...state, voice, hud: { kind: 'thinking', sinceMs: action.nowMs } };
    }
    case 'voice/error':
      return { ...state, voice: { ...state.voice, listening: false, lastError: action.message } };
  }
}

// --- Presentation helpers (tested; keep JSX dumb) ----------------------------------

export type ConfidenceTier = 'low' | 'medium' | 'high';

export function confidenceTier(confidence: number): ConfidenceTier {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.45) return 'medium';
  return 'low';
}

/** Split the mandated "Not verified:" prefix so the UI can style it distinctly. */
export function splitNotVerified(text: string): { prefix: string | null; body: string } {
  const marker = 'Not verified:';
  return text.startsWith(marker)
    ? { prefix: marker, body: text.slice(marker.length).trim() }
    : { prefix: null, body: text };
}

export function personaLabel(playstyle: Playstyle): string {
  return { story: 'Story first', mastery: 'Mastery', rank: 'Rank climb' }[playstyle];
}
