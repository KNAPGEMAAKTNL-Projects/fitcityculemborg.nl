# Signup Form Restructure — Design Spec

**Date:** 2026-04-14
**Status:** Approved
**Scope:** Restructure signup step 2 form with sectioned layout, split name fields, postcode auto-fill, email confirmation, and marketing consent.

---

## 1. Form Layout (Step 2)

Replace the current flat field list with three visually separated sections. Every field on its own line — no side-by-side rows.

### Persoonlijke gegevens

| # | Field | Type | Required | Name attr |
|---|-------|------|----------|-----------|
| 1 | Voornaam | text | yes | `first_name` |
| 2 | Achternaam | text | yes | `last_name` |
| 3 | Telefoon | tel | yes | `phone` |
| 4 | E-mail | email | yes | `email` |
| 5 | Bevestig e-mail | email | yes | `email_confirm` (client-only) |
| 6 | Geboortedatum | date | yes | `date_of_birth` |

### Adresgegevens

| # | Field | Type | Required | Name attr |
|---|-------|------|----------|-----------|
| 7 | Postcode | text | yes | `postcode` |
| 8 | Huisnummer | text | yes | `house_number` |
| 9 | Huisnummer toevoeging | text | no | `house_number_addition` |
| 10 | Straatnaam | text | yes | `street` (auto-filled by PDOK) |
| 11 | Stad | text | yes | `city` (auto-filled by PDOK) |

### Communicatie

| # | Field | Type | Required | Name attr |
|---|-------|------|----------|-----------|
| 12 | Marketing consent checkbox | checkbox | no | `marketing_consent` |

Checkbox label: "Ja, Fitcity Culemborg mag mij informatie sturen over openingstijden, updates en aanbiedingen."

### Section headings

Styled as small uppercase labels using `font-heading` (Oswald) at ~0.9rem with spacing to separate from fields above. Not full `h2` step titles — more like sub-section dividers.

---

## 2. PDOK Postcode Auto-fill

When both `postcode` and `house_number` have valid values, fire a debounced (500ms) fetch to the PDOK Locatieserver API.

**Endpoint:**
```
GET https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=postcode:{pc}+and+huisnummer:{nr}&rows=1&fl=straatnaam,woonplaatsnaam
```

**Behavior:**
- Postcode normalized before request (strip spaces, uppercase)
- On success: fill `street` and `city` fields. Both remain fully editable.
- On failure (no results, network error): fields stay empty, user fills manually. No error shown — silent fallback.
- Lookup re-triggers if user changes either postcode or huisnummer.
- No loading spinner — API responds in ~100ms.

**Applies in both:**
- Step 2 main form
- Step 3 edit drawer (address section)

---

## 3. Email Confirmation Validation

- `email_confirm` is client-only — not sent to backend, not stored in D1.
- Validation triggers on `blur` of the confirm field (not while typing).
- Mismatch error: "E-mailadressen komen niet overeen"
- If user changes the original email field after confirming: clear the confirm field's error state so it re-validates on next blur.
- Paste is allowed in both fields (no anti-paste).

---

## 4. Database Migration

New migration file: `migrations/0002_add_split_name_fields.sql`

```sql
ALTER TABLE signups ADD COLUMN first_name TEXT;
ALTER TABLE signups ADD COLUMN last_name TEXT;
ALTER TABLE signups ADD COLUMN house_number_addition TEXT;
ALTER TABLE signups ADD COLUMN marketing_consent_at TEXT;
```

**Migration strategy (Approach A — additive):**
- All new columns are nullable (old records keep existing data).
- `full_name` column stays in schema, becomes nullable for new records.
- New signups: `first_name` + `last_name` populated, `full_name` set to NULL.
- Old signups: `full_name` populated, `first_name` + `last_name` are NULL.
- No data transformation of existing records.

---

## 5. Backend Changes

### `functions/api/signup.ts`

**Request body changes:**
- Accept `first_name` (required, non-empty) instead of `full_name`
- Accept `last_name` (required, non-empty) instead of `full_name`
- Accept `house_number_addition` (optional string)
- Accept `marketing_consent` (boolean) — if true, store ISO timestamp in `marketing_consent_at`
- Do NOT expect `email_confirm` (client-only field)

**INSERT query:**
- Write `first_name`, `last_name`, `house_number_addition`, `marketing_consent_at`
- Set `full_name` to NULL

**Validation:**
- `first_name`: required, non-empty after trim
- `last_name`: required, non-empty after trim
- All other existing validations unchanged (email, phone, postcode, IBAN, etc.)

### `functions/api/_shared/email.ts`

**Customer email:**
- Greeting: "Hoi {first_name}" instead of "Hoi {full_name}"

**Owner notification email:**
- Name display: "{first_name} {last_name}"
- Address display: "{street} {house_number}{house_number_addition}" (addition appended directly, e.g. "Havendijk 12A")
- Include marketing consent status (ja/nee)

---

## 6. Client-Side Validation

### Step 2 field validation list

| Field | Validator |
|-------|-----------|
| `first_name` | non-empty |
| `last_name` | non-empty |
| `phone` | existing `validatePhone()` |
| `email` | existing `validateEmail()` |
| `email_confirm` | matches `email` value |
| `date_of_birth` | non-empty |
| `postcode` | existing `validatePostcode()` |
| `house_number` | non-empty |
| `house_number_addition` | no validation (optional) |
| `street` | non-empty |
| `city` | non-empty |
| `marketing_consent` | no validation (optional) |

### Blur validators

Updated to match new field list. Same pattern as existing: validate on blur, show/clear error.

### LocalStorage draft

Update `fitcity-signup-draft` key to persist new field names. Drop `full_name`, add `first_name`, `last_name`, `house_number_addition`. Do NOT persist `email_confirm` — it should always be re-entered to serve its purpose.

---

## 7. Step 3 Review Card

**Personal column:**
- Name: `{first_name} {last_name}`
- DOB: unchanged
- Email: unchanged
- Phone: unchanged

**Address column:**
- Address line: `{street} {house_number}{house_number_addition}` (e.g. "Havendijk 12A")
- Zip/city: `{postcode}, {city}` (unchanged format)

---

## 8. Edit Drawer

The existing edit drawer (bottom sheet mobile, side panel desktop) has two sections triggered by "Wijzigen" buttons.

### Personal section (`drawer-section-personal`)

Replace `drawer-full_name` with:
- `drawer-first_name` (Voornaam)
- `drawer-last_name` (Achternaam)
- `drawer-phone` (Telefoon)
- `drawer-email` (E-mail)
- `drawer-date_of_birth` (Geboortedatum)

No email confirm field in the drawer — it's an edit, not initial entry.

### Address section (`drawer-section-address`)

Remove `.form-row` wrappers — each field on its own line:
- `drawer-postcode` (Postcode)
- `drawer-house_number` (Huisnummer)
- `drawer-house_number_addition` (Huisnummer toevoeging)
- `drawer-street` (Straatnaam)
- `drawer-city` (Stad)

PDOK auto-fill also works in the drawer (same lookup on postcode + huisnummer change).

### Save behavior

"Opslaan en sluiten" syncs drawer values back to hidden step 2 form fields, then updates the review card display. Same pattern as current implementation, updated for new field names.

---

## Out of Scope

- Admin panel changes (can read both old `full_name` and new split fields as-is)
- Migrating existing `full_name` data into split fields
- Changes to step 1 (plan selection) or step 3 (IBAN/consent) beyond the review card
