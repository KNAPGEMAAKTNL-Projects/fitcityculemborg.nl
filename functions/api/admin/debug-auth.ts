/**
 * TEMPORARY diagnostic endpoint — remove after debugging.
 * Returns JWT validation details without exposing sensitive data.
 */

import type { Env } from '../_shared/types';

export const onRequest: PagesFunction<Env> = async (context) => {
  const env = context.env;
  const request = context.request;

  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  const expectedAud = env.ACCESS_AUD;

  const diagnostics: Record<string, unknown> = {
    teamDomainSet: !!teamDomain,
    audSet: !!expectedAud,
    expectedIss: teamDomain ? `https://${teamDomain}` : 'NOT SET',
  };

  // Check cookie
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(/CF_Authorization=([^\s;]+)/);
  diagnostics.hasCookie = !!match;

  if (match) {
    const token = match[1];
    const parts = token.split('.');
    diagnostics.tokenParts = parts.length;

    if (parts.length === 3) {
      try {
        const padded = parts[1] + '='.repeat((4 - (parts[1].length % 4)) % 4);
        const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Only expose non-sensitive claim metadata
        diagnostics.payload = {
          iss: payload.iss,
          aud: payload.aud,
          exp: payload.exp,
          iat: payload.iat,
          type: payload.type,
          email: payload.email ? '***@***' : 'missing',
          expValid: payload.exp ? Date.now() / 1000 < payload.exp : false,
          issMatch: payload.iss === `https://${teamDomain}`,
          audMatch: Array.isArray(payload.aud)
            ? payload.aud.includes(expectedAud)
            : payload.aud === expectedAud,
        };
      } catch (e) {
        diagnostics.decodeError = String(e);
      }
    }

    // Try fetching JWKS
    try {
      const certsUrl = `https://${teamDomain}/cdn-cgi/access/certs`;
      const res = await fetch(certsUrl);
      diagnostics.jwksStatus = res.status;
      if (res.ok) {
        const data = (await res.json()) as { keys: unknown[] };
        diagnostics.jwksKeyCount = data.keys?.length ?? 0;
      }
    } catch (e) {
      diagnostics.jwksError = String(e);
    }
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
