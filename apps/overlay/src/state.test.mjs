import test from 'node:test';
import assert from 'node:assert/strict';
import {
  confidenceTier,
  defaultSettings,
  initialState,
  loadSettings,
  reduce,
  splitNotVerified,
} from './state.ts';

const consented = {
  ...defaultSettings,
  consent: { accepted: true, ageGatePassed: true, acceptedAt: '2026-07-08T00:00:00Z' },
  playstyle: 'mastery',
};

const advice = (over = {}) => ({
  advice_text: 'Refill flasks before the rare pack.',
  recommended_action: 'Refill at checkpoint.',
  evidence_ids: ['9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d'],
  confidence: 0.82,
  source_tier: 'verified',
  not_verified: false,
  ...over,
});

test('first run blocks on consent; consent without age gate does not pass', () => {
  let s = initialState(defaultSettings);
  assert.equal(s.screen, 'consent');
  s = reduce(s, { type: 'consent/accept', ageGatePassed: false, now: 'x' });
  assert.equal(s.screen, 'consent', 'COPPA age gate is blocking');
  s = reduce(s, { type: 'consent/accept', ageGatePassed: true, now: 'x' });
  assert.equal(s.screen, 'persona', 'one-input persona setup follows consent');
  s = reduce(s, { type: 'persona/set', playstyle: 'story' });
  assert.equal(s.screen, 'hud');
});

test('returning user with persona lands directly on hud', () => {
  assert.equal(initialState(consented).screen, 'hud');
});

test('corrupt persisted settings fall back to defaults, never crash', () => {
  assert.deepEqual(loadSettings('{"version":99,"garbage":true}'), defaultSettings);
  assert.deepEqual(loadSettings('not json'), defaultSettings);
  assert.deepEqual(loadSettings(null), defaultSettings);
});

test('hotkey only arms while capturing on hud screen', () => {
  let s = initialState(consented);
  s = reduce(s, { type: 'hotkey/pressed', nowMs: 1 });
  assert.equal(s.hud.kind, 'idle', 'capture off → hotkey ignored');
  s = reduce(s, { type: 'capture/toggle' });
  s = reduce(s, { type: 'hotkey/pressed', nowMs: 2 });
  assert.equal(s.hud.kind, 'thinking');
});

test('advice response updates hud and session recap counters', () => {
  let s = reduce(initialState(consented), { type: 'capture/toggle' });
  s = reduce(s, { type: 'response/received', response: advice(), nowMs: 10 });
  assert.equal(s.hud.kind, 'advice');
  assert.deepEqual(s.session, { adviceCount: 1, verifiedCount: 1, refusals: 0 });
});

test('degraded "no advice this frame" is a designed state, not an error', () => {
  let s = initialState(consented);
  s = reduce(s, {
    type: 'response/received',
    response: advice({
      advice_text: 'Not verified: no advice this frame.',
      evidence_ids: [],
      confidence: 0,
      source_tier: 'none',
      not_verified: true,
      recommended_action: 'none',
    }),
    nowMs: 10,
  });
  assert.equal(s.hud.kind, 'degraded');
  assert.equal(s.session.adviceCount, 0, 'degraded frames never inflate the recap');
});

test('advantage refusal renders the policy state and counts it', () => {
  let s = initialState(consented);
  s = reduce(s, {
    type: 'response/received',
    response: advice({
      advice_text:
        'GamePoint coaches decisions — it never calls out live opponent information you could not perceive yourself. Ask about builds, rotations, or macro strategy instead.',
      evidence_ids: [],
      source_tier: 'policy',
      not_verified: true,
      confidence: 1,
      recommended_action: 'none',
    }),
    nowMs: 10,
  });
  assert.equal(s.hud.kind, 'refused');
  assert.equal(s.session.refusals, 1);
});

test('offline failure surfaces the queue depth', () => {
  const s = reduce(initialState(consented), { type: 'response/failed', offline: true, queued: 3 });
  assert.deepEqual(s.hud, { kind: 'offline', queued: 3 });
});

test('unsupported title state flags and recovers', () => {
  let s = reduce(initialState(consented), { type: 'title/unsupported', titleName: 'Some Game' });
  assert.equal(s.hud.kind, 'unsupported');
  s = reduce(s, { type: 'title/supported' });
  assert.equal(s.hud.kind, 'idle');
});

test('opacity is clamped to the readable band', () => {
  let s = reduce(initialState(consented), { type: 'opacity/set', value: 0.1 });
  assert.equal(s.settings.hudOpacity, 0.35);
  s = reduce(s, { type: 'opacity/set', value: 2 });
  assert.equal(s.settings.hudOpacity, 1);
});

test('confidence tiers and not-verified splitting', () => {
  assert.equal(confidenceTier(0.9), 'high');
  assert.equal(confidenceTier(0.6), 'medium');
  assert.equal(confidenceTier(0.2), 'low');
  assert.deepEqual(splitNotVerified('Not verified: check the wiki.'), {
    prefix: 'Not verified:',
    body: 'check the wiki.',
  });
  assert.deepEqual(splitNotVerified('Solid play.'), { prefix: null, body: 'Solid play.' });
});
