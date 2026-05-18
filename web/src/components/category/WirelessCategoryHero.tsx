'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ArrowRightIcon } from '@/lib/icons';

interface WirelessCategoryHeroProps {
  locale: string;
  // Translations passed from server component
  translations: {
    title: string;
    subtitle: string;
    description: string;
    browseCTA: string;
    quoteCTA: string;
  };
}

/**
 * Compact hero section for Bluetooth Wireless category page
 * Optimized for minimal scroll (60vh height)
 * Image placeholder ready for user uploads
 */
export default function WirelessCategoryHero({
  locale,
  translations,
}: WirelessCategoryHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

      <div className="relative mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-semibold">Bluetooth Low Energy</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl">
              {translations.title}
            </h1>

            {/* Subtitle */}
            <p className="mb-2 text-2xl font-semibold text-accent-500">
              {translations.subtitle}
            </p>

            {/* Description */}
            <p className="mb-8 text-lg leading-relaxed text-white/90">
              {translations.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-neutral-900 transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/50"
              >
                {translations.browseCTA}
                <ArrowRightIcon className="h-5 w-5" />
              </a>
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                {translations.quoteCTA}
              </Link>
            </div>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="relative">
            {/* Image container - Ready for user upload */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/10 shadow-2xl backdrop-blur-sm">
              {/* TODO: Replace with uploaded wireless sensor image */}
              {/* Placeholder until image is uploaded */}
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">📡</div>
                  <p className="text-sm text-white/70">
                    Wireless Sensor Product Image
                    <br />
                    (Upload: 1200x900px recommended)
                  </p>
                </div>
              </div>

              {/* Uncomment when image is uploaded:
              <Image
                src="/images/wireless/hero-sensor.jpg"
                alt="BAPI Bluetooth Wireless Sensors"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              */}
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-accent-500/20 to-primary-400/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
