export interface Env {
  DB: D1Database;
  ENCRYPTION_SECRET: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ACCESS_TEAM_DOMAIN: string;
  ACCESS_AUD: string;
}

export interface SignupRequest {
  plan_slug: string;
  plan_name: string;
  plan_price: string;
  plan_duration: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  street: string;
  house_number: string;
  house_number_addition?: string;
  postcode: string;
  city: string;
  iban?: string;
  account_holder?: string;
  privacy_consent: boolean;
  sepa_consent?: boolean;
  terms_consent: boolean;
  marketing_consent?: boolean;
  honeypot?: string;
  cf_turnstile_response?: string;
}

export interface ContactRequest {
  naam: string;
  email: string;
  onderwerp: string;
  bericht: string;
  privacy_consent: boolean;
  honeypot?: string;
  cf_turnstile_response?: string;
}
