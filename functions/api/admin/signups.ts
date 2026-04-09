import type { Env } from '../_shared/types';
import { requireAccessAuth, unauthorizedResponse } from './_auth';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
};

const VALID_STATUSES = ['new', 'contacted', 'activated', 'cancelled'] as const;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

async function handleGet(context: EventContext<Env, string, unknown>): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const status = url.searchParams.get('status');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '25', 10)));
    const offset = (page - 1) * limit;

    // Build query based on status filter
    let query: string;
    let countQuery: string;
    const bindings: unknown[] = [];
    const countBindings: unknown[] = [];

    if (status && (VALID_STATUSES as readonly string[]).includes(status)) {
      query = 'SELECT * FROM signups WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
      countQuery = 'SELECT COUNT(*) as total FROM signups WHERE status = ?';
      bindings.push(status, limit, offset);
      countBindings.push(status);
    } else {
      query = 'SELECT * FROM signups ORDER BY created_at DESC LIMIT ? OFFSET ?';
      countQuery = 'SELECT COUNT(*) as total FROM signups';
      bindings.push(limit, offset);
    }

    const [signupsResult, countsResult, totalResult] = await Promise.all([
      context.env.DB.prepare(query).bind(...bindings).all(),
      context.env.DB.prepare(
        'SELECT status, COUNT(*) as count FROM signups GROUP BY status'
      ).all(),
      context.env.DB.prepare(countQuery).bind(...countBindings).first<{ total: number }>(),
    ]);

    // Strip iban_encrypted from each row
    const signups = (signupsResult.results || []).map((row: Record<string, unknown>) => {
      const { iban_encrypted, ...safe } = row;
      return safe;
    });

    // Build counts object
    const counts: Record<string, number> = {
      new: 0,
      contacted: 0,
      activated: 0,
      cancelled: 0,
      total: 0,
    };

    for (const row of countsResult.results || []) {
      const s = row.status as string;
      const c = row.count as number;
      counts[s] = c;
      counts.total += c;
    }

    return jsonResponse({
      signups,
      counts,
      page,
      limit,
      total: totalResult?.total ?? 0,
    });
  } catch (err) {
    console.error('Admin signups GET error:', err);
    return jsonResponse({ error: 'Serverfout bij ophalen van inschrijvingen.' }, 500);
  }
}

async function handlePatch(context: EventContext<Env, string, unknown>): Promise<Response> {
  try {
    const body = (await context.request.json()) as {
      id?: number;
      status?: string;
      notes?: string;
    };

    if (!body.id) {
      return jsonResponse({ error: 'ID is verplicht.' }, 400);
    }

    if (!body.status || !(VALID_STATUSES as readonly string[]).includes(body.status)) {
      return jsonResponse(
        { error: `Ongeldige status. Kies uit: ${VALID_STATUSES.join(', ')}` },
        400
      );
    }

    await context.env.DB.prepare(
      "UPDATE signups SET status = ?, notes = COALESCE(?, notes), updated_at = datetime('now') WHERE id = ?"
    )
      .bind(body.status, body.notes ?? null, body.id)
      .run();

    // Return updated row (without iban_encrypted)
    const updated = await context.env.DB.prepare(
      'SELECT * FROM signups WHERE id = ?'
    )
      .bind(body.id)
      .first();

    if (!updated) {
      return jsonResponse({ error: 'Inschrijving niet gevonden.' }, 404);
    }

    const { iban_encrypted, ...safe } = updated as Record<string, unknown>;
    return jsonResponse({ signup: safe });
  } catch (err) {
    console.error('Admin signups PATCH error:', err);
    return jsonResponse({ error: 'Serverfout bij bijwerken van inschrijving.' }, 500);
  }
}

async function handleDelete(context: EventContext<Env, string, unknown>): Promise<Response> {
  try {
    const body = (await context.request.json()) as { id?: number };

    if (!body.id) {
      return jsonResponse({ error: 'ID is verplicht.' }, 400);
    }

    const existing = await context.env.DB.prepare(
      'SELECT id FROM signups WHERE id = ?'
    ).bind(body.id).first();

    if (!existing) {
      return jsonResponse({ error: 'Inschrijving niet gevonden.' }, 404);
    }

    await context.env.DB.prepare('DELETE FROM signups WHERE id = ?')
      .bind(body.id)
      .run();

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Admin signups DELETE error:', err);
    return jsonResponse({ error: 'Serverfout bij verwijderen van inschrijving.' }, 500);
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (!requireAccessAuth(context.request)) {
    return unauthorizedResponse();
  }

  if (context.request.method === 'GET') {
    return handleGet(context);
  }

  if (context.request.method === 'PATCH') {
    return handlePatch(context);
  }

  if (context.request.method === 'DELETE') {
    return handleDelete(context);
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: CORS_HEADERS,
  });
};
