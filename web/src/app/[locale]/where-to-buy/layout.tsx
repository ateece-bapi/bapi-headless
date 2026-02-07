import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

/**
 * Layout metadata for where to buy page
 * Optimized for distributor search and purchasing
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Where to Buy - Authorized Distributors & Partners Worldwide',
  description:
    'Find authorized BAPI distributors worldwide. Purchase building automation sensors and controllers from trusted partners. USA, Europe, and international distributors with local inventory, fast delivery, and technical support included.',
  path: 'where-to-buy',
  keywords: [
    'BAPI distributors',
    'where to buy BAPI',
    'sensor distributors',
    'building automation distributors',
    'HVAC control distributors',
    'BACnet distributors',
    'authorized dealers',
    'international distributors',
    'local inventory',
  ],
  type: 'website',
});

export default function WhereToBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
