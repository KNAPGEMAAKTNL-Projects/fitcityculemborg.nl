# Signup Form Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the signup form step 2 with sectioned layout, split name fields, PDOK postcode auto-fill, email confirmation, marketing consent, and all corresponding backend/DB changes.

**Architecture:** Additive migration adds 4 nullable columns to D1. Frontend form is reorganized into 3 sections with every field on its own line. PDOK Locatieserver (free, no-key government API) auto-fills street/city from postcode+huisnummer. Backend accepts new fields while remaining backwards-compatible with old `full_name` records.

**Tech Stack:** Astro 5 SSG, Cloudflare Pages Functions (D1, Workers), TypeScript, Tailwind CSS 4, PDOK Locatieserver API

**Spec:** `docs/superpowers/specs/2026-04-14-signup-form-restructure-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `migrations/0002_add_split_name_fields.sql` | Create | D1 schema migration — add 4 columns |
| `functions/api/_shared/types.ts` | Modify | Update `SignupRequest` interface |
| `functions/api/signup.ts` | Modify | Accept new fields, update INSERT query |
| `functions/api/_shared/email.ts` | Modify | Update email templates for split name |
| `src/pages/signup/index.astro` | Modify | Form HTML, CSS, and all client-side JS |

---

### Task 1: D1 Migration

**Files:**
- Create: `migrations/0002_add_split_name_fields.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Add split name fields, house number addition, and marketing consent
-- Existing records keep full_name; new records use first_name + last_name
ALTER TABLE signups ADD COLUMN first_name TEXT;
ALTER TABLE signups ADD COLUMN last_name TEXT;
ALTER TABLE signups ADD COLUMN house_number_addition TEXT;
ALTER TABLE signups ADD COLUMN marketing_consent_at TEXT;
```

Write this to `migrations/0002_add_split_name_fields.sql`.

- [ ] **Step 2: Run migration against remote D1**

```bash
npx wrangler d1 migrations apply fitcity-production --remote
```

Expected: Migration applied successfully. The 4 new nullable columns are added to the `signups` table.

- [ ] **Step 3: Verify migration**

```bash
npx wrangler d1 execute fitcity-production --remote --command "PRAGMA table_info(signups);"
```

Expected: Output includes `first_name`, `last_name`, `house_number_addition`, and `marketing_consent_at` columns, all with `notnull = 0` (nullable).

- [ ] **Step 4: Commit**

```bash
git add migrations/0002_add_split_name_fields.sql
git commit -m "feat: add D1 migration for split name fields and marketing consent"
```

---

### Task 2: Update TypeScript Types

**Files:**
- Modify: `functions/api/_shared/types.ts`

- [ ] **Step 1: Update SignupRequest interface**

In `functions/api/_shared/types.ts`, replace the `SignupRequest` interface:

```typescript
export interface SignupRequest {
  plan_slug: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  street: string;
  house_number: string;
  house_number_addition?: string;
  postcode: string;
  city: string;
  iban: string;
  account_holder: string;
  privacy_consent: boolean;
  sepa_consent: boolean;
  terms_consent: boolean;
  marketing_consent?: boolean;
  honeypot?: string;
  cf_turnstile_response?: string;
}
```

Changes: `full_name` removed, `first_name` + `last_name` added, `house_number_addition` added (optional), `marketing_consent` added (optional boolean).

- [ ] **Step 2: Commit**

```bash
git add functions/api/_shared/types.ts
git commit -m "feat: update SignupRequest type for split name fields"
```

---

### Task 3: Update Backend Signup Handler

**Files:**
- Modify: `functions/api/signup.ts:58-90` (data sanitization) and `192-223` (INSERT query) and `229-247` (email calls)

- [ ] **Step 1: Update data sanitization block**

Replace the `data` object construction (lines 58-76) with:

```typescript
    const data = {
      plan_slug: planSlug,
      plan_name: plan.name,
      plan_price: plan.price,
      plan_duration: plan.duration,
      first_name: sanitize(body.first_name ?? '', 100),
      last_name: sanitize(body.last_name ?? '', 100),
      email: sanitize(body.email ?? '', 255).toLowerCase(),
      phone: sanitize(body.phone ?? '', 20),
      date_of_birth: sanitize(body.date_of_birth ?? '', 10),
      street: sanitize(body.street ?? '', 200),
      house_number: sanitize(body.house_number ?? '', 20),
      house_number_addition: sanitize(body.house_number_addition ?? '', 20),
      postcode: sanitize(body.postcode ?? '', 10),
      city: sanitize(body.city ?? '', 100),
      iban: sanitize(body.iban ?? '', 34),
      account_holder: sanitize(body.account_holder ?? '', 100),
      privacy_consent: body.privacy_consent,
      sepa_consent: body.sepa_consent,
      terms_consent: body.terms_consent,
      marketing_consent: body.marketing_consent ?? false,
    };
```

- [ ] **Step 2: Update required fields validation**

Replace the `requiredStringFields` array (lines 79-90) with:

```typescript
    const requiredStringFields: Array<[string, string]> = [
      [data.first_name, 'first_name'],
      [data.last_name, 'last_name'],
      [data.email, 'email'],
      [data.phone, 'phone'],
      [data.date_of_birth, 'date_of_birth'],
      [data.street, 'street'],
      [data.house_number, 'house_number'],
      [data.postcode, 'postcode'],
      [data.city, 'city'],
      [data.iban, 'iban'],
      [data.account_holder, 'account_holder'],
    ];
```

- [ ] **Step 3: Update D1 INSERT query**

Replace the INSERT statement (lines 192-223) with:

```typescript
    const marketingConsentAt = data.marketing_consent ? consentTimestamp : null;

    await context.env.DB.prepare(
      `INSERT INTO signups (
        plan_slug, plan_name, plan_price, plan_duration,
        first_name, last_name, email, phone, date_of_birth,
        street, house_number, house_number_addition, postcode, city,
        iban_encrypted, iban_masked, account_holder,
        privacy_consent_at, sepa_consent_at, terms_consent_at,
        marketing_consent_at, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        data.plan_slug,
        data.plan_name,
        data.plan_price,
        data.plan_duration,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.date_of_birth,
        data.street,
        data.house_number,
        data.house_number_addition || null,
        data.postcode,
        data.city,
        ibanEncrypted,
        ibanMasked,
        data.account_holder,
        consentTimestamp,
        consentTimestamp,
        consentTimestamp,
        marketingConsentAt,
        ipHash
      )
      .run();
```

Note: `full_name` is not written — it stays NULL for new records. Old records keep their existing `full_name` value.

- [ ] **Step 4: Update email function calls**

Replace the email calls (lines 229-247) with:

```typescript
    if (context.env.RESEND_API_KEY) {
      context.waitUntil(
        Promise.allSettled([
          sendSignupCustomerEmail(context.env.RESEND_API_KEY, {
            first_name: data.first_name,
            email: data.email,
            plan_name: data.plan_name,
            plan_price: data.plan_price,
            plan_duration: data.plan_duration,
          }),
          sendSignupOwnerEmail(context.env.RESEND_API_KEY, {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            plan_name: data.plan_name,
            plan_price: data.plan_price,
            plan_duration: data.plan_duration,
            date_of_birth: data.date_of_birth,
            street: data.street,
            house_number: data.house_number,
            house_number_addition: data.house_number_addition,
            city: data.city,
            marketing_consent: data.marketing_consent,
          }),
        ])
      );
    }
```

- [ ] **Step 5: Commit**

```bash
git add functions/api/signup.ts
git commit -m "feat: update signup handler for split name fields and marketing consent"
```

---

### Task 4: Update Email Templates

**Files:**
- Modify: `functions/api/_shared/email.ts`

- [ ] **Step 1: Update customer email function signature and template**

Replace `sendSignupCustomerEmail` (lines 388-397) and `signupCustomerHtml` (lines 242-296):

Change `signupCustomerHtml` parameter type and greeting (line 242-250):

```typescript
function signupCustomerHtml(data: {
  first_name: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
}): string {
  const content = `
    ${heading('Welkom bij Fitcity Culemborg')}
    ${greeting(data.first_name)}
```

(Rest of `signupCustomerHtml` stays identical.)

Change `sendSignupCustomerEmail` (lines 388-397):

```typescript
export async function sendSignupCustomerEmail(
  apiKey: string,
  data: { first_name: string; email: string; plan_name: string; plan_price: string; plan_duration: string }
): Promise<boolean> {
  return sendEmail(apiKey, {
    to: data.email,
    subject: 'Welkom bij Fitcity Culemborg!',
    html: signupCustomerHtml(data),
  });
}
```

- [ ] **Step 2: Update owner email function signature and template**

Replace `signupOwnerHtml` parameter type and details (lines 299-329):

```typescript
function signupOwnerHtml(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
  date_of_birth: string;
  street: string;
  house_number: string;
  house_number_addition: string;
  city: string;
  marketing_consent: boolean;
  created_at: string;
}): string {
  const fullName = `${data.first_name} ${data.last_name}`;
  const address = `${data.street} ${data.house_number}${data.house_number_addition || ''}`;
  const content = `
    ${heading('Nieuwe Aanmelding')}
    ${paragraph('Er is een nieuwe inschrijving binnengekomen via de website.')}

    ${detailsTable([
      ['Naam', fullName],
      ['E-mail', data.email],
      ['Telefoon', data.phone],
      ['Geboortedatum', data.date_of_birth],
      ['Adres', address],
      ['Woonplaats', data.city],
      ['Abonnement', data.plan_name],
      ['Prijs', data.plan_price],
      ['Looptijd', data.plan_duration],
      ['Marketing', data.marketing_consent ? 'Ja' : 'Nee'],
      ['Datum', data.created_at],
    ])}

    ${primaryButton('BEKIJK IN ADMIN', ADMIN_URL)}
  `;
  return emailWrapper(content);
}
```

Replace `sendSignupOwnerEmail` (lines 399-419):

```typescript
export async function sendSignupOwnerEmail(
  apiKey: string,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    plan_name: string;
    plan_price: string;
    plan_duration: string;
    date_of_birth: string;
    street: string;
    house_number: string;
    house_number_addition: string;
    city: string;
    marketing_consent: boolean;
  }
): Promise<boolean> {
  const now = new Date();
  const created_at = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const fullName = `${data.first_name} ${data.last_name}`;
  return sendEmail(apiKey, {
    to: OWNER_EMAIL,
    subject: `Nieuwe aanmelding: ${data.plan_name} — ${fullName}`,
    html: signupOwnerHtml({ ...data, created_at }),
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add functions/api/_shared/email.ts
git commit -m "feat: update email templates for split name fields"
```

---

### Task 5: Restructure Form HTML (Step 2)

**Files:**
- Modify: `src/pages/signup/index.astro:194-248` (step 2 form fields and button)

- [ ] **Step 1: Replace step 2 form HTML**

Replace lines 194-248 (from `<h2 class="step-title...">2. Jouw gegevens</h2>` through the `<button>NAAR AFRONDEN</button>`) with:

```html
          <h2 class="step-title step-title--left">2. Jouw gegevens</h2>

          <h3 class="form-section-title">Persoonlijke gegevens</h3>
          <div class="form-fields">
            <div class="form-field">
              <label for="first_name">Voornaam <span class="required">*</span></label>
              <input type="text" id="first_name" name="first_name" required autocomplete="given-name" />
              <p class="form-error" data-error="first_name">Dit veld is verplicht.</p>
            </div>

            <div class="form-field">
              <label for="last_name">Achternaam <span class="required">*</span></label>
              <input type="text" id="last_name" name="last_name" required autocomplete="family-name" />
              <p class="form-error" data-error="last_name">Dit veld is verplicht.</p>
            </div>

            <div class="form-field">
              <label for="phone">Telefoon <span class="required">*</span></label>
              <input type="tel" id="phone" name="phone" required autocomplete="tel" />
              <p class="form-error" data-error="phone">Dit veld is verplicht.</p>
            </div>

            <div class="form-field">
              <label for="email">E-mail <span class="required">*</span></label>
              <input type="email" id="email" name="email" required autocomplete="email" />
              <p class="form-error" data-error="email">Vul een geldig e-mailadres in.</p>
            </div>

            <div class="form-field">
              <label for="email_confirm">Bevestig e-mail <span class="required">*</span></label>
              <input type="email" id="email_confirm" name="email_confirm" required autocomplete="off" />
              <p class="form-error" data-error="email_confirm">E-mailadressen komen niet overeen.</p>
            </div>

            <div class="form-field">
              <label for="date_of_birth">Geboortedatum <span class="required">*</span></label>
              <input type="date" id="date_of_birth" name="date_of_birth" required class="date-input" />
              <p class="form-error" data-error="date_of_birth">Vul een geldige datum in.</p>
            </div>
          </div>

          <h3 class="form-section-title">Adresgegevens</h3>
          <div class="form-fields">
            <div class="form-field">
              <label for="postcode">Postcode <span class="required">*</span></label>
              <input type="text" id="postcode" name="postcode" required placeholder="1234 AB" autocomplete="postal-code" />
              <p class="form-error" data-error="postcode">Ongeldige postcode (1234 AB).</p>
            </div>

            <div class="form-field">
              <label for="house_number">Huisnummer <span class="required">*</span></label>
              <input type="text" id="house_number" name="house_number" required />
              <p class="form-error" data-error="house_number">Dit veld is verplicht.</p>
            </div>

            <div class="form-field">
              <label for="house_number_addition">Huisnummer toevoeging</label>
              <input type="text" id="house_number_addition" name="house_number_addition" placeholder="bijv. A, 3-hoog" />
            </div>

            <div class="form-field">
              <label for="street">Straatnaam <span class="required">*</span></label>
              <input type="text" id="street" name="street" required autocomplete="street-address" />
              <p class="form-error" data-error="street">Dit veld is verplicht.</p>
            </div>

            <div class="form-field">
              <label for="city">Stad <span class="required">*</span></label>
              <input type="text" id="city" name="city" required autocomplete="address-level2" />
              <p class="form-error" data-error="city">Dit veld is verplicht.</p>
            </div>
          </div>

          <h3 class="form-section-title">Communicatie</h3>
          <div class="form-fields">
            <label class="consent-label">
              <input type="checkbox" name="marketing_consent" id="marketing_consent" />
              <span>Ja, Fitcity Culemborg mag mij informatie sturen over openingstijden, updates en aanbiedingen.</span>
            </label>
          </div>

          <button type="button" class="btn-primary-full" id="btn-to-step3">NAAR AFRONDEN</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: restructure step 2 form HTML with sections and new fields"
```

---

### Task 6: Add Section Title CSS

**Files:**
- Modify: `src/pages/signup/index.astro` (CSS section, after `.step-subtitle` styles)

- [ ] **Step 1: Add form section title styles**

Add after the existing `.step-subtitle` CSS block (around line 575):

```css
  .form-section-title {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-top: 2rem;
    margin-bottom: 0.25rem;
  }

  .form-section-title:first-of-type {
    margin-top: 0;
  }
```

- [ ] **Step 2: Remove `.form-row` and fractional width CSS**

Remove these CSS rules (they are no longer used since all fields are on their own line):

```css
  .form-row { display: flex; gap: 1rem; }
  .form-row > .form-field { min-width: 0; }
  .form-field--2-3 { flex: 2; }
  .form-field--1-3 { flex: 1; }
  .form-field--2-5 { flex: 2; }
  .form-field--3-5 { flex: 3; }
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: add form section title CSS, remove unused form-row styles"
```

---

### Task 7: Update Edit Drawer HTML

**Files:**
- Modify: `src/pages/signup/index.astro:374-412` (drawer field sections)

- [ ] **Step 1: Replace personal drawer section**

Replace `drawer-section-personal` (lines 374-391) with:

```html
        <div id="drawer-section-personal" class="drawer-fields">
          <div class="form-field">
            <label>Voornaam</label>
            <input type="text" id="drawer-first_name" />
          </div>
          <div class="form-field">
            <label>Achternaam</label>
            <input type="text" id="drawer-last_name" />
          </div>
          <div class="form-field">
            <label>Telefoon</label>
            <input type="tel" id="drawer-phone" />
          </div>
          <div class="form-field">
            <label>E-mail</label>
            <input type="email" id="drawer-email" />
          </div>
          <div class="form-field">
            <label>Geboortedatum</label>
            <input type="date" id="drawer-date_of_birth" class="date-input" />
          </div>
        </div>
```

- [ ] **Step 2: Replace address drawer section**

Replace `drawer-section-address` (lines 392-412) with:

```html
        <div id="drawer-section-address" class="drawer-fields" style="display:none;">
          <div class="form-field">
            <label>Postcode</label>
            <input type="text" id="drawer-postcode" />
          </div>
          <div class="form-field">
            <label>Huisnummer</label>
            <input type="text" id="drawer-house_number" />
          </div>
          <div class="form-field">
            <label>Huisnummer toevoeging</label>
            <input type="text" id="drawer-house_number_addition" />
          </div>
          <div class="form-field">
            <label>Straatnaam</label>
            <input type="text" id="drawer-street" />
          </div>
          <div class="form-field">
            <label>Stad</label>
            <input type="text" id="drawer-city" />
          </div>
        </div>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: update edit drawer HTML for split name and address fields"
```

---

### Task 8: Update Client-Side JavaScript — Field Lists and Validation

**Files:**
- Modify: `src/pages/signup/index.astro` (script section)

- [ ] **Step 1: Update PERSISTED_FIELDS**

Replace the `PERSISTED_FIELDS` array (line 1181-1186) with:

```typescript
  const PERSISTED_FIELDS = [
    'plan_slug', 'plan_name', 'plan_price', 'plan_duration',
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
    'postcode', 'house_number', 'house_number_addition', 'street', 'city',
    'account_holder', 'iban'
  ];
```

Note: `email_confirm` is intentionally excluded — it must always be re-entered.

- [ ] **Step 2: Update step 2 validation**

Replace the step 2 validation block inside `validateStep` (lines 1433-1448) with:

```typescript
      if (step === 2) {
        const fields: { name: string; validate?: (v: string) => boolean }[] = [
          { name: 'first_name' },
          { name: 'last_name' },
          { name: 'phone', validate: validatePhone },
          { name: 'email', validate: validateEmail },
          { name: 'date_of_birth' },
          { name: 'postcode', validate: validatePostcode },
          { name: 'house_number' },
          { name: 'street' },
          { name: 'city' },
        ];
        for (const field of fields) {
          const el = form.elements.namedItem(field.name) as HTMLInputElement;
          if (!el) continue;
          const val = el.value.trim();
          let fieldValid = val !== '';
          if (fieldValid && field.validate) fieldValid = field.validate(val);
          if (!fieldValid) { setFieldError(field.name, true); valid = false; }
        }

        // Email confirm validation
        const emailEl = form.elements.namedItem('email') as HTMLInputElement;
        const confirmEl = form.elements.namedItem('email_confirm') as HTMLInputElement;
        if (emailEl && confirmEl) {
          if (!confirmEl.value.trim() || confirmEl.value.trim().toLowerCase() !== emailEl.value.trim().toLowerCase()) {
            setFieldError('email_confirm', true);
            valid = false;
          }
        }
      }
```

- [ ] **Step 3: Update blur validators**

Replace the `blurValidators` object (lines 1461-1472) with:

```typescript
    const blurValidators: Record<string, (el: HTMLInputElement) => boolean> = {
      first_name: (el) => el.value.trim() !== '',
      last_name: (el) => el.value.trim() !== '',
      email: (el) => el.value.trim() !== '' && validateEmail(el.value),
      phone: (el) => el.value.trim() !== '' && validatePhone(el.value),
      date_of_birth: (el) => el.value !== '',
      street: (el) => el.value.trim() !== '',
      house_number: (el) => el.value.trim() !== '',
      postcode: (el) => el.value.trim() !== '' && validatePostcode(el.value),
      city: (el) => el.value.trim() !== '',
      account_holder: (el) => el.value.trim() !== '',
      iban: (el) => el.value.trim() !== '' && validateIBAN(el.value),
    };
```

- [ ] **Step 4: Add email confirm blur validation**

Add after the blur validator registration loop (after line 1479):

```typescript
    // Email confirm — validate on blur only, clear error on input
    const emailConfirmEl = form.elements.namedItem('email_confirm') as HTMLInputElement | null;
    const emailMainEl = form.elements.namedItem('email') as HTMLInputElement | null;
    emailConfirmEl?.addEventListener('blur', () => {
      if (emailConfirmEl.value.trim() !== '') {
        const match = emailConfirmEl.value.trim().toLowerCase() === emailMainEl?.value.trim().toLowerCase();
        setFieldError('email_confirm', !match);
      }
    });
    emailConfirmEl?.addEventListener('input', () => setFieldError('email_confirm', false));
    // If user changes the main email after confirming, clear confirm error
    emailMainEl?.addEventListener('input', () => setFieldError('email_confirm', false));
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: update validation and persisted fields for new form structure"
```

---

### Task 9: Add PDOK Postcode Auto-fill

**Files:**
- Modify: `src/pages/signup/index.astro` (script section, after auto-format block)

- [ ] **Step 1: Add PDOK lookup function and event listeners**

Add after the IBAN auto-format block (after line 1500):

```typescript
    // ===================== PDOK POSTCODE AUTO-FILL =====================
    let pdokTimeout: ReturnType<typeof setTimeout> | null = null;

    async function lookupAddress(postcode: string, houseNumber: string, streetTarget: HTMLInputElement, cityTarget: HTMLInputElement) {
      const pc = postcode.replace(/\s+/g, '').toUpperCase();
      if (!/^\d{4}[A-Z]{2}$/.test(pc) || !houseNumber.trim()) return;

      try {
        const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=postcode:${pc}+and+huisnummer:${encodeURIComponent(houseNumber.trim())}&rows=1&fl=straatnaam,woonplaatsnaam`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (json.response?.numFound > 0) {
          const doc = json.response.docs[0];
          if (doc.straatnaam) streetTarget.value = doc.straatnaam;
          if (doc.woonplaatsnaam) cityTarget.value = doc.woonplaatsnaam;
          saveToStorage();
        }
      } catch {
        // Silent fallback — user fills fields manually
      }
    }

    function setupPdokLookup(postcodeId: string, houseNumberId: string, streetId: string, cityId: string) {
      const pcEl = document.getElementById(postcodeId) as HTMLInputElement | null;
      const hnEl = document.getElementById(houseNumberId) as HTMLInputElement | null;
      const stEl = document.getElementById(streetId) as HTMLInputElement | null;
      const ctEl = document.getElementById(cityId) as HTMLInputElement | null;
      if (!pcEl || !hnEl || !stEl || !ctEl) return;

      const trigger = () => {
        if (pdokTimeout) clearTimeout(pdokTimeout);
        pdokTimeout = setTimeout(() => lookupAddress(pcEl.value, hnEl.value, stEl, ctEl), 500);
      };

      pcEl.addEventListener('input', trigger);
      hnEl.addEventListener('input', trigger);
    }

    // Main form auto-fill
    setupPdokLookup('postcode', 'house_number', 'street', 'city');
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: add PDOK postcode auto-fill for street and city"
```

---

### Task 10: Update Drawer JavaScript and Review Card

**Files:**
- Modify: `src/pages/signup/index.astro` (script section)

- [ ] **Step 1: Update drawer field map**

Replace the `drawerFieldMap` object (lines 1505-1508) with:

```typescript
    const drawerFieldMap: Record<string, Record<string, string>> = {
      personal: {
        'drawer-first_name': 'first_name',
        'drawer-last_name': 'last_name',
        'drawer-phone': 'phone',
        'drawer-email': 'email',
        'drawer-date_of_birth': 'date_of_birth',
      },
      address: {
        'drawer-postcode': 'postcode',
        'drawer-house_number': 'house_number',
        'drawer-house_number_addition': 'house_number_addition',
        'drawer-street': 'street',
        'drawer-city': 'city',
      },
    };
```

- [ ] **Step 2: Add PDOK auto-fill for drawer address fields**

Add after the `setupPdokLookup('postcode', 'house_number', 'street', 'city');` line:

```typescript
    // Drawer auto-fill
    setupPdokLookup('drawer-postcode', 'drawer-house_number', 'drawer-street', 'drawer-city');
```

- [ ] **Step 3: Update the review card population**

Replace the review card population in `updateFinalReview` (lines 1408-1416) with:

```typescript
      set('review-name', `${get('first_name')} ${get('last_name')}`);
      set('review-email', get('email'));
      set('review-phone', get('phone'));

      const dob = get('date_of_birth');
      if (dob !== '—') { const [y, m, d] = dob.split('-'); set('review-dob', `${d}-${m}-${y}`); }

      const addition = get('house_number_addition');
      set('review-address', `${get('street')} ${get('house_number')}${addition}`);
      set('review-zipcity', `${get('postcode')} ${get('city')}`);
```

- [ ] **Step 4: Update form submission data**

Replace the form submission data collection (lines 1573-1582) with:

```typescript
        const data: Record<string, unknown> = {};
        for (const name of PERSISTED_FIELDS) {
          const el = form.elements.namedItem(name) as HTMLInputElement;
          if (el) data[name] = el.value;
        }
        data.honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value || '';
        data.privacy_consent = (form.elements.namedItem('privacy_consent') as HTMLInputElement).checked;
        data.terms_consent = (form.elements.namedItem('terms_consent') as HTMLInputElement).checked;
        data.sepa_consent = (form.elements.namedItem('sepa_consent') as HTMLInputElement).checked;
        data.marketing_consent = (form.elements.namedItem('marketing_consent') as HTMLInputElement)?.checked ?? false;
        data.cf_turnstile_response = signupTurnstileToken;
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/signup/index.astro
git commit -m "feat: update drawer, review card, and form submission for new fields"
```

---

### Task 11: End-to-End Smoke Test

**Files:** None (testing only)

- [ ] **Step 1: Build and start dev server**

```bash
npm run dev
```

Verify the dev server starts without errors.

- [ ] **Step 2: Test step 2 form visuals**

Open `http://localhost:4321/signup/` in a browser. Verify:
- Three section headings visible: "Persoonlijke gegevens", "Adresgegevens", "Communicatie"
- All fields on their own line, no side-by-side rows
- Marketing consent checkbox appears under "Communicatie"
- Every field has proper labels

- [ ] **Step 3: Test PDOK auto-fill**

Enter postcode `4101 AA` and huisnummer `1`. After ~500ms:
- "Straatnaam" should auto-fill with "Havendijk"
- "Stad" should auto-fill with "Culemborg"
- Fields should remain editable after auto-fill

- [ ] **Step 4: Test email confirmation**

- Enter an email, then enter a different email in confirm field
- Tab out of confirm field — error "E-mailadressen komen niet overeen" should appear
- Fix the confirm field to match — error should clear on blur

- [ ] **Step 5: Test validation**

Click "NAAR AFRONDEN" with empty fields. All required fields should show errors. Fill in all fields correctly and click again — should advance to step 3.

- [ ] **Step 6: Test edit drawer**

In step 3, click "Wijzigen" on personal details:
- Drawer should show Voornaam, Achternaam, Telefoon, E-mail, Geboortedatum
- Change a value, click "Opslaan en sluiten" — review card should update

Click "Wijzigen" on address:
- Drawer should show Postcode, Huisnummer, Huisnummer toevoeging, Straatnaam, Stad
- PDOK auto-fill should work in the drawer

- [ ] **Step 7: Test form submission**

Complete the full flow through step 3 and submit. Check:
- No JS console errors
- Backend accepts the new field structure
- Confirmation email shows first name greeting
- Owner notification shows split name and address with addition

- [ ] **Step 8: Push test branch**

```bash
git branch -f test/ios-date-input-overflow
git push -f origin-new test/ios-date-input-overflow
```

Test on the Cloudflare Pages preview URL before shipping.
