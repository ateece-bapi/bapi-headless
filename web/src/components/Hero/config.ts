import { HeroAction } from './types';

export const HERO_CONFIG = {
  title: 'Precision Sensor Solutions for Building Automation',
  subtitle: 'Engineered for Mission-Critical Performance',
  description:
    'NIST-traceable sensors and BACnet-certified controllers trusted by engineers worldwide for healthcare, data centers, and critical facilities.',
  actions: [
    { label: 'Explore Products', href: '/products', variant: 'blue' },
    { label: 'Talk to Sales', href: '/contact', variant: 'yellow' },
  ] as HeroAction[],
} as const;
