/**
 * Resend email integration for Fitcity Culemborg.
 * All HTML uses inline styles + table layout for maximum email client compatibility.
 * iOS dark mode prevention via color-scheme meta + explicit !important colors.
 */

// ── Constants ────────────────────────────────────────────────────────────────

const RESEND_API = 'https://api.resend.com/emails';
const FROM_EMAIL = 'Rachid van Fitcity Culemborg <info@knapgemaakt.nl>';
const OWNER_EMAIL = 'yannick@knapgemaakt.nl';
const ADMIN_URL = 'https://fitcityculemborg.knapgemaakt.nl/admin/';
const SITE_URL = 'https://fitcityculemborg.knapgemaakt.nl';
const LOGO_URL = 'https://fitcityculemborg.knapgemaakt.nl/images/fitcity-logo.webp';

// ── Brand colors (explicit hex, no CSS vars) ────────────────────────────────

const C = {
  bg: '#141414',
  surface: '#1C1C1C',
  surfaceAlt: '#181818',
  primary: '#FFE303',
  primaryDark: '#141414',
  text: '#FFFFFF',
  textMuted: '#999999',
  textBody: '#CCCCCC',
  border: '#2A2A2A',
  green: '#22c55e',
} as const;

// ── Resend API call ─────────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function sendEmail(apiKey: string, options: SendEmailOptions): Promise<boolean> {
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Resend error:', res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}

// ── Shared HTML scaffolding ─────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Fitcity Culemborg</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: light dark; }
    body, .body-bg { background-color: ${C.bg} !important; }
    @media (prefers-color-scheme: dark) {
      body, .body-bg, .wrapper-bg { background-color: ${C.bg} !important; }
      .card-bg { background-color: ${C.surface} !important; }
      .text-white { color: ${C.text} !important; }
      .text-body { color: ${C.textBody} !important; }
      .text-muted { color: ${C.textMuted} !important; }
      .primary-text { color: ${C.primary} !important; }
      .border-color { border-color: ${C.border} !important; }
    }
    /* Reset */
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; }
    table { border-spacing: 0 !important; border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    /* Prevent auto-link styling on iOS */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    /* Mobile responsive */
    @media only screen and (max-width: 480px) {
      .card-padding { padding: 24px 18px !important; }
      .detail-label { width: 90px !important; font-size: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: ${C.bg} !important; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;" class="body-bg">
  <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${C.bg};"><tr><td align="center"><![endif]-->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${C.bg} !important;" class="wrapper-bg">
    <tr>
      <td align="center" style="padding: 24px 16px 0 16px;">
        <!-- Logo -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="${LOGO_URL}" alt="Fitcity Culemborg" width="140" style="display: block; width: 140px; height: auto;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0 16px;">
        <!-- Main card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%; background-color: ${C.surface} !important; border: 1px solid ${C.border}; border-radius: 8px;" class="card-bg">
          <tr>
            <td style="padding: 32px 28px;" class="card-padding">
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 24px 16px 32px 16px;">
        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">
          <tr>
            <td align="center" style="padding: 0 0 8px 0;">
              <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: ${C.textMuted} !important;" class="text-muted">
                Fitcity Culemborg &middot; Houtweg 8 &middot; 4104 AB Culemborg
              </p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.5; color: ${C.textMuted} !important;" class="text-muted">
                <a href="tel:+31646872274" style="color: ${C.textMuted} !important;" class="text-muted">06-46872274</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:info@fitcityculemborg.nl" style="color: ${C.textMuted} !important;" class="text-muted">info@fitcityculemborg.nl</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;
}

function heading(text: string): string {
  return `<h2 style="margin: 0 0 16px 0; font-family: 'Oswald', 'Arial Black', Arial, Helvetica, sans-serif; font-weight: 700; font-size: 22px; line-height: 1.2; text-transform: uppercase; color: ${C.text} !important; letter-spacing: 0.02em;" class="text-white">${text}</h2>`;
}

function paragraph(text: string): string {
  return `<p style="margin: 0 0 16px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.65; color: ${C.textBody} !important;" class="text-body">${text}</p>`;
}

function greeting(name: string): string {
  return `<p style="margin: 0 0 20px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.65; color: ${C.textBody} !important;" class="text-body">Hoi ${escapeHtml(name)},</p>`;
}

function divider(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding: 12px 0;"><div style="height: 1px; background-color: ${C.border} !important; font-size: 1px; line-height: 1px;" class="border-color">&nbsp;</div></td></tr></table>`;
}

function primaryButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 8px 0;">
  <tr>
    <td align="center" style="background-color: ${C.primary} !important; border-radius: 4px; mso-padding-alt: 14px 32px;">
      <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%; mso-text-raise: 28pt;">&nbsp;</i><![endif]-->
      <a href="${href}" target="_blank" style="display: inline-block; font-family: 'Oswald', 'Arial Black', Arial, Helvetica, sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; color: ${C.primaryDark} !important; background-color: ${C.primary} !important; padding: 14px 32px; border-radius: 4px; text-decoration: none; mso-padding-alt: 0;">
        <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
        ${text}
        <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
      </a>
      <!--[if mso]><i style="letter-spacing: 32px; mso-font-width: -100%; mso-text-raise: 28pt;">&nbsp;</i><![endif]-->
    </td>
  </tr>
</table>`;
}

function ghostButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0;">
  <tr>
    <td align="center" style="border: 1px solid ${C.border} !important; border-radius: 4px;" class="border-color">
      <a href="${href}" target="_blank" style="display: inline-block; font-family: 'Oswald', 'Arial Black', Arial, Helvetica, sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; color: ${C.text} !important; padding: 12px 28px; text-decoration: none;" class="text-white">${text}</a>
    </td>
  </tr>
</table>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
  <td style="padding: 8px 8px 8px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 13px; color: ${C.textMuted} !important; vertical-align: top; width: 110px;" class="text-muted detail-label">${label}</td>
  <td style="padding: 8px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: ${C.text} !important; vertical-align: top; word-break: break-word;" class="text-white">${escapeHtml(value)}</td>
</tr>`;
}

function detailsTable(rows: Array<[string, string]>): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${C.surfaceAlt} !important; border-radius: 6px; margin: 16px 0;">
  <tr><td style="padding: 16px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${rows.map(([l, v]) => detailRow(l, v)).join('')}
    </table>
  </td></tr>
</table>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Email templates ─────────────────────────────────────────────────────────

// 1. Signup — Customer confirmation
function signupCustomerHtml(data: {
  full_name: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
}): string {
  const content = `
    ${heading('Welkom bij Fitcity Culemborg')}
    ${greeting(data.full_name)}
    ${paragraph('Bedankt voor je aanmelding! We hebben je inschrijving in goede orde ontvangen.')}

    ${detailsTable([
      ['Abonnement', data.plan_name],
      ['Prijs', data.plan_price],
      ['Looptijd', data.plan_duration],
    ])}

    ${heading('Wat nu?')}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
      <tr>
        <td width="32" valign="top" style="padding: 4px 12px 16px 0;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${C.primary} !important; text-align: center; line-height: 28px; font-family: 'Oswald', 'Arial Black', Arial, sans-serif; font-weight: 700; font-size: 13px; color: ${C.primaryDark} !important;">1</div>
        </td>
        <td valign="top" style="padding: 4px 0 16px 0;">
          <p style="margin: 0 0 2px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: ${C.text} !important;" class="text-white">Kom langs bij Fitcity Culemborg</p>
          <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: ${C.textMuted} !important;" class="text-muted">Houtweg 8, 4104 AB Culemborg. Je kunt terecht tijdens openingstijden.</p>
        </td>
      </tr>
      <tr>
        <td width="32" valign="top" style="padding: 4px 12px 16px 0;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${C.primary} !important; text-align: center; line-height: 28px; font-family: 'Oswald', 'Arial Black', Arial, sans-serif; font-weight: 700; font-size: 13px; color: ${C.primaryDark} !important;">2</div>
        </td>
        <td valign="top" style="padding: 4px 0 16px 0;">
          <p style="margin: 0 0 2px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: ${C.text} !important;" class="text-white">Neem mee</p>
          <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: ${C.textMuted} !important;" class="text-muted">Inschrijfkosten van &euro;17,00 (pin of contant) en een geldig legitimatiebewijs.</p>
        </td>
      </tr>
      <tr>
        <td width="32" valign="top" style="padding: 4px 12px 0 0;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${C.primary} !important; text-align: center; line-height: 28px; font-family: 'Oswald', 'Arial Black', Arial, sans-serif; font-weight: 700; font-size: 13px; color: ${C.primaryDark} !important;">3</div>
        </td>
        <td valign="top" style="padding: 4px 0 0 0;">
          <p style="margin: 0 0 2px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; color: ${C.text} !important;" class="text-white">Haal je ledenpas op en start!</p>
          <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: ${C.textMuted} !important;" class="text-muted">Je ontvangt je pas aan de balie en kunt daarna direct beginnen met trainen.</p>
        </td>
      </tr>
    </table>

    ${divider()}

    ${paragraph('Vragen? Stuur een WhatsApp naar <a href="https://wa.me/31646872274?text=Hoi%2C%20ik%20heb%20een%20vraag%20over%20mijn%20inschrijving" style="color: ' + C.primary + ' !important; text-decoration: underline;" class="primary-text">06-46872274</a> of mail naar <a href="mailto:info@fitcityculemborg.nl" style="color: ' + C.primary + ' !important; text-decoration: underline;" class="primary-text">info@fitcityculemborg.nl</a>.')}
  `;
  return emailWrapper(content);
}

// 2. Signup — Owner notification
function signupOwnerHtml(data: {
  full_name: string;
  email: string;
  phone: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
  date_of_birth: string;
  city: string;
  created_at: string;
}): string {
  const content = `
    ${heading('Nieuwe Aanmelding')}
    ${paragraph('Er is een nieuwe inschrijving binnengekomen via de website.')}

    ${detailsTable([
      ['Naam', data.full_name],
      ['E-mail', data.email],
      ['Telefoon', data.phone],
      ['Geboortedatum', data.date_of_birth],
      ['Woonplaats', data.city],
      ['Abonnement', data.plan_name],
      ['Prijs', data.plan_price],
      ['Looptijd', data.plan_duration],
      ['Datum', data.created_at],
    ])}

    ${primaryButton('BEKIJK IN ADMIN', ADMIN_URL)}
  `;
  return emailWrapper(content);
}

// 3. Contact — Customer confirmation
function contactCustomerHtml(data: {
  naam: string;
  onderwerp: string;
}): string {
  const content = `
    ${heading('Bericht Ontvangen')}
    ${greeting(data.naam)}
    ${paragraph(`Bedankt voor je bericht over <strong style="color: ${C.text} !important;">${escapeHtml(data.onderwerp)}</strong>. We hebben het in goede orde ontvangen.`)}
    ${paragraph('Je ontvangt zo snel mogelijk een reactie, meestal binnen 24 uur.')}

    ${divider()}

    ${paragraph('Dringend? Stuur een WhatsApp naar <a href="https://wa.me/31646872274?text=Hoi%2C%20ik%20heb%20een%20vraag" style="color: ' + C.primary + ' !important; text-decoration: underline;" class="primary-text">06-46872274</a>.')}
  `;
  return emailWrapper(content);
}

// 4. Contact — Owner notification (with reply-to)
function contactOwnerHtml(data: {
  naam: string;
  email: string;
  onderwerp: string;
  bericht: string;
  created_at: string;
}): string {
  const replySubject = encodeURIComponent(`Re: ${data.onderwerp}`);
  const replyBody = encodeURIComponent(`\n\n---\nOp ${data.created_at} schreef ${data.naam}:\n\n${data.bericht}`);
  const mailtoHref = `mailto:${data.email}?subject=${replySubject}&body=${replyBody}`;

  const content = `
    ${heading('Nieuw Contactbericht')}
    ${paragraph('Er is een nieuw contactbericht binnengekomen via de website.')}

    ${detailsTable([
      ['Naam', data.naam],
      ['E-mail', data.email],
      ['Onderwerp', data.onderwerp],
      ['Datum', data.created_at],
    ])}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${C.surfaceAlt} !important; border-radius: 6px; margin: 8px 0 16px 0; border-left: 3px solid ${C.primary} !important;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 6px 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: ${C.textMuted} !important;" class="text-muted">Bericht</p>
          <p style="margin: 0; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.65; color: ${C.textBody} !important; white-space: pre-wrap;" class="text-body">${escapeHtml(data.bericht)}</p>
        </td>
      </tr>
    </table>

    ${primaryButton('BEANTWOORDEN', mailtoHref)}
  `;
  return emailWrapper(content);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function sendSignupCustomerEmail(
  apiKey: string,
  data: { full_name: string; email: string; plan_name: string; plan_price: string; plan_duration: string }
): Promise<boolean> {
  return sendEmail(apiKey, {
    to: data.email,
    subject: 'Welkom bij Fitcity Culemborg!',
    html: signupCustomerHtml(data),
  });
}

export async function sendSignupOwnerEmail(
  apiKey: string,
  data: {
    full_name: string;
    email: string;
    phone: string;
    plan_name: string;
    plan_price: string;
    plan_duration: string;
    date_of_birth: string;
    city: string;
  }
): Promise<boolean> {
  const now = new Date();
  const created_at = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return sendEmail(apiKey, {
    to: OWNER_EMAIL,
    subject: `Nieuwe aanmelding: ${data.plan_name} — ${data.full_name}`,
    html: signupOwnerHtml({ ...data, created_at }),
  });
}

export async function sendContactCustomerEmail(
  apiKey: string,
  data: { naam: string; email: string; onderwerp: string }
): Promise<boolean> {
  return sendEmail(apiKey, {
    to: data.email,
    subject: 'We hebben je bericht ontvangen — Fitcity Culemborg',
    html: contactCustomerHtml(data),
  });
}

export async function sendContactOwnerEmail(
  apiKey: string,
  data: { naam: string; email: string; onderwerp: string; bericht: string }
): Promise<boolean> {
  const now = new Date();
  const created_at = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return sendEmail(apiKey, {
    to: OWNER_EMAIL,
    subject: `Nieuw contactbericht: ${data.onderwerp} — ${data.naam}`,
    html: contactOwnerHtml({ ...data, created_at }),
    replyTo: data.email,
  });
}
