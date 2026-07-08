import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('../../..', import.meta.url).pathname);

test('web metadata declares canonical production domain', () => {
  const html = readFileSync(resolve(root, 'apps/web/index.html'), 'utf8');
  assert.match(html, /<link rel="canonical" href="https:\/\/gamepointagent\.com" \/>/);
});

test('Worker canonicalizes defensive domains to gamepointagent.com', () => {
  const worker = readFileSync(resolve(root, 'workers/web-assets.ts'), 'utf8');
  assert.match(worker, /CANONICAL_HOST = 'gamepointagent\.com'/);
  for (const host of ['www.gamepointagent.com', 'game-point.icu', 'gamepointagent.ca', 'gamepointagent.icu', 'gamepointagent.info']) {
    assert.ok(worker.includes(`'${host}',`), `missing redirect host ${host}`);
  }
});
