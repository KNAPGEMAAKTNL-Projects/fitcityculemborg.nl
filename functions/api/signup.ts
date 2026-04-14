import type { Env, SignupRequest } from './_shared/types';
import { encrypt, maskIBAN } from './_shared/encryption';
import {
  sanitize,
  validateEmail,
  validatePhone,
  validatePostcode,
  normalizePostcode,
  validateIBAN,
  isValidPlanSlug,
  getPlanDetails,
  verifyTurnstile,
  validateAge,
  hashIP,
} from './_shared/validation';
import { sendSignupCustomerEmail, sendSignupOwnerEmail } from './_shared/email';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as SignupRequest;

    // Honeypot check — silent reject
    if (body.honeypot) {
      return jsonResponse({ success: true });
    }

    // Turnstile verification
    const clientIP = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const turnstileToken = body.cf_turnstile_response ?? '';
    if (!turnstileToken || !await verifyTurnstile(turnstileToken, context.env.TURNSTILE_SECRET_KEY, clientIP)) {
      return jsonResponse({ error: 'Verificatie mislukt. Vernieuw de pagina en probeer het opnieuw.' }, 403);
    }

    // Validate plan slug first — reject early before processing other fields
    const planSlug = sanitize(body.plan_slug ?? '');
    if (!isValidPlanSlug(planSlug)) {
      return jsonResponse(
        { error: 'Ongeldig abonnement geselecteerd.', field: 'plan_slug' },
        400
      );
    }

    // Look up canonical plan details server-side — never trust client-sent prices
    const plan = getPlanDetails(planSlug)!;

    // Sanitize all string inputs
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

    // Validate required fields are non-empty
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

    for (const [value, field] of requiredStringFields) {
      if (!value) {
        return jsonResponse(
          { error: `Veld '${field}' is verplicht.`, field },
          400
        );
      }
    }

    // Validate email
    if (!validateEmail(data.email)) {
      return jsonResponse(
        { error: 'Ongeldig e-mailadres.', field: 'email' },
        400
      );
    }

    // Validate phone
    if (!validatePhone(data.phone)) {
      return jsonResponse(
        { error: 'Ongeldig telefoonnummer. Gebruik 10-12 cijfers.', field: 'phone' },
        400
      );
    }

    // Validate postcode
    if (!validatePostcode(data.postcode)) {
      return jsonResponse(
        { error: 'Ongeldige postcode. Gebruik formaat 1234 AB.', field: 'postcode' },
        400
      );
    }
    data.postcode = normalizePostcode(data.postcode);

    // Validate age (minimum 12 per terms)
    if (!validateAge(data.date_of_birth, 12)) {
      return jsonResponse(
        { error: 'Ongeldige geboortedatum of je moet minimaal 12 jaar zijn.', field: 'date_of_birth' },
        400
      );
    }

    // Validate IBAN
    if (!validateIBAN(data.iban)) {
      return jsonResponse(
        { error: 'Ongeldig IBAN-nummer.', field: 'iban' },
        400
      );
    }

    // Validate all three consents
    if (!data.privacy_consent || !data.sepa_consent || !data.terms_consent) {
      return jsonResponse(
        { error: 'Alle toestemmingen zijn verplicht.' },
        400
      );
    }

    // Rate limit: hash IP and check
    const ipHash = await hashIP(clientIP);

    const rateLimitResult = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM signups WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')"
    )
      .bind(ipHash)
      .first<{ count: number }>();

    if (rateLimitResult && rateLimitResult.count >= 3) {
      return jsonResponse(
        { error: 'Te veel aanmeldingen. Probeer het over een uur opnieuw.' },
        429
      );
    }

    // Email uniqueness check
    const existingEmail = await context.env.DB.prepare(
      'SELECT id FROM signups WHERE email = ?'
    )
      .bind(data.email)
      .first();

    if (existingEmail) {
      return jsonResponse(
        {
          error:
            'Dit e-mailadres is al geregistreerd. Neem contact op als je een nieuw abonnement wilt afsluiten.',
          field: 'email',
        },
        400
      );
    }

    // Encrypt IBAN and generate masked version
    const ibanEncrypted = await encrypt(data.iban, context.env.ENCRYPTION_SECRET);
    const ibanMasked = maskIBAN(data.iban);

    // Consent timestamps
    const consentTimestamp = new Date().toISOString();

    // Marketing consent timestamp (only set if opted in)
    const marketingConsentAt = data.marketing_consent ? consentTimestamp : null;

    // Insert into D1
    // full_name is kept for backwards compatibility (NOT NULL constraint)
    const fullName = `${data.first_name} ${data.last_name}`;
    await context.env.DB.prepare(
      `INSERT INTO signups (
        plan_slug, plan_name, plan_price, plan_duration,
        full_name, first_name, last_name, email, phone, date_of_birth,
        street, house_number, house_number_addition, postcode, city,
        iban_encrypted, iban_masked, account_holder,
        privacy_consent_at, sepa_consent_at, terms_consent_at,
        marketing_consent_at, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        data.plan_slug,
        data.plan_name,
        data.plan_price,
        data.plan_duration,
        fullName,
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

    // Send confirmation emails (non-blocking — don't fail the request)
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

    return jsonResponse({ success: true, message: 'Inschrijving ontvangen' });
  } catch (err) {
    console.error('Signup error:', err);
    return jsonResponse(
      { error: 'Er is een serverfout opgetreden. Probeer het later opnieuw.' },
      500
    );
  }
};
