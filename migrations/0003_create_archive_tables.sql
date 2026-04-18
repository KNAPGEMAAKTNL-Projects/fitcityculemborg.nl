-- Archive tables for soft-deleted rows. Admin "Delete" moves rows here instead of hard-deleting.
-- A separate cron worker prunes rows older than 12 months.
-- RULE: any future ALTER on signups/contacts MUST include a matching ALTER here.

CREATE TABLE IF NOT EXISTS signups_archive (
  archive_id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_id INTEGER NOT NULL,
  plan_slug TEXT,
  plan_name TEXT,
  plan_price TEXT,
  plan_duration TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth TEXT,
  street TEXT,
  house_number TEXT,
  postcode TEXT,
  city TEXT,
  iban_encrypted TEXT,
  iban_masked TEXT,
  account_holder TEXT,
  privacy_consent_at TEXT,
  sepa_consent_at TEXT,
  terms_consent_at TEXT,
  status TEXT,
  notes TEXT,
  ip_hash TEXT,
  created_at TEXT,
  updated_at TEXT,
  first_name TEXT,
  last_name TEXT,
  house_number_addition TEXT,
  marketing_consent_at TEXT,
  archived_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_reason TEXT NOT NULL DEFAULT 'admin_delete'
);

CREATE INDEX IF NOT EXISTS idx_signups_archive_archived_at ON signups_archive(archived_at);
CREATE INDEX IF NOT EXISTS idx_signups_archive_original_id ON signups_archive(original_id);

CREATE TABLE IF NOT EXISTS contacts_archive (
  archive_id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_id INTEGER NOT NULL,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  privacy_consent_at TEXT,
  status TEXT,
  ip_hash TEXT,
  created_at TEXT,
  archived_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_reason TEXT NOT NULL DEFAULT 'admin_delete'
);

CREATE INDEX IF NOT EXISTS idx_contacts_archive_archived_at ON contacts_archive(archived_at);
CREATE INDEX IF NOT EXISTS idx_contacts_archive_original_id ON contacts_archive(original_id);
