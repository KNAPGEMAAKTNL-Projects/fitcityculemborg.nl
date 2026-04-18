export interface Env {
  DB: D1Database;
}

const CHUNK = 1000;
const CUTOFF = "datetime('now','-12 months')";

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(prune(env));
  },

  async fetch(): Promise<Response> {
    return new Response('fitcity-archive-prune: scheduled worker. Use wrangler dev --test-scheduled to trigger.');
  },
};

async function prune(env: Env): Promise<void> {
  let signupsPruned = 0;
  let contactsPruned = 0;
  let signupsError: unknown = null;
  let contactsError: unknown = null;

  try {
    const r = await env.DB.prepare(
      `DELETE FROM signups_archive WHERE archive_id IN (SELECT archive_id FROM signups_archive WHERE archived_at < ${CUTOFF} LIMIT ${CHUNK})`
    ).run();
    signupsPruned = r.meta.changes ?? 0;
  } catch (err) {
    signupsError = err;
    console.error('signups_archive prune failed', err);
  }

  try {
    const r = await env.DB.prepare(
      `DELETE FROM contacts_archive WHERE archive_id IN (SELECT archive_id FROM contacts_archive WHERE archived_at < ${CUTOFF} LIMIT ${CHUNK})`
    ).run();
    contactsPruned = r.meta.changes ?? 0;
  } catch (err) {
    contactsError = err;
    console.error('contacts_archive prune failed', err);
  }

  console.log('prune complete', {
    signupsPruned,
    contactsPruned,
    signupsError: signupsError ? String(signupsError) : null,
    contactsError: contactsError ? String(contactsError) : null,
  });
}
