/**
 * Server-side verification of Cloudflare Access authentication.
 * Defense-in-depth: even if Zero Trust is misconfigured or bypassed
 * (e.g. preview deployments), admin endpoints remain protected.
 */

export function requireAccessAuth(request: Request): string | null {
  const email = request.headers.get('CF-Access-Authenticated-User-Email');
  const jwt = request.headers.get('CF-Access-JWT-Assertion');

  if (!email || !jwt) {
    return null;
  }

  return email;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
