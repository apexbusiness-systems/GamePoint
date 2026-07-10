// Binding resolution tests (A3): the overlay must bind to a real session,
// refuse malformed configs, and only fall back to fixture mode when unconfigured.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { encodeSessionConfig, SessionConfig } from 'contracts';
import { resolveBinding } from './config.ts';

const fixtureConfig = SessionConfig.parse(
  JSON.parse(readFileSync(new URL('../../../packages/contracts/fixtures/session-config.json', import.meta.url), 'utf8')),
);

test('no gpc param -> fixture mode', () => {
  assert.deepEqual(resolveBinding(''), { mode: 'fixture' });
  assert.deepEqual(resolveBinding('?other=1'), { mode: 'fixture' });
});

test('valid gpc param -> configured with the exact session', () => {
  const binding = resolveBinding(`?gpc=${encodeSessionConfig(fixtureConfig)}`);
  assert.equal(binding.mode, 'configured');
  assert.equal(binding.config.session_id, fixtureConfig.session_id);
  assert.equal(binding.config.title_slug, 'path-of-exile-2');
});

test('malformed gpc param -> invalid with a reason, never a crash', () => {
  const binding = resolveBinding('?gpc=corrupted-not-a-config');
  assert.equal(binding.mode, 'invalid');
  assert.equal(typeof binding.error, 'string');
  assert.ok(binding.error.length > 0);
});
