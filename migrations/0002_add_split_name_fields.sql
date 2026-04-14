-- Add split name fields, house number addition, and marketing consent
-- Existing records keep full_name; new records use first_name + last_name
ALTER TABLE signups ADD COLUMN first_name TEXT;
ALTER TABLE signups ADD COLUMN last_name TEXT;
ALTER TABLE signups ADD COLUMN house_number_addition TEXT;
ALTER TABLE signups ADD COLUMN marketing_consent_at TEXT;
