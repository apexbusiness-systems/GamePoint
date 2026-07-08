import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('../../..', import.meta.url).pathname);

test('web metadata declares canonical production domain', () => {
  const html = readFileSync(resolve(root, 'apps/web/index.html'), 'utf8');
  assert.match(html, /<link rel="canonical" href="https:\/\/gamepointagent\.com" \/>/);
});

test('Cloudflare redirects canonicalize defensive domains', () => {
  const redirects = readFileSync(resolve(root, 'apps/web/_redirects'), 'utf8');
  for (const host of ['www.gamepointagent.com', 'game-point.icu', 'gamepointagent.ca', 'gamepointagent.icu', 'gamepointagent.info']) {
    assert.match(redirects, new RegExp(`https://${host.replace('.', '\\.')}/\\* https://gamepointagent\\.com/:splat 301!`));
  }
});
