export interface PricingPlan {
  name: string;
  slug: string;
  price: string;
  period: string;
  duration: string;
  features: string[];
  badge?: string;
  accent: 'primary' | 'secondary' | 'default';
  cta: string;
  href: string;
  unavailable?: string;
}

export interface PricingExtra {
  name: string;
  price: string;
  note: string;
  href?: string;
}

export interface SignupExtra {
  name: string;
  slug: string;
  price: string;
  period: string;
  duration: string;
  note: string;
  accent: 'primary' | 'secondary';
}

export const pricingPlans: Record<string, PricingPlan[]> = {
  jaar: [
    {
      name: 'Smart Deal',
      slug: 'smart-deal',
      price: '€24,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Onbeperkt fitness', '7 dagen per week open'],
      badge: 'Beste Deal',
      accent: 'primary',
      cta: 'KIES SMART DEAL',
      href: '/signup/?plan=smart-deal',
    },
    {
      name: 'Ladies Only',
      slug: 'ladies-only',
      price: '€20,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Ladies Only zone + volledige gym', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES ONLY',
      href: '/signup/?plan=ladies-only',
    },
    {
      name: 'Ultimate Fit Deal',
      slug: 'ultimate-fit',
      price: '€37,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Onbeperkt fitness + kickboxing', 'Alle lessen inclusief'],
      accent: 'primary',
      cta: 'KIES ULTIMATE FIT',
      href: '/signup/?plan=ultimate-fit',
    },
  ],
  halfjaar: [
    {
      name: 'Fit Deal',
      slug: 'fit-deal',
      price: '€29,50',
      period: '/maand',
      duration: '6 maanden',
      features: ['Onbeperkt fitness', '7 dagen per week open'],
      accent: 'primary',
      cta: 'KIES FIT DEAL',
      href: '/signup/?plan=fit-deal',
    },
    {
      name: 'Ladies Halfjaar',
      slug: 'ladies-halfjaar',
      price: '€25,50',
      period: '/maand',
      duration: '6 maanden',
      features: ['Ladies Only zone + volledige gym', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES HALFJAAR',
      href: '/signup/?plan=ladies-halfjaar',
    },
    {
      name: 'Ultimate Fit Deal',
      slug: 'ultimate-fit-halfjaar',
      price: '',
      period: '',
      duration: '',
      features: [],
      accent: 'default',
      cta: '',
      href: '',
      unavailable: 'Ultimate Fit is alleen beschikbaar als jaarabonnement.',
    },
  ],
  flex: [
    {
      name: 'Flex',
      slug: 'flex',
      price: '€37,00',
      period: '/maand',
      duration: 'Maandelijks opzegbaar',
      features: ['Onbeperkt fitness', '7 dagen per week open'],
      accent: 'primary',
      cta: 'KIES FLEX',
      href: '/signup/?plan=flex',
    },
    {
      name: 'Ladies Flex',
      slug: 'ladies-flex',
      price: '€32,00',
      period: '/maand',
      duration: 'Maandelijks opzegbaar',
      features: ['Ladies Only zone + volledige gym', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES FLEX',
      href: '/signup/?plan=ladies-flex',
    },
    {
      name: 'Ultimate Fit Deal',
      slug: 'ultimate-fit-flex',
      price: '',
      period: '',
      duration: '',
      features: [],
      accent: 'default',
      cta: '',
      href: '',
      unavailable: 'Ultimate Fit is alleen beschikbaar als jaarabonnement.',
    },
  ],
};

export const pricingExtras: PricingExtra[] = [
  { name: 'Dagpas', price: '€7,00', note: 'Eenmalig, gewoon binnenlopen' },
  { name: 'Quick Deal', price: '€99,00', note: '3 maanden, eenmalige betaling' },
  { name: 'Combi Deal', price: '€39,50/maand', note: '12 maanden, voor 2 personen' },
  { name: 'Kickboxing los', price: 'vanaf €19,95/maand', note: 'Zie kickboxing pagina voor alle opties', href: '/kickboxing/' },
];

export const signupExtras: SignupExtra[] = [
  {
    name: 'Combi Deal',
    slug: 'combi-deal',
    price: '€39,50',
    period: '/maand',
    duration: '12 maanden',
    note: 'Onbeperkt sporten voor 2 personen',
    accent: 'primary',
  },
  {
    name: 'Quick Deal',
    slug: 'quick-deal',
    price: '€99,00',
    period: 'eenmalig',
    duration: '3 maanden',
    note: 'Onbeperkt sporten voor 3 maanden',
    accent: 'primary',
  },
  {
    name: 'Kickboxing 1x p/w',
    slug: 'kb-1x',
    price: '€19,95',
    period: '/maand',
    duration: '12 maanden',
    note: '1 kickboxles per week, 12 maanden',
    accent: 'primary',
  },
  {
    name: 'Kickboxing Unlimited',
    slug: 'kb-unlimited',
    price: '€26,95',
    period: '/maand',
    duration: '12 maanden',
    note: 'Onbeperkt kickboxlessen, 12 maanden',
    accent: 'primary',
  },
  {
    name: 'Dagpas',
    slug: 'dagpas',
    price: '€7,00',
    period: 'eenmalig',
    duration: 'Eenmalig',
    note: 'Toegang voor 1 dag',
    accent: 'primary',
  },
];
