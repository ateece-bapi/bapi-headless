import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Where to Buy - Authorized Distributors | BAPI',
  description:
    'Find authorized BAPI distributors worldwide. Connect with trusted partners for building automation sensors, controls, and technical support with local inventory and fast delivery.',
  keywords:
    'BAPI distributors, where to buy BAPI, building automation distributors, sensor distributors, HVAC controls suppliers, authorized dealers',
};

export default function WhereToBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
