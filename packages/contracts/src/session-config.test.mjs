// SessionConfig handoff contract (A3): the overlay binds only to a validated,
// versioned config exported by the authenticated web app. These tests are the
// regression shield for the encode/decode boundary and the secret-refusal wall.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CoachingResponse,
  SessionConfig,
  encodeSessionConfig,
  decodeSessionConfig,
  looksLikeServerSecret,
  AssistRequest,
  AssistErrorBody,
} from './index.ts';

const fixture = (name) =>
  JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), 'utf8'));

test('golden SessionConfig fixture parses', () => {
  const cfg = SessionConfig.parse(fixture('session-config.json'));
  assert.equal(cfg.config_version, 1);
  assert.equal(cfg.title_slug, 'path-of-exile-2');
});

test('encode/decode roundtrip preserves the config exactly', () => {
  const cfg = SessionConfig.parse(fixture('session-config.json'));
  const decoded = decodeSessionConfig(encodeSessionConfig(cfg));
  assert.equal(decoded.ok, true);
  assert.deepEqual(decoded.config, cfg);
});

test('garbage input is refused, never thrown', () => {
  for (const bad of ['', '!!!not-base64!!!', 'eyJub3QiOiJqc29u', 'AAAA']) {
    const decoded = decodeSessionConfig(bad);
    assert.equal(decoded.ok, false);
    assert.equal(typeof decoded.error, 'string');
  }
});

test('tampered payload fails validation', () => {
  const cfg = fixture('session-config.json');
  cfg.supabase_url = 'http://insecure.example.com'; // https required
  const encoded = Buffer.from(JSON.stringify(cfg)).toString('base64url');
  const decoded = decodeSessionConfig(encoded);
  assert.equal(decoded.ok, false);
});

test('sb_secret_ keys are structurally refused', () => {
  assert.equal(looksLikeServerSecret('sb_secret_0123456789abcdefghij'), true);
  const cfg = fixture('session-config.json');
  cfg.publishable_key = 'sb_secret_0123456789abcdefghij';
  assert.equal(SessionConfig.safeParse(cfg).success, false);
});

test('service_role JWTs are structurally refused', () => {
  const payload = Buffer.from(JSON.stringify({ iss: 'supabase', role: 'service_role' })).toString('base64url');
  const jwt = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`;
  assert.equal(looksLikeServerSecret(jwt), true);
  const cfg = fixture('session-config.json');
  cfg.publishable_key = jwt;
  assert.equal(SessionConfig.safeParse(cfg).success, false);
});

test('publishable keys and anon JWTs pass the secret wall', () => {
  assert.equal(looksLikeServerSecret('sb_publishable_fixture_0123456789'), false);
  const anon = Buffer.from(JSON.stringify({ iss: 'supabase', role: 'anon' })).toString('base64url');
  assert.equal(looksLikeServerSecret(`eyJhbGciOiJIUzI1NiJ9.${anon}.sig`), false);
});

test('AssistRequest correlation fields are optional (A4, backward compatible)', () => {
  const base = fixture('assist-request.json');
  assert.equal(AssistRequest.safeParse(base).success, true); // golden fixture carries them
  const legacy = { ...base };
  delete legacy.request_id;
  delete legacy.client_version;
  assert.equal(AssistRequest.safeParse(legacy).success, true); // pre-A4 clients stay valid
  assert.equal(AssistRequest.safeParse({ ...base, request_id: 'not-a-uuid' }).success, false);
});

test('CoachingResponse retains request_id through parse (broadcast -> HUD)', () => {
  const parsed = CoachingResponse.parse(fixture('coaching-response.json'));
  assert.equal(parsed.request_id, '4d5e6f7a-8b9c-4d1e-9f2a-3b4c5d6e7f8a');
  const legacy = fixture('coaching-response.json');
  delete legacy.request_id;
  assert.equal(CoachingResponse.safeParse(legacy).success, true); // pre-A4 rows stay valid
});

test('AssistErrorBody carries a deterministic code and request id', () => {
  const body = {
    error_code: 'RATE_LIMITED',
    error: 'Too many assist requests. Try again shortly.',
    request_id: '0b6f1a2c-3d4e-4f5a-8b6c-7d8e9f0a1b2c',
  };
  assert.equal(AssistErrorBody.safeParse(body).success, true);
  assert.equal(AssistErrorBody.safeParse({ ...body, error_code: 'MYSTERY' }).success, false);
});
