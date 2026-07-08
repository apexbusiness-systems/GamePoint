import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AssistRequest,
  CoachingResponse,
  AdviceEventTelemetry,
  NO_ADVICE_THIS_FRAME,
  ADVANTAGE_REFUSAL,
} from './index.ts';

const fixture = (name) =>
  JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), 'utf8'));

test('golden AssistRequest fixture parses (schema parity anchor)', () => {
  const req = AssistRequest.parse(fixture('assist-request.json'));
  assert.equal(req.schema_version, 1);
  assert.equal(req.roi_descriptors.length, 2);
  assert.equal(req.audio_opus_bytes, null);
});

test('golden CoachingResponse fixture parses', () => {
  const res = CoachingResponse.parse(fixture('coaching-response.json'));
  assert.equal(res.source_tier, 'verified');
  assert.ok(res.evidence_ids.length > 0);
});

test('ADR-003: audio payloads are structurally rejected', () => {
  const bad = { ...fixture('assist-request.json'), audio_opus_bytes: 'AAAA', audio_duration_ms: 5000 };
  assert.throws(() => AssistRequest.parse(bad));
});

test('truth bar: bare claim without evidence and without not_verified is rejected', () => {
  const bare = { ...fixture('coaching-response.json'), evidence_ids: [], not_verified: false };
  assert.throws(() => CoachingResponse.parse(bare));
});

test('truth bar: evidence-free response allowed only when marked not_verified', () => {
  const marked = { ...fixture('coaching-response.json'), evidence_ids: [], not_verified: true };
  assert.equal(CoachingResponse.parse(marked).not_verified, true);
});

test('degrade and refusal constants satisfy their own schema', () => {
  assert.equal(NO_ADVICE_THIS_FRAME.source_tier, 'none');
  assert.equal(ADVANTAGE_REFUSAL.source_tier, 'policy');
  assert.match(NO_ADVICE_THIS_FRAME.advice_text, /^Not verified:/);
});

test('telemetry schema has no content-bearing fields (privacy §1.2)', () => {
  const keys = Object.keys(AdviceEventTelemetry.shape);
  for (const banned of ['advice_text', 'frame_b64', 'ocr_text', 'window_title', 'username', 'chat']) {
    assert.ok(!keys.includes(banned), `telemetry must not carry ${banned}`);
  }
});

test('malformed blake3 digest rejected', () => {
  const bad = { ...fixture('assist-request.json'), blake3: 'nothex' };
  assert.throws(() => AssistRequest.parse(bad));
});
