// Voice lexicon lint (docs/design/voice-and-perception.md §3): brand voice is
// enforced, not aspirational. Scans user-facing copy sources — not test fixtures,
// where game vocabulary like "magic resist" is legitimate domain language.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const COPY_SOURCES = [
  './App.tsx',
  './state.ts',
  './realtime.ts',
  '../../web/src/main.tsx',
  '../../../docs/consent.md',
];

const BANNED = [
  /\bmagic(?:al|ally)?\b/i,
  /\beas(?:y|ily)\b/i,
  /\bcheap(?:ly)?\b/i,
  /\bplayful(?:ly)?\b/i,
  /\bdisruptive\b/i,
  /\beffortless(?:ly)?\b/i,
  /\binstantly\b/i,
  /\bguaranteed?\b/i,
  /\bunbeatable\b/i,
  /\bwin more\b/i,
];

const METAPHOR =
  'coach in your corner: it watches the fight, it never touches the controls';

test('no banned lexicon in any user-facing copy source', () => {
  for (const rel of COPY_SOURCES) {
    const text = readFileSync(new URL(rel, import.meta.url), 'utf8');
    for (const pattern of BANNED) {
      assert.doesNotMatch(text, pattern, `${rel} violates voice lexicon: ${pattern}`);
    }
  }
});

test('the metaphor appears verbatim at both category-formation moments only', () => {
  const normalize = (s) => s.replace(/\s+/g, ' ');
  const consentApp = normalize(readFileSync(new URL('./App.tsx', import.meta.url), 'utf8'));
  const web = normalize(readFileSync(new URL('../../web/src/main.tsx', import.meta.url), 'utf8'));
  assert.ok(consentApp.includes(METAPHOR), 'first-run consent must lead with the metaphor');
  assert.ok(web.includes(METAPHOR), 'web landing must lead with the metaphor');
  // Sharpness rule: once per surface — repetition dulls encoding.
  assert.equal(consentApp.split(METAPHOR).length - 1, 1);
  assert.equal(web.split(METAPHOR).length - 1, 1);
});

test('tier-1 status words exist as text, never color alone', () => {
  const app = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');
  for (const word of ["'Watching'", "'Capture off'", "'Offline'"]) {
    assert.ok(app.includes(word), `status vocabulary missing: ${word}`);
  }
});
