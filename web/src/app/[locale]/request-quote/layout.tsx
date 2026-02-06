import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

/**
 * Layout metadata for request quote page
 * Optimized for quote request and lead generation
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Request a Quote - Get Pricing for Building Automation Products',
  description:
    'Request a custom quote for BAPI building automation sensors and controllers. Fast response from our sales team. Bulk pricing available. Free technical consultation included.',
  path: 'request-quote',
  keywords: [
    'BAPI quote request',
    'sensor pricing',
    'bulk pricing',
    'building automation quote',
    'HVAC sensor pricing',
    'BACnet controller quote',
    'wholesale pricing',
    'distributor pricing',
  ],
  type: 'website',
});

export default function RequestQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
