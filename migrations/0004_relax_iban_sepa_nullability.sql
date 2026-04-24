-- Relax NOT NULL on iban_encrypted, iban_masked, account_holder, sepa_consent_at
-- so Dagpas/Quick Deal signups (no SEPA mandate) can be persisted.
-- Archive table columns (0003) are already nullable -- no paired ALTER needed.
--
-- SQLite cannot ALTER COLUMN to drop NOT NULL, so rebuild the table.
-- Explicit column lists on both sides of INSERT/SELECT to avoid misalignment
-- from ALTER TABLE ADD COLUMN ordering in 0002.
-- DROP TABLE IF EXISTS at the top makes this idempotent-retry-safe.

DROP TABLE IF EXISTS signups_new;

CREATE TABLE signups_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_slug TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price TEXT NOT NULL,
  plan_duration TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  street TEXT NOT NULL,
  house_number TEXT NOT NULL,
  postcode TEXT NOT NULL,
  city TEXT NOT NULL,
  iban_encrypted TEXT,
  iban_masked TEXT,
  account_holder TEXT,
  privacy_consent_at TEXT NOT NULL,
  sepa_consent_at TEXT,
  terms_consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','activated','cancelled')),
  notes TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  first_name TEXT,
  last_name TEXT,
  house_number_addition TEXT,
  marketing_consent_at TEXT
);

INSERT INTO signups_new (
  id, plan_slug, plan_name, plan_price, plan_duration,
  full_name, email, phone, date_of_birth,
  street, house_number, postcode, city,
  iban_encrypted, iban_masked, account_holder,
  privacy_consent_at, sepa_consent_at, terms_consent_at,
  status, notes, ip_hash, created_at, updated_at,
  first_name, last_name, house_number_addition, marketing_consent_at
) SELECT
  id, plan_slug, plan_name, plan_price, plan_duration,
  full_name, email, phone, date_of_birth,
  street, house_number, postcode, city,
  iban_encrypted, iban_masked, account_holder,
  privacy_consent_at, sepa_consent_at, terms_consent_at,
  status, notes, ip_hash, created_at, updated_at,
  first_name, last_name, house_number_addition, marketing_consent_at
FROM signups;

DROP TABLE signups;
ALTER TABLE signups_new RENAME TO signups;

CREATE INDEX idx_signups_status ON signups(status);
CREATE INDEX idx_signups_email ON signups(email);
CREATE INDEX idx_signups_created ON signups(created_at DESC);
