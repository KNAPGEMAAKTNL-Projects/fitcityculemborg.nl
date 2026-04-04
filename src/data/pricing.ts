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

export const pricingPlans: Record<string, PricingPlan[]> = {
  jaar: [
    {
      name: 'Smart Deal',
      slug: 'smart-deal',
      price: '€24,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Onbeperkt fitness', 'Gratis begeleiding bij elk bezoek', 'Alle apparatuur'],
      badge: 'Beste Deal',
      accent: 'primary',
      cta: 'KIES SMART DEAL',
      href: '/signup/',
    },
    {
      name: 'Ladies Only',
      slug: 'ladies-only',
      price: '€20,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Ladies Only zone + volledige gym', 'Gratis begeleiding bij elk bezoek', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES ONLY',
      href: '/signup/',
    },
    {
      name: 'Ultimate Fit Deal',
      slug: 'ultimate-fit',
      price: '€37,50',
      period: '/maand',
      duration: '12 maanden',
      features: ['Onbeperkt fitness + kickboxing', 'Gratis begeleiding bij elk bezoek', 'Alle lessen inclusief'],
      accent: 'primary',
      cta: 'KIES ULTIMATE FIT',
      href: '/signup/',
    },
  ],
  halfjaar: [
    {
      name: 'Fit Deal',
      slug: 'fit-deal',
      price: '€29,50',
      period: '/maand',
      duration: '6 maanden',
      features: ['Onbeperkt fitness', 'Gratis begeleiding bij elk bezoek', 'Alle apparatuur'],
      accent: 'primary',
      cta: 'KIES FIT DEAL',
      href: '/signup/',
    },
    {
      name: 'Ladies Halfjaar',
      slug: 'ladies-halfjaar',
      price: '€25,50',
      period: '/maand',
      duration: '6 maanden',
      features: ['Ladies Only zone + volledige gym', 'Gratis begeleiding bij elk bezoek', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES HALFJAAR',
      href: '/signup/',
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
      features: ['Onbeperkt fitness', 'Gratis begeleiding bij elk bezoek', 'Alle apparatuur'],
      accent: 'primary',
      cta: 'KIES FLEX',
      href: '/signup/',
    },
    {
      name: 'Ladies Flex',
      slug: 'ladies-flex',
      price: '€32,00',
      period: '/maand',
      duration: 'Maandelijks opzegbaar',
      features: ['Ladies Only zone + volledige gym', 'Gratis begeleiding bij elk bezoek', 'Eigen trainingsruimte'],
      accent: 'secondary',
      cta: 'KIES LADIES FLEX',
      href: '/signup/',
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
