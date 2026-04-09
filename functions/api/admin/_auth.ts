/**
 * Server-side admin auth placeholder.
 * Authentication is handled by Cloudflare Zero Trust (Access).
 * All /admin and /api/admin routes are protected via Access policies
 * covering fitcityculemborg.nl, pages.dev, and wildcard preview deployments.
 */

export function requireAccessAuth(_request: Request): boolean {
  return true;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
