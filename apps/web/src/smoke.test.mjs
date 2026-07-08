import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');

test('web copy states the privacy boundary and truthful title states', () => {
  assert.match(source, /No game injection, memory reads/);
  assert.match(source, /Paused — terms review/);
  assert.match(source, /Registry only/);
  assert.match(source, /Nothing by default/);
});

test('web landing carries the metaphor at category formation', () => {
  assert.match(source, /coach in your corner: it watches the fight, it never touches the controls/);
});

test('paused titles are never soft-pedaled as coming soon', () => {
  assert.doesNotMatch(source, /coming soon/i);
});
