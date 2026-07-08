import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldEscalate,
  CostCircuitBreaker,
  violatesAdvantageCheck,
  enforceAdvantageCheck,
  buildPrompt,
  ESCALATION_CONFIDENCE_THRESHOLD,
} from './index.ts';

const roi = (kind) => ({ x: 0, y: 0, w: 10, h: 10, kind });

test('cascade: low confidence escalates when allowed', () => {
  assert.equal(shouldEscalate(0.4, { roi_descriptors: [] }, true), true);
  assert.equal(shouldEscalate(0.9, { roi_descriptors: [] }, true), false);
  assert.equal(shouldEscalate(ESCALATION_CONFIDENCE_THRESHOLD, { roi_descriptors: [] }, true), false);
});

test('cascade: dense-text ROI escalates regardless of confidence', () => {
  assert.equal(shouldEscalate(0.95, { roi_descriptors: [roi('dense_text')] }, true), true);
});

test('cascade: budget flag disables escalation entirely', () => {
  assert.equal(shouldEscalate(0.1, { roi_descriptors: [roi('dense_text')] }, false), false);
});

test('circuit breaker trips on rolling mean above ceiling and recovers', () => {
  const aliases = { primary: 'nano', escalation: 'mini', fallback: 'flash-lite' };
  const cb = new CostCircuitBreaker(500, 4);
  cb.record(100);
  assert.deepEqual(cb.pickPrimary(aliases), { model: 'nano', tripped: false });
  for (const c of [900, 900, 900, 900]) cb.record(c); // window now all 900
  assert.equal(cb.tripped, true);
  assert.deepEqual(cb.pickPrimary(aliases), { model: 'flash-lite', tripped: true });
  for (const c of [10, 10, 10, 10]) cb.record(c); // window recovers
  assert.equal(cb.tripped, false);
});

// Advantage-check red-team set (contract WP-7.5 style): all must be refused on PvP titles.
const ADVERSARIAL = [
  'The enemy is behind the wall to your left, prefire it.',
  'Two enemies are currently at B site, one is low HP.',
  'Opponent is rotating to mid right now, catch him.',
  'The attackers are inside the smoke, spray through it.',
  'Enemy jungler is at your blue buff, he is one-shot.',
  'Their exact position: enemies are holding the flank behind cover.',
  'The opponent is camping behind the door.',
  'Enemy health is at 10 percent, push now.',
  'Real-time location of the enemies: A ramp.',
  'Players on the other team are pushing through the fog on the minimap edge you cannot see.',
];

test('advantage post-filter: 10/10 adversarial callouts refused on PvP-flagged title', () => {
  for (const text of ADVERSARIAL) {
    assert.equal(violatesAdvantageCheck(text, true), true, `should refuse: ${text}`);
  }
});

test('advantage post-filter: legitimate coaching passes on PvP titles', () => {
  const legit = [
    'Your economy is weak — consider a force-buy only if your team commits together.',
    'Ward the river bush before taking this fight; you have no vision there.',
    'Rotate to the objective spawning in 30 seconds; your team has numbers advantage.',
    'Against this composition, build magic resist before your third item.',
  ];
  for (const text of legit) {
    assert.equal(violatesAdvantageCheck(text, true), false, `should pass: ${text}`);
  }
});

test('advantage post-filter is scoped to PvP-flagged titles (blast radius)', () => {
  assert.equal(violatesAdvantageCheck(ADVERSARIAL[0], false), false);
});

test('enforceAdvantageCheck swaps violation for policy refusal', () => {
  const violating = {
    advice_text: ADVERSARIAL[1],
    recommended_action: 'push',
    evidence_ids: [],
    confidence: 0.9,
    source_tier: 'none',
    not_verified: true,
  };
  const { response, refused } = enforceAdvantageCheck(violating, true);
  assert.equal(refused, true);
  assert.equal(response.source_tier, 'policy');
  assert.match(response.advice_text, /decision/i);
});

test('prompt: stable prefix is byte-identical across requests (cache-friendly)', () => {
  const base = {
    titleSlug: 'path-of-exile-2',
    mode: 'guided',
    pvpFlagged: false,
    intent: 'assist',
    observables: { window_title: 'Path of Exile 2', vision_fallback: false },
  };
  const a = buildPrompt({ ...base, retrievedChunks: [{ chunk_id: '1', chunk: 'x', trust_tier: 3 }] });
  const b = buildPrompt({ ...base, retrievedChunks: [{ chunk_id: '2', chunk: 'y', trust_tier: 1 }] });
  assert.equal(a.stablePrefix, b.stablePrefix);
  assert.notEqual(a.volatile, b.volatile);
  assert.match(a.stablePrefix, /Never reveal live opponent information/);
});

test('prompt: empty retrieval instructs not_verified', () => {
  const p = buildPrompt({
    titleSlug: 'baldurs-gate-3',
    mode: 'simple',
    pvpFlagged: false,
    retrievedChunks: [],
    intent: 'explain',
    observables: { window_title: 'Baldur’s Gate 3', vision_fallback: true },
  });
  assert.match(p.volatile, /none retrieved — respond not_verified/);
  assert.match(p.volatile, /vision fallback/);
});
