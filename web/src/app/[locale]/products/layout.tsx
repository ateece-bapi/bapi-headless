import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

/**
 * Layout metadata for products catalog page
 * Optimized for product discovery and category browsing
 */
export const metadata: Metadata = generatePageMetadata({
  title: 'Building Automation Products - Sensors, Controllers & Wireless',
  description:
    'Browse 600+ building automation products from BAPI. Temperature, humidity, pressure, CO2, and air quality sensors. BACnet controllers, wireless systems, and test instruments. Made in USA with NIST-traceable accuracy.',
  path: 'products',
  keywords: [
    'building automation products',
    'HVAC sensors',
    'temperature sensors',
    'humidity sensors',
    'pressure sensors',
    'CO2 sensors',
    'air quality sensors',
    'BACnet controllers',
    'wireless sensors',
    'test instruments',
    'building management sensors',
    'NIST traceable sensors',
  ],
  type: 'website',
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
