import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('web copy states privacy boundary', () => {
  const source = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');
  assert.match(source, /No game injection/);
  assert.match(source, /Not runtime supported/);
});
