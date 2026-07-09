export interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'gamepointagent.com';
const REDIRECT_HOSTS = new Set([
  'www.gamepointagent.com',
  'game-point.icu',
  'gamepointagent.ca',
  'gamepointagent.icu',
  'gamepointagent.info',
]);

function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }
  if (url.hostname === CANONICAL_HOST && url.protocol !== 'https:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return null;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    return canonicalRedirect(request) ?? env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
