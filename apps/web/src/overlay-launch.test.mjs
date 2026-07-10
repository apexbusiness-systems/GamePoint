// A3 regression shield: the web-side launch config must decode to the exact
// session and must structurally refuse server secrets.
import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeSessionConfig } from 'contracts';
import { buildOverlayLaunchConfig } from './overlay-launch.ts';

const input = {
  sessionId: '0b6f1a2c-3d4e-4f5a-8b6c-7d8e9f0a1b2c',
  titleId: '1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f',
  titleSlug: 'path-of-exile-2',
  supabaseUrl: 'https://example.supabase.co',
  publishableKey: 'sb_publishable_fixture_0123456789',
};

test('launch config roundtrips to the exact session and derived assist endpoint', () => {
  const encoded = buildOverlayLaunchConfig(input, new Date('2026-07-09T00:00:00.000Z'));
  const decoded = decodeSessionConfig(encoded);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.config.session_id, input.sessionId);
  assert.equal(decoded.config.assist_endpoint, 'https://example.supabase.co/functions/v1/assist');
  assert.equal(decoded.config.issued_at, '2026-07-09T00:00:00.000Z');
});

test('server secrets are refused at build time, never encoded', () => {
  assert.throws(() => buildOverlayLaunchConfig({ ...input, publishableKey: 'sb_secret_0123456789abcdefghij' }));
});

test('http supabase url is refused', () => {
  assert.throws(() => buildOverlayLaunchConfig({ ...input, supabaseUrl: 'http://example.supabase.co' }));
});
