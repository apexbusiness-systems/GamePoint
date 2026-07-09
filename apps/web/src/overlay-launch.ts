// Overlay launch config export (A3): builds the versioned, validated handoff
// package that binds the desktop overlay to a real authenticated session.
// Pure and node-testable; the UI only copies the returned string.
import { encodeSessionConfig, SessionConfig, SESSION_CONFIG_VERSION } from 'contracts';

export interface OverlayLaunchInput {
  sessionId: string;
  titleId: string;
  titleSlug: string;
  supabaseUrl: string;
  publishableKey: string;
}

/**
 * Returns the encoded `gpc` payload for the overlay. Throws (ZodError) if any
 * field is invalid — including a server secret in place of the publishable key,
 * which must never leave server/CI context (charter invariant 10).
 */
export function buildOverlayLaunchConfig(input: OverlayLaunchInput, now: Date = new Date()): string {
  const config: SessionConfig = SessionConfig.parse({
    config_version: SESSION_CONFIG_VERSION,
    session_id: input.sessionId,
    title_id: input.titleId,
    title_slug: input.titleSlug,
    supabase_url: input.supabaseUrl,
    publishable_key: input.publishableKey,
    assist_endpoint: `${input.supabaseUrl.replace(/\/$/, '')}/functions/v1/assist`,
    issued_at: now.toISOString(),
  });
  return encodeSessionConfig(config);
}
