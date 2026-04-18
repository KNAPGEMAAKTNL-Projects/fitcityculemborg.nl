# FitCity Culemborg — New Cloudflare Pages Deployment Setup

> **Use this document when connecting this codebase to a new Cloudflare Pages project.**
> The project is already built and pushed to GitHub. This is about wiring up the infrastructure.
> Claude has access to Cloudflare MCP — use it for all Cloudflare steps below.

---

## Context

This is the FitCity Culemborg website. It is a static Astro site deployed on Cloudflare Pages with:
- **Cloudflare Pages Functions** handling signup, contact, and admin APIs
- **D1 database** (`fitcity-production`) for signups and contact messages
- **Resend** for transactional email (signup confirmation + owner notification)
- **Cloudflare Turnstile** for bot protection on forms
- **Cloudflare Zero Trust** to protect the `/admin/` route

---

## Step 1 — Cloudflare account

Start by setting the active account:

```
Call set_active_account with account ID: d956a8df0362c9ffc0663196ddd51ba4
```

Confirm it is set before proceeding.

---

## Step 2 — Create GitHub repo

Create a new GitHub repo under the `KNAPGEMAAKTNL-Projects` organisation:
- Name: `fitcityculemborg.nl`
- Visibility: private
- Do NOT initialise with README or .gitignore (the code is already here)

Then add it as a remote and push:

```bash
git remote add origin-new https://github.com/KNAPGEMAAKTNL-Projects/fitcityculemborg.nl.git
git push origin-new master
```

Confirm the push succeeded and all commits are present on the new remote.

---

## Step 3 — Create Cloudflare Pages project

Create a new Pages project via the Cloudflare dashboard (cannot be done via MCP — instruct the user):

1. Go to Cloudflare Dashboard → Workers & Pages → Create
2. Connect to Git → select `KNAPGEMAAKTNL-Projects/fitcityculemborg.nl`
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Do NOT save yet — configure environment variables first (Step 4)

---

## Step 4 — Environment variables

These must be set in Cloudflare Pages → Settings → Environment Variables.
Set all of them for **both Production and Preview** unless noted.

| Variable | Where to get it | Notes |
|---|---|---|
| `ENCRYPTION_SECRET` | `.dev.vars` in this repo | Used for IBAN AES-256-GCM encryption — **must match** what was used to encrypt existing DB records |
| `RESEND_API_KEY` | `.dev.vars` in this repo | Resend dashboard if rotating |
| `TURNSTILE_SECRET_KEY` | Cloudflare Dashboard → Turnstile | Check if existing site key covers new domain, or create new widget |

**Check via MCP:**
- Verify a Turnstile widget exists for `fitcityculemborg.nl` (or is set to "Allow all origins"). If not, create one and note both Site Key and Secret Key.
- Check that the existing Resend API key is valid and active.

**After setting variables**, save and trigger a deployment.

---

## Step 5 — D1 database binding

The D1 database `fitcity-production` already exists (ID: `5fa22170-0cee-45c2-8f0d-d0222829cdcb`).

**Check via MCP:**
```
List D1 databases and confirm fitcity-production exists with that ID.
```

In the Pages project settings → Functions → D1 database bindings:
- Variable name: `DB`
- D1 database: `fitcity-production`

**IMPORTANT:** Do NOT create a new database. The existing database has live customer data (signups + contacts). If this is a fresh start with a clean database, explicitly confirm with the user first.

---

## Step 6 — Database migrations

Check which migrations have already been applied vs what exists in `/migrations`:

```bash
# Migrations in this repo:
# 0001_create_tables.sql           — base tables (signups + contacts)
# 0002_add_split_name_fields.sql   — adds first_name, last_name, house_number_addition, marketing_consent_at to signups
# 0003_create_archive_tables.sql   — adds signups_archive and contacts_archive + indexes for soft-delete + 12-month auto-prune
```

**If using the existing `fitcity-production` database:** all migrations are already applied — skip this step.

**If using a fresh/new database:** apply all migrations in order via wrangler:
```bash
npx wrangler d1 migrations apply fitcity-production --remote
```

Confirm the `signups` table has columns: `id`, `plan_slug`, `plan_name`, `plan_price`, `plan_duration`, `full_name`, `email`, `phone`, `date_of_birth`, `street`, `house_number`, `postcode`, `city`, `iban_encrypted`, `paid_in_person`, `admin_notes`, `created_at`.

---

## Step 7 — Resend email verification

**Check via Resend dashboard (user must do this — no MCP):**

The emails are sent from:
- **From:** `Rachid van Fitcity Culemborg <info@knapgemaakt.nl>`
- **Owner notifications to:** `yannick@knapgemaakt.nl`

Verify:
- [ ] `knapgemaakt.nl` domain is verified in Resend (DMARC/DKIM/SPF records present)
- [ ] Sending from `info@knapgemaakt.nl` is authorised under that domain
- [ ] The `RESEND_API_KEY` has permission to send from `knapgemaakt.nl`

If the domain on the new deployment changes (e.g. moving to `fitcityculemborg.nl` as sender), the From address in `functions/api/_shared/email.ts` lines 10–13 must be updated:
```ts
const FROM_EMAIL = 'Rachid van Fitcity Culemborg <info@knapgemaakt.nl>';
const OWNER_EMAIL = 'yannick@knapgemaakt.nl';
const ADMIN_URL = 'https://fitcityculemborg.knapgemaakt.nl/admin/';
const SITE_URL = 'https://fitcityculemborg.knapgemaakt.nl';
```

---

## Step 7b — Archive-prune cron worker

The admin dashboard soft-deletes signups and contacts into `*_archive` tables. A separate Cloudflare Worker runs daily at 03:17 UTC to permanently delete archive rows older than 12 months.

Deploy the worker from its subdirectory (first time and on every change):

```bash
cd cron-worker
npm install
npx wrangler deploy
```

The worker reuses the same D1 database (`fitcity-production`, id `5fa22170-0cee-45c2-8f0d-d0222829cdcb`). Only the `DB` binding is required — no email or auth secrets.

**Verify the schedule is active:**
- Cloudflare dashboard → Workers & Pages → `fitcity-archive-prune` → Triggers → Cron Triggers → confirm `17 3 * * *`.
- Logs: after the first 03:17 UTC run, you should see `prune complete { signupsPruned: N, contactsPruned: M }`.

**Manual test (without waiting):**
```bash
cd cron-worker
npx wrangler dev --test-scheduled
# in another terminal:
curl "http://localhost:8787/__scheduled?cron=17+3+*+*+*"
```

---

## Step 8 — Custom domain

In Cloudflare Pages → Custom domains:
- Add `fitcityculemborg.nl` (or `www.fitcityculemborg.nl`)
- Cloudflare will auto-create the DNS records since the domain is on Cloudflare

**Check via MCP:**
```
Check if fitcityculemborg.nl is a Cloudflare zone and confirm the nameservers are active.
```

If the domain is not yet a Cloudflare zone, the user must add it first.

After the custom domain is active, update the hardcoded URLs in `email.ts` (Step 7) if they differ.

---

## Step 9 — Zero Trust for admin routes

The `/admin/` pages must be protected. Set up Cloudflare Access:

1. Go to Cloudflare Zero Trust → Access → Applications → Add application
2. Type: **Self-hosted**
3. Application name: `FitCity Admin`
4. Session duration: 24 hours
5. Application domain: `fitcityculemborg.nl` (or the Pages URL) → Path: `/admin/*`
6. Policy:
   - Action: Allow
   - Include: Emails → `yannick@knapgemaakt.nl` (add Rachid's email too if needed)
7. Authentication: One-time PIN (OTP) via email is simplest

**Check via MCP:**
```
Check if a Zero Trust application already exists for the fitcityculemborg admin path.
If yes, update the domain to point to the new Pages URL.
If no, guide through creating it.
```

---

## Step 10 — Verification checklist

After deployment, verify each of the following:

### Site
- [ ] Homepage loads at the new domain
- [ ] All pages render correctly (check `/inschrijven/`, `/contact/`, `/kickboxing/`, `/fitness/`, `/ladies-only/`)
- [ ] No 404s on internal navigation

### Forms
- [ ] Contact form submits successfully (Turnstile passes, email received at `yannick@knapgemaakt.nl`)
- [ ] Signup form submits successfully (confirmation email received by test address, owner notification received)
- [ ] Form validation works (try submitting empty / invalid IBAN)

### Admin
- [ ] `/admin/` redirects to Cloudflare Access login
- [ ] After OTP login, admin dashboard loads
- [ ] Signups table shows data
- [ ] Contacts table shows data
- [ ] IBAN decrypt button works (proves `ENCRYPTION_SECRET` is correct)

### Database
- [ ] Submit a test signup and verify the row appears in D1 via Cloudflare dashboard
- [ ] Verify `iban_encrypted` field is populated (not null)

### Email
- [ ] Signup confirmation email arrives with correct content (plan name, next steps)
- [ ] Owner notification email arrives with "BEKIJK IN ADMIN" button linking to the right URL

---

## Hardcoded values to update after domain change

If the deployment domain changes from `fitcityculemborg.knapgemaakt.nl` to something else, update these:

| File | Line | Current value |
|---|---|---|
| `functions/api/_shared/email.ts` | 12 | `ADMIN_URL = 'https://fitcityculemborg.knapgemaakt.nl/admin/'` |
| `functions/api/_shared/email.ts` | 13 | `SITE_URL = 'https://fitcityculemborg.knapgemaakt.nl'` |
| `functions/api/_shared/email.ts` | 14 | `LOGO_URL = 'https://fitcityculemborg.knapgemaakt.nl/images/fitcity-logo.webp'` |

---

## Secrets reference (for `.dev.vars` local dev)

```
ENCRYPTION_SECRET=         # from existing .dev.vars — do not regenerate (would break existing DB records)
RESEND_API_KEY=            # from Resend dashboard
TURNSTILE_SECRET_KEY=      # from Cloudflare Turnstile widget settings
APP_BASE_URL=http://localhost:8788
```

**Never commit `.dev.vars` — it is gitignored.**
