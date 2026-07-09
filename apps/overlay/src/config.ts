// Overlay session binding (A3): resolve the launch config handed off by the
// authenticated web app. Three outcomes, all explicit:
//   configured — a validated SessionConfig arrived via the `gpc` URL param
//   fixture    — no config present; demo fixture mode (labeled, local only)
//   invalid    — a config arrived but failed validation; capture stays off
import { decodeSessionConfig, type SessionConfig } from 'contracts';

export type OverlayBinding =
  | { mode: 'configured'; config: SessionConfig }
  | { mode: 'fixture' }
  | { mode: 'invalid'; error: string };

export function resolveBinding(search: string): OverlayBinding {
  const encoded = new URLSearchParams(search).get('gpc');
  if (!encoded) return { mode: 'fixture' };
  const decoded = decodeSessionConfig(encoded);
  if (!decoded.ok) return { mode: 'invalid', error: decoded.error };
  return { mode: 'configured', config: decoded.config };
}
