/**
 * Server-side admin auth: verifies the CF_Authorization cookie
 * set by Cloudflare Access after login at /admin.
 *
 * The cookie is domain-scoped (path_cookie_attribute=false) so
 * it's included in /api/admin/* fetch requests from the browser.
 * Local dev (no Cloudflare) is allowed through.
 */

export function requireAccessAuth(request: Request): boolean {
  // Local development — no Cloudflare in front
  if (!request.headers.get('CF-Connecting-IP')) {
    return true;
  }

  // Check for CF_Authorization cookie (set after Access login)
  const cookies = request.headers.get('Cookie') || '';
  if (cookies.includes('CF_Authorization=')) {
    return true;
  }

  // Also accept CF-Access headers if present
  if (request.headers.get('CF-Access-Authenticated-User-Email')) {
    return true;
  }

  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
