# Archive & Retention Model

## How "Delete" works in the admin dashboard

When an admin deletes a signup or contact from `/admin/`, the row is **not hard-deleted**. It is moved to a parallel archive table:

- `signups` → `signups_archive`
- `contacts` → `contacts_archive`

The move is atomic (Cloudflare D1 `batch([INSERT, DELETE])`, implicit transaction). If the INSERT fails, the DELETE never runs and the live row stays intact.

Each archive row carries:
- `original_id` — the PK the row had in the live table
- `archived_at` — timestamp of the move (UTC)
- `archived_reason` — currently always `'admin_delete'`; future code paths may add `'gdpr_erasure'`, `'auto_expired'`, etc.

## Retention

A scheduled Cloudflare Worker (`cron-worker/`, deployed as `fitcity-archive-prune`) runs daily at **03:17 UTC** and permanently deletes archive rows where `archived_at < datetime('now','-12 months')`.

The legal 7-year retention for financial records lives with Mollie (SEPA-incassopartner), not in this website's D1. See `src/pages/privacy/index.astro` for the customer-facing text.

## Manual restore (rare)

If a row was archived by mistake, restore it with the following SQL via `wrangler d1 execute fitcity-production --remote --command "..."` or the Cloudflare D1 console.

### Restore a signup

```sql
INSERT INTO signups (
  plan_slug, plan_name, plan_price, plan_duration,
  full_name, email, phone, date_of_birth,
  street, house_number, postcode, city,
  iban_encrypted, iban_masked, account_holder,
  privacy_consent_at, sepa_consent_at, terms_consent_at,
  status, notes, ip_hash, created_at, updated_at,
  first_name, last_name, house_number_addition, marketing_consent_at
) SELECT
  plan_slug, plan_name, plan_price, plan_duration,
  full_name, email, phone, date_of_birth,
  street, house_number, postcode, city,
  iban_encrypted, iban_masked, account_holder,
  privacy_consent_at, sepa_consent_at, terms_consent_at,
  status, notes, ip_hash, created_at, updated_at,
  first_name, last_name, house_number_addition, marketing_consent_at
FROM signups_archive WHERE archive_id = ?;

DELETE FROM signups_archive WHERE archive_id = ?;
```

The restored row gets a **new** `id` (auto-increment), because the original `id` may have been reused by another signup since the archive.

**Caveat:** the `signups.email` column has a `UNIQUE` constraint. If a new signup reused that email while the original was archived, the restore will fail. In that case, decide case-by-case which record is authoritative.

### Restore a contact

```sql
INSERT INTO contacts (
  name, email, subject, message, privacy_consent_at, status, ip_hash, created_at
) SELECT
  name, email, subject, message, privacy_consent_at, status, ip_hash, created_at
FROM contacts_archive WHERE archive_id = ?;

DELETE FROM contacts_archive WHERE archive_id = ?;
```

`contacts` has no UNIQUE constraint on email, so restore never conflicts.

## Schema-drift rule

**Any future `ALTER TABLE` on `signups` or `contacts` MUST include a matching `ALTER TABLE` on `signups_archive` or `contacts_archive`.**

Rationale: the admin DELETE handler in `functions/api/admin/{signups,contacts}.ts` uses an explicit column list in `INSERT ... SELECT`. If the live table gains a column but the archive does not, the new column is silently dropped during archiving. Worse, if the live column is `NOT NULL` without a default, admin deletes start failing.

Convention: migrations that touch `signups` or `contacts` should be named `NNNN_alter_signups_*.sql` and contain a paired `ALTER TABLE signups_archive ADD COLUMN ...` (archive columns are always nullable — archive is a ledger, not a constraint).
