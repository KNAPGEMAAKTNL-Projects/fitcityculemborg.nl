import type { Env } from '../_shared/types';
import { requireAccessAuth, unauthorizedResponse } from './_auth';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
};

const VALID_STATUSES = ['new', 'replied', 'closed'] as const;

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
      query = 'SELECT * FROM contacts WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
      countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE status = ?';
      bindings.push(status, limit, offset);
      countBindings.push(status);
    } else {
      query = 'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?';
      countQuery = 'SELECT COUNT(*) as total FROM contacts';
      bindings.push(limit, offset);
    }

    const [contactsResult, countsResult, totalResult] = await Promise.all([
      context.env.DB.prepare(query).bind(...bindings).all(),
      context.env.DB.prepare(
        'SELECT status, COUNT(*) as count FROM contacts GROUP BY status'
      ).all(),
      context.env.DB.prepare(countQuery).bind(...countBindings).first<{ total: number }>(),
    ]);

    // Build counts object
    const counts: Record<string, number> = {
      new: 0,
      replied: 0,
      closed: 0,
      total: 0,
    };

    for (const row of countsResult.results || []) {
      const s = row.status as string;
      const c = row.count as number;
      counts[s] = c;
      counts.total += c;
    }

    return jsonResponse({
      contacts: contactsResult.results || [],
      counts,
      page,
      limit,
      total: totalResult?.total ?? 0,
    });
  } catch (err) {
    console.error('Admin contacts GET error:', err);
    return jsonResponse({ error: 'Serverfout bij ophalen van berichten.' }, 500);
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

    // Contacts table doesn't have updated_at or notes columns,
    // so we only update status
    await context.env.DB.prepare(
      'UPDATE contacts SET status = ? WHERE id = ?'
    )
      .bind(body.status, body.id)
      .run();

    // Return updated row
    const updated = await context.env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ?'
    )
      .bind(body.id)
      .first();

    if (!updated) {
      return jsonResponse({ error: 'Bericht niet gevonden.' }, 404);
    }

    return jsonResponse({ contact: updated });
  } catch (err) {
    console.error('Admin contacts PATCH error:', err);
    return jsonResponse({ error: 'Serverfout bij bijwerken van bericht.' }, 500);
  }
}

async function handleDelete(context: EventContext<Env, string, unknown>): Promise<Response> {
  try {
    const body = (await context.request.json()) as { id?: number };

    if (!body.id) {
      return jsonResponse({ error: 'ID is verplicht.' }, 400);
    }

    const existing = await context.env.DB.prepare(
      'SELECT id FROM contacts WHERE id = ?'
    ).bind(body.id).first();

    if (!existing) {
      return jsonResponse({ error: 'Bericht niet gevonden.' }, 404);
    }

    await context.env.DB.prepare('DELETE FROM contacts WHERE id = ?')
      .bind(body.id)
      .run();

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Admin contacts DELETE error:', err);
    return jsonResponse({ error: 'Serverfout bij verwijderen van bericht.' }, 500);
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
