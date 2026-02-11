import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n';

// Create typed navigation helpers with all supported locales
export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ 
    locales,
    localePrefix: 'always' // Must match middleware config
  });
