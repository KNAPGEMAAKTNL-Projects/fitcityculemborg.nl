-- Signups table for membership registrations
CREATE TABLE IF NOT EXISTS signups (
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
  iban_encrypted TEXT NOT NULL,
  iban_masked TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  privacy_consent_at TEXT NOT NULL,
  sepa_consent_at TEXT NOT NULL,
  terms_consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','activated','cancelled')),
  notes TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_signups_status ON signups(status);
CREATE INDEX idx_signups_email ON signups(email);
CREATE INDEX idx_signups_created ON signups(created_at DESC);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  privacy_consent_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','replied','closed')),
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);
