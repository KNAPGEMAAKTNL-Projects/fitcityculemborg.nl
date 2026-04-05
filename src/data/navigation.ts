export const mainNav = [
  { label: 'Fitness', href: '/fitness/' },
  { label: 'Ladies Only', href: '/ladies-only/' },
  { label: 'Bokszaktraining', href: '/kickboxing/' },
  { label: 'Over Ons', href: '/over-ons/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const mobileNav = [
  ...mainNav,
  { label: 'FAQ', href: '/faq/' },
] as const;

export const footerNav = [
  { label: 'Fitness', href: '/fitness/' },
  { label: 'Ladies Only', href: '/ladies-only/' },
  { label: 'Bokszaktraining', href: '/kickboxing/' },
  { label: 'Over Ons', href: '/over-ons/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'FAQ', href: '/faq/' },
] as const;

export const legalNav = [
  { label: 'Privacybeleid', href: '/privacy/' },
  { label: 'Algemene Voorwaarden', href: '/voorwaarden/' },
] as const;
