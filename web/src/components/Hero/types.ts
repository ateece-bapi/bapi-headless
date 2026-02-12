export interface HeroTranslations {
  title: string;
  description: string;
  cta: string;
  secondaryCta: string;
  productFamilyTitle: string;
  productFamilySubtitle: string;
  taglines: string[];
}

export interface HeroProps {
  className?: string;
  translations: HeroTranslations;
}

export interface HeroAction {
  label: string;
  href: string;
  variant: 'blue' | 'yellow';
}