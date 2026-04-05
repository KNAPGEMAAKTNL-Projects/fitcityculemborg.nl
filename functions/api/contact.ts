import type { Env, ContactRequest } from './_shared/types';
import {
  sanitize,
  validateEmail,
  isValidSubject,
  hashIP,
} from './_shared/validation';

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
    const body = (await context.request.json()) as ContactRequest;

    // Honeypot check — silent reject
    if (body.honeypot) {
      return jsonResponse({ success: true });
    }

    // Sanitize all string inputs
    const data = {
      naam: sanitize(body.naam ?? ''),
      email: sanitize(body.email ?? '').toLowerCase(),
      onderwerp: sanitize(body.onderwerp ?? ''),
      bericht: sanitize(body.bericht ?? ''),
      privacy_consent: body.privacy_consent,
    };

    // Validate required fields
    const requiredFields: Array<[string, string]> = [
      [data.naam, 'naam'],
      [data.email, 'email'],
      [data.onderwerp, 'onderwerp'],
      [data.bericht, 'bericht'],
    ];

    for (const [value, field] of requiredFields) {
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

    // Validate subject
    if (!isValidSubject(data.onderwerp)) {
      return jsonResponse(
        { error: 'Ongeldig onderwerp geselecteerd.', field: 'onderwerp' },
        400
      );
    }

    // Validate privacy consent
    if (!data.privacy_consent) {
      return jsonResponse(
        { error: 'Privacytoestemming is verplicht.' },
        400
      );
    }

    // Rate limit: max 5 per IP per 15 minutes
    const clientIP = context.request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipHash = await hashIP(clientIP);

    const rateLimitResult = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM contacts WHERE ip_hash = ? AND created_at > datetime('now', '-15 minutes')"
    )
      .bind(ipHash)
      .first<{ count: number }>();

    if (rateLimitResult && rateLimitResult.count >= 5) {
      return jsonResponse(
        { error: 'Te veel berichten verstuurd. Probeer het over 15 minuten opnieuw.' },
        429
      );
    }

    // Consent timestamp
    const consentTimestamp = new Date().toISOString();

    // Insert into D1
    await context.env.DB.prepare(
      `INSERT INTO contacts (name, email, subject, message, privacy_consent_at, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        data.naam,
        data.email,
        data.onderwerp,
        data.bericht,
        consentTimestamp,
        ipHash
      )
      .run();

    return jsonResponse({ success: true, message: 'Bericht verzonden' });
  } catch (err) {
    console.error('Contact error:', err);
    return jsonResponse(
      { error: 'Er is een serverfout opgetreden. Probeer het later opnieuw.' },
      500
    );
  }
};
