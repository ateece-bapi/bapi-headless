import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Sales Team | BAPI',
  description:
    'Get in touch with BAPI\'s expert sales team. Find your regional representative for building automation sensors and controls.',
  keywords:
    'BAPI contact, sales team, building automation, sensor sales, technical support, regional representatives',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
