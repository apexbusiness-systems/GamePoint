// Overlay state: pure, framework-free, node-tested. The UI is a projection of
// this reducer — every screen/state in the apex-frontend State Gate exists here.
import { z } from 'zod';
import type { CoachingResponse } from 'contracts';

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
  | { type: 'opacity/set'; value: number };

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
