const PBKDF2_ITERATIONS = 100_000;

async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(plaintext: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // Concatenate: salt(16) || iv(12) || ciphertext+tag
  const result = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return btoa(String.fromCharCode(...result));
}

export async function decrypt(encryptedBase64: string, secret: string): Promise<string> {
  const raw = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

  const salt = raw.slice(0, 16);
  const iv = raw.slice(16, 28);
  const data = raw.slice(28);

  const key = await deriveKey(secret, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

export function maskIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  if (cleaned.length < 8) {
    return '****';
  }

  const country = cleaned.slice(0, 2);
  const lastFour = cleaned.slice(-4);

  // Build masked groups: country + "**" + masked middle groups + last 4
  // NL IBANs are 18 chars: NL00 BANK 0000 0000 00
  const middleLength = cleaned.length - 2 - 2 - 4; // minus country(2), check(2), last4
  const maskedMiddle = '*'.repeat(middleLength);

  // Format in groups of 4
  const full = country + '**' + maskedMiddle + lastFour;
  const groups: string[] = [];
  for (let i = 0; i < full.length; i += 4) {
    groups.push(full.slice(i, i + 4));
  }

  return groups.join(' ');
}
