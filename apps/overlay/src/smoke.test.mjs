import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('overlay scaffold keeps consent and audio disabled visible', () => {
  const source = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');
  assert.match(source, /Consent required before capture/);
  assert.match(source, /Disabled in v1\.0/);
});
