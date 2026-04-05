export interface Env {
  DB: D1Database;
  ENCRYPTION_SECRET: string;
}

export interface SignupRequest {
  plan_slug: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  street: string;
  house_number: string;
  postcode: string;
  city: string;
  iban: string;
  account_holder: string;
  privacy_consent: boolean;
  sepa_consent: boolean;
  terms_consent: boolean;
  honeypot?: string;
}

export interface ContactRequest {
  naam: string;
  email: string;
  onderwerp: string;
  bericht: string;
  privacy_consent: boolean;
  honeypot?: string;
}
