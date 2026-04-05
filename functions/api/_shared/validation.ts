const VALID_PLAN_SLUGS = [
  'smart-deal',
  'ladies-only',
  'ultimate-fit',
  'fit-deal',
  'ladies-halfjaar',
  'flex',
  'ladies-flex',
  'combi-deal',
  'quick-deal',
  'kb-1x',
  'kb-unlimited',
  'dagpas',
] as const;

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

export function sanitize(str: string): string {
  return str.trim().replace(/<[^>]*>/g, '');
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
  return (VALID_PLAN_SLUGS as readonly string[]).includes(slug);
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
