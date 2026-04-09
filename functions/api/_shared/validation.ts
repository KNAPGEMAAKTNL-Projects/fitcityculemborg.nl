interface PlanDetails {
  name: string;
  price: string;
  duration: string;
}

const PLAN_CATALOG: Record<string, PlanDetails> = {
  'smart-deal': { name: 'Smart Deal', price: '€24,50', duration: '12 maanden' },
  'ladies-only': { name: 'Ladies Only', price: '€20,50', duration: '12 maanden' },
  'ultimate-fit': { name: 'Ultimate Fit Deal', price: '€37,50', duration: '12 maanden' },
  'fit-deal': { name: 'Fit Deal', price: '€29,50', duration: '6 maanden' },
  'ladies-halfjaar': { name: 'Ladies Halfjaar', price: '€25,50', duration: '6 maanden' },
  'flex': { name: 'Flex', price: '€37,00', duration: 'Maandelijks opzegbaar' },
  'ladies-flex': { name: 'Ladies Flex', price: '€32,00', duration: 'Maandelijks opzegbaar' },
  'combi-deal': { name: 'Combi Deal', price: '€39,50', duration: '12 maanden' },
  'quick-deal': { name: 'Quick Deal', price: '€99,00', duration: '3 maanden' },
  'kb-1x': { name: 'Bokszaktraining 1x p/w', price: '€19,95', duration: '12 maanden' },
  'kb-unlimited': { name: 'Bokszaktraining Unlimited', price: '€26,95', duration: '12 maanden' },
  'dagpas': { name: 'Dagpas', price: '€7,00', duration: 'Eenmalig' },
};

const VALID_PLAN_SLUGS = Object.keys(PLAN_CATALOG);

const VALID_SUBJECTS = [
  'proeftraining',
  'prijzen',
  'abonnementen',
  'kickboxlessen',
  'ladies-only',
  'opzeggen',
  'anders',
] as const;

export function validateIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  // Check length for NL (18 chars)
  if (cleaned.length < 15 || cleaned.length > 34) {
    return false;
  }
  if (cleaned.startsWith('NL') && cleaned.length !== 18) {
    return false;
  }

  // Move first 4 chars to end
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      numericString += (code - 55).toString();
    } else {
      numericString += char;
    }
  }

  // Compute mod 97 using chunks (BigInt not needed, process in pieces)
  let remainder = 0;
  for (let i = 0; i < numericString.length; i += 7) {
    const chunk = numericString.slice(i, i + 7);
    remainder = parseInt(remainder.toString() + chunk, 10) % 97;
  }

  return remainder === 1;
}

export function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  const groups: string[] = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    groups.push(cleaned.slice(i, i + 4));
  }
  return groups.join(' ');
}

export function validatePostcode(postcode: string): boolean {
  return /^\d{4}\s?[A-Za-z]{2}$/.test(postcode.trim());
}

export function normalizePostcode(postcode: string): string {
  const cleaned = postcode.trim().replace(/\s/g, '').toUpperCase();
  return cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

export function sanitize(str: string, maxLength = 1000): string {
  return str.trim().replace(/<[^>]*>/g, '').slice(0, maxLength);
}

export async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const result = await res.json() as { success: boolean };
  return result.success;
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isValidPlanSlug(slug: string): boolean {
  return VALID_PLAN_SLUGS.includes(slug);
}

export function getPlanDetails(slug: string): PlanDetails | null {
  return PLAN_CATALOG[slug] ?? null;
}

export function isValidSubject(subject: string): boolean {
  return (VALID_SUBJECTS as readonly string[]).includes(subject);
}

export function validateDateOfBirth(dob: string): boolean {
  // Must be a valid YYYY-MM-DD date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;
  const date = new Date(dob + 'T00:00:00');
  if (isNaN(date.getTime())) return false;
  // Check the date actually matches (catch invalid dates like Feb 30)
  const [y, m, d] = dob.split('-').map(Number);
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d;
}

export function validateAge(dob: string, minAge: number): boolean {
  if (!validateDateOfBirth(dob)) return false;
  const birth = new Date(dob + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= minAge;
}
