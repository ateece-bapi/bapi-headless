'use client';

import { Link } from '@/lib/navigation';
import { ArrowRightIcon } from '@/lib/icons';

interface WirelessCTAProps {
  locale: string;
  // Translations passed from server component
  translations: {
    title: string;
    description: string;
    contactCTA: string;
    viewAllCTA: string;
  };
}

/**
 * Compact CTA section for bottom of wireless category page
 * Gradient background matches hero for visual consistency
 * Height: ~200px
 */
export default function WirelessCTA({ locale, translations }: WirelessCTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 py-12 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

      <div className="relative mx-auto max-w-container px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold lg:text-3xl">{translations.title}</h2>
        <p className="mb-6 text-lg text-primary-50">{translations.description}</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/support/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            {translations.contactCTA}
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-primary-500/20 px-6 py-3 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary-500/30 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            {translations.viewAllCTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
