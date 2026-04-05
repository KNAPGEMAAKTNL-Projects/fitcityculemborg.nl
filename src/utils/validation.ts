/**
 * Client-side validation utilities for Fitcity Culemborg signup form.
 * Bundled by Astro for browser use.
 */

/**
 * Validates an IBAN using the mod-97 algorithm.
 * Strips spaces, converts to uppercase, checks length, and performs modular arithmetic.
 */
export function validateIBAN(iban: string): boolean {
  // Strip spaces and uppercase
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();

  // Basic length check (15-34 chars for any IBAN, NL must be 18)
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  if (cleaned.startsWith('NL') && cleaned.length !== 18) return false;

  // Check format: starts with 2 letters, then 2 digits, then alphanumeric
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return false;

  // Move first 4 chars to end
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (const char of rearranged) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }

  // Compute mod 97 using string-based modulo for large numbers
  let remainder = 0;
  for (const digit of numericString) {
    remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
  }

  return remainder === 1;
}

/**
 * Formats an IBAN value for display: strips non-alphanumeric,
 * converts to uppercase, inserts a space every 4 characters.
 */
export function formatIBAN(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validates a Dutch postcode (format: 1234 AB).
 */
export function validatePostcode(postcode: string): boolean {
  return /^\d{4}\s?[A-Za-z]{2}$/.test(postcode.trim());
}

/**
 * Normalizes a postcode to "1234 AB" format.
 */
export function normalizePostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length >= 6) {
    return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 6);
  }
  return cleaned;
}

/**
 * Validates an email address (basic format check).
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates a phone number (strips non-digits, checks length 10-12).
 */
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}
