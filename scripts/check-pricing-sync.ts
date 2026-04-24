/**
 * Ensures src/data/pricing.ts and functions/api/_shared/validation.ts stay
 * aligned on slug, name, price, duration, plan type, and the inschrijfkosten
 * constant. Run via `npm run check:pricing` (also wired to prebuild).
 *
 * These two files exist in parallel because Cloudflare Pages Functions can't
 * import from src/. When they drift, the signup API returns "Ongeldig
 * abonnement" at submit -- a user-facing failure. This check moves that
 * failure to build time.
 */

import { pricingPlans, signupExtras, INSCHRIJFKOSTEN_DISPLAY as UI_INSCHRIJF } from '../src/data/pricing';
import * as validation from '../functions/api/_shared/validation';

type Expected = { slug: string; name: string; price: string; duration: string; type: string };

const expected: Expected[] = [];
for (const group of Object.values(pricingPlans)) {
  for (const p of group) {
    if (p.unavailable) continue;
    expected.push({ slug: p.slug, name: p.name, price: p.price, duration: p.duration, type: p.type });
  }
}
for (const e of signupExtras) {
  expected.push({ slug: e.slug, name: e.name, price: e.price, duration: e.duration, type: e.type });
}

const errors: string[] = [];

// INSCHRIJFKOSTEN_DISPLAY is exported from both; they must match.
if (UI_INSCHRIJF !== validation.INSCHRIJFKOSTEN_DISPLAY) {
  errors.push(
    `INSCHRIJFKOSTEN_DISPLAY mismatch: pricing.ts="${UI_INSCHRIJF}" vs validation.ts="${validation.INSCHRIJFKOSTEN_DISPLAY}"`,
  );
}

for (const want of expected) {
  const got = validation.getPlanDetails(want.slug);
  if (!got) {
    errors.push(`Slug "${want.slug}" present in pricing.ts but missing from PLAN_CATALOG in validation.ts`);
    continue;
  }
  if (got.name !== want.name) errors.push(`${want.slug}: name mismatch pricing.ts="${want.name}" vs validation.ts="${got.name}"`);
  if (got.price !== want.price) errors.push(`${want.slug}: price mismatch pricing.ts="${want.price}" vs validation.ts="${got.price}"`);
  if (got.duration !== want.duration) errors.push(`${want.slug}: duration mismatch pricing.ts="${want.duration}" vs validation.ts="${got.duration}"`);
  if (got.type !== want.type) errors.push(`${want.slug}: type mismatch pricing.ts="${want.type}" vs validation.ts="${got.type}"`);
}

if (errors.length > 0) {
  console.error('Pricing sources are out of sync:');
  for (const err of errors) console.error('  - ' + err);
  process.exit(1);
}

console.log(`Pricing sync OK (${expected.length} plans match across pricing.ts and validation.ts).`);
