import { HeroAction } from './types';

export const HERO_CONFIG = {
  title: 'Building Automation & Control Solutions',
  subtitle: 'BAPI-Backed',
  description: 'Professional sensors and control modules for modern building automation systems.',
  actions: [
    { label: 'Browse Products', href: '/products', variant: 'blue' },
    { label: 'Contact Sales', href: '/contact', variant: 'yellow' },
  ] as HeroAction[],
} as const;