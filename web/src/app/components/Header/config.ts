import { NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/resources', label: 'Resources' },
  { href: '/company', label: 'Company' },
  { href: '/support', label: 'Support' },
];

export const REGIONS = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
] as const;

export const HEADER_CONFIG = {
  logo: {
    src: '/BAPI_Logo_with_white_border.jpg',
    alt: 'BAPI - Sensors for HVAC/R',
    width: 350,
    height: 117,
  },
  scrollThreshold: 10,
} as const;