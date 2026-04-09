/**
 * Server-side verification of Cloudflare Access authentication.
 * Defense-in-depth: blocks requests that bypass Zero Trust entirely.
 *
 * Checks for CF-Access headers (injected by Zero Trust) OR the
 * CF_Authorization cookie (set after Access login). If neither
 * is present and we're behind Cloudflare, the request is rejected.
 */

export function requireAccessAuth(request: Request): boolean {
  // Check for CF-Access headers (injected by Zero Trust on matched routes)
  const email = request.headers.get('CF-Access-Authenticated-User-Email');
  const jwt = request.headers.get('CF-Access-JWT-Assertion');

  if (email && jwt) {
    return true;
  }

  // Check for CF_Authorization cookie (set after Access login)
  const cookies = request.headers.get('Cookie') || '';
  if (cookies.includes('CF_Authorization=')) {
    return true;
  }

  // Local development (no Cloudflare headers at all) — allow
  const cfIP = request.headers.get('CF-Connecting-IP');
  if (!cfIP) {
    return true;
  }

  // Behind Cloudflare but no Access auth — block
  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
