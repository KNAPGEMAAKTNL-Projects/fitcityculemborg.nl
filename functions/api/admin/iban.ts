import type { Env } from '../_shared/types';
import { decrypt } from '../_shared/encryption';
import { requireAccessAuth, unauthorizedResponse, forbiddenResponse, checkCsrf } from './_auth';

const SECURE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: SECURE_HEADERS,
  });
}

/**
 * POST /api/admin/iban/
 * Decrypts a single IBAN for viewing in the admin dashboard.
 * Protected by Cloudflare Zero Trust + server-side header verification.
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authedEmail = await requireAccessAuth(context.request);
  if (!authedEmail) {
    return unauthorizedResponse();
  }

  if (!checkCsrf(context.request)) {
    return forbiddenResponse();
  }

  try {
    const body = (await context.request.json()) as { id?: number };

    if (!body.id) {
      return jsonResponse({ error: 'ID is verplicht.' }, 400);
    }

    const row = await context.env.DB.prepare(
      'SELECT iban_encrypted FROM signups WHERE id = ?'
    )
      .bind(body.id)
      .first<{ iban_encrypted: string | null }>();

    if (!row) {
      return jsonResponse({ error: 'Inschrijving niet gevonden.' }, 404);
    }

    // Non-SEPA plans (Dagpas, Quick Deal) store NULL here.
    if (!row.iban_encrypted) {
      return jsonResponse({ error: 'Geen IBAN voor deze inschrijving.' }, 404);
    }

    const iban = await decrypt(row.iban_encrypted, context.env.ENCRYPTION_SECRET);

    // Format in groups of 4
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    const groups: string[] = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.slice(i, i + 4));
    }

    return jsonResponse({ iban: groups.join(' ') });
  } catch (err) {
    console.error('Admin IBAN decrypt error:', err);
    return jsonResponse({ error: 'Kon IBAN niet ontsleutelen.' }, 500);
  }
};
