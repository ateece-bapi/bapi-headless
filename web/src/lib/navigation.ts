import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n';

// Create typed navigation helpers using routing config
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
