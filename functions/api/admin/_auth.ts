/**
 * Server-side admin auth: validates the CF_Authorization JWT
 * set by Cloudflare Access after login at /admin.
 *
 * Instead of just checking cookie existence, this module:
 * 1. Extracts the JWT from the CF_Authorization cookie
 * 2. Fetches Cloudflare Access public keys (JWKS)
 * 3. Verifies the JWT signature using Web Crypto API
 * 4. Checks expiration, audience, and issuer claims
 *
 * This prevents fake-cookie attacks and works across all domains
 * (custom domain, pages.dev, preview deployments).
 */

// Cloudflare Access config — hardcoded because Pages Functions
// env vars are unreliable across deployments. These are not secrets:
// the team domain is a public URL, the AUD is in every JWT payload.
const ACCESS_TEAM_DOMAIN = 'summitlabs.cloudflareaccess.com';
const ACCESS_AUD = 'e76278bc2f4e23c70128a4a01703e31cad2ef17f34c9eeb604ef6a235567544b';

// Cache JWKS keys in memory for the lifetime of the Worker isolate
let cachedKeys: CryptoKey[] | null = null;
let cachedKeysExpiry = 0;
const JWKS_CACHE_MS = 10 * 60 * 1000; // 10 minutes

// --- Base64url helpers (no atob needed) ---

function base64urlToUint8Array(str: string): Uint8Array {
  // Add padding
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  // Convert base64url to base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = new TextDecoder().decode(base64urlToUint8Array(parts[1]));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// --- JWKS fetching and key import ---

async function fetchAccessKeys(teamDomain: string): Promise<CryptoKey[]> {
  const now = Date.now();
  if (cachedKeys && now < cachedKeysExpiry) {
    return cachedKeys;
  }

  const certsUrl = `https://${teamDomain}/cdn-cgi/access/certs`;
  const res = await fetch(certsUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch Access certs from ${certsUrl}: ${res.status}`);
  }

  const { keys } = (await res.json()) as { keys: JsonWebKey[] };
  const imported: CryptoKey[] = [];

  for (const jwk of keys) {
    try {
      const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      );
      imported.push(key);
    } catch {
      // Skip keys that can't be imported (e.g. different algorithm)
    }
  }

  cachedKeys = imported;
  cachedKeysExpiry = now + JWKS_CACHE_MS;
  return imported;
}

// --- JWT verification ---

async function verifyJwt(
  token: string,
  keys: CryptoKey[],
  expectedAud: string,
  teamDomain: string,
): Promise<{ valid: true; email: string } | { valid: false; reason: string }> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Malformed JWT' };
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { valid: false, reason: 'Failed to decode JWT payload' };
  }

  // Check expiration
  const exp = payload.exp as number | undefined;
  if (!exp || Date.now() / 1000 > exp) {
    return { valid: false, reason: 'Token expired' };
  }

  // Check audience
  const aud = payload.aud as string | string[] | undefined;
  const audArray = Array.isArray(aud) ? aud : [aud];
  if (!audArray.includes(expectedAud)) {
    return { valid: false, reason: 'Invalid audience' };
  }

  // Check issuer (exact match — never use substring matching on security claims)
  const iss = payload.iss as string | undefined;
  const expectedIss = `https://${teamDomain}`;
  if (!iss || iss !== expectedIss) {
    return { valid: false, reason: 'Invalid issuer' };
  }

  // Verify signature against all known keys
  const signingInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = base64urlToUint8Array(parts[2]);

  for (const key of keys) {
    try {
      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        new Uint8Array(signature) as unknown as BufferSource,
        new Uint8Array(signingInput) as unknown as BufferSource,
      );
      if (isValid) {
        const email = (payload.email as string) || 'unknown';
        return { valid: true, email };
      }
    } catch {
      // Try next key
    }
  }

  return { valid: false, reason: 'Signature verification failed' };
}

// --- Exported auth functions ---

/**
 * Validates the CF_Authorization JWT against Cloudflare Access certs.
 * Returns the authenticated user's email on success, or null on failure.
 */
export async function requireAccessAuth(
  request: Request,
): Promise<string | null> {
  const teamDomain = ACCESS_TEAM_DOMAIN;
  const expectedAud = ACCESS_AUD;

  // Extract CF_Authorization cookie
  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(/CF_Authorization=([^\s;]+)/);
  if (!match) {
    return null;
  }

  const token = match[1];

  try {
    const keys = await fetchAccessKeys(teamDomain);
    if (keys.length === 0) {
      console.error('No valid keys fetched from Access certs');
      return null;
    }

    const result = await verifyJwt(token, keys, expectedAud, teamDomain);
    if (result.valid) {
      return result.email;
    }

    console.error('JWT validation failed:', result.reason);
    return null;
  } catch (err) {
    console.error('Auth verification error:', err);
    return null;
  }
}

/**
 * CSRF protection: checks Origin header against allowed domains.
 * Only enforced for state-changing methods (POST, PATCH, DELETE).
 */
export function checkCsrf(request: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  const origin = request.headers.get('Origin');
  if (!origin) {
    // Non-browser requests (curl, etc.) don't send Origin.
    // Since we validate the JWT, this is safe to allow.
    return true;
  }

  const allowed = [
    'https://fitcityculemborg.nl',
    'https://www.fitcityculemborg.nl',
    'https://fitcityculemborg-nl.pages.dev',
  ];

  // Also allow *.fitcityculemborg-nl.pages.dev preview deployments
  if (origin.endsWith('.fitcityculemborg-nl.pages.dev')) {
    return true;
  }

  return allowed.includes(origin);
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export function forbiddenResponse(): Response {
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
