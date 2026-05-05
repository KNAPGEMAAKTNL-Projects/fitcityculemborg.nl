-- Add phone column to contacts (and paired archive).
-- Existing 5 rows pre-dating this migration will have phone = NULL.
-- New rows are required to provide phone via API + form validation,
-- so the DB column stays NULLABLE to preserve historic data without
-- backfilling a sentinel value.
--
-- Per project rule (ARCHIVE.md / migration 0003): any ALTER on contacts
-- MUST include the matching ALTER on contacts_archive in the same file.
-- Archive columns are always nullable, so no DEFAULT needed.

ALTER TABLE contacts ADD COLUMN phone TEXT;
ALTER TABLE contacts_archive ADD COLUMN phone TEXT;
