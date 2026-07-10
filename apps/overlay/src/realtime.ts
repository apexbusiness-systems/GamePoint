// Realtime delivery: private Broadcast channel `session:{id}` (007_broadcast.sql).
// Falls back to a deterministic fixture driver when Supabase env is absent so the
// HUD is fully demoable and testable without a backend.
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import { CoachingResponse } from 'contracts';

export type Unsubscribe = () => void;

export interface ResponseSource {
  subscribe(sessionId: string, onResponse: (r: CoachingResponse) => void): Unsubscribe;
}

export class SupabaseResponseSource implements ResponseSource {
  private readonly url: string;
  private readonly anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url;
    this.anonKey = anonKey;
  }

  subscribe(sessionId: string, onResponse: (r: CoachingResponse) => void): Unsubscribe {
    const client = createClient(this.url, this.anonKey);
    const channel: RealtimeChannel = client
      .channel(`session:${sessionId}`, { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, (message) => {
        // Boundary validation: a malformed broadcast is dropped, never rendered.
        const parsed = CoachingResponse.safeParse(
          (message.payload as { record?: unknown } | undefined)?.record,
        );
        if (parsed.success) onResponse(parsed.data);
      })
      .subscribe();
    return () => {
      void channel.unsubscribe();
      void client.removeAllChannels();
    };
  }
}

/** Demo/dev source: emits a scripted set of responses on a timer. */
export class FixtureResponseSource implements ResponseSource {
  private readonly script: CoachingResponse[];
  private readonly intervalMs: number;

  constructor(script: CoachingResponse[], intervalMs = 4000) {
    this.script = script;
    this.intervalMs = intervalMs;
  }

  subscribe(_sessionId: string, onResponse: (r: CoachingResponse) => void): Unsubscribe {
    let i = 0;
    const timer = setInterval(() => {
      if (i < this.script.length) onResponse(this.script[i++]);
    }, this.intervalMs);
    return () => clearInterval(timer);
  }
}

export function makeResponseSource(
  env: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  },
  // A3: an explicit session binding (from a validated SessionConfig) wins over env.
  binding?: { url: string; key: string },
): ResponseSource {
  if (binding) return new SupabaseResponseSource(binding.url, binding.key);
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    return new SupabaseResponseSource(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  }
  return new FixtureResponseSource(demoScript);
}

export const demoScript: CoachingResponse[] = [
  {
    advice_text:
      'Your flasks are empty and a rare pack marker sits on the minimap. Refill at the checkpoint before engaging — rares in this zone burst hard.',
    recommended_action: 'Refill flasks, then engage the rare pack.',
    evidence_ids: ['9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d'],
    confidence: 0.82,
    source_tier: 'verified',
    not_verified: false,
  },
  {
    advice_text:
      'Not verified: this boss appears to telegraph a sweep after the third slam — consider holding your dodge until the pattern repeats.',
    recommended_action: 'Watch one full attack cycle before committing.',
    evidence_ids: [],
    confidence: 0.5,
    source_tier: 'none',
    not_verified: true,
  },
  {
    advice_text: 'Not verified: no advice this frame.',
    recommended_action: 'none',
    evidence_ids: [],
    confidence: 0,
    source_tier: 'none',
    not_verified: true,
  },
];
