import React from 'react';
import clsx from 'clsx';
import { HeroProps } from './types';
import { HeroContent, HeroActions } from './components';

/**
 * Hero Component - Homepage hero section
 *
 * Performance Optimizations (Feb 2026):
 * - Inline styles removed, using CSS classes from globals.css
 * - Background image via .hero-bg-image class (better caching)
 * - Mobile-first: solid color on mobile, image on desktop
 * - Product family image uses proper <img> with srcSet for responsiveness
 * - GPU acceleration via CSS classes, not inline transforms
 *
 * Best Practices:
 * - Semantic HTML with proper ARIA labels
 * - Responsive design with Tailwind breakpoints
 * - Accessible gradients for text contrast
 * - Professional wave divider for visual flow
 *
 * i18n Support (Feb 2026):
 * - Accepts translations prop from parent
 * - Supports all 10 languages (en, de, fr, es, ja, zh, vi, ar, th, pl)
 */

const heroImage = {
  desktop: '/images/bapi-facility-solar-optimized.webp',
  mobile: '/images/bapi-facility-solar-optimized.webp', // Same file, but we'll optimize it differently
  alt: 'BAPI headquarters facility with solar panels',
};

export const Hero: React.FC<HeroProps> = ({ className, translations }) => {
  const actions = [
    { label: translations.cta, href: '/products', variant: 'blue' as const },
    { label: translations.secondaryCta, href: '/contact', variant: 'yellow' as const },
  ];

  return (
    <section
      className={clsx(
        'relative w-full overflow-hidden bg-white py-14 sm:py-16 lg:py-20 xl:py-14 2xl:py-24',
        className
      )}
    >
      {/* Responsive Background Image - Mobile optimized */}
      <div className="absolute inset-0">
        {/* Mobile: Solid color background instead of large image */}
        <div className="absolute inset-0 bg-neutral-100 md:hidden" />

        {/* Desktop: Background image */}
        <div
          className="hero-bg-image absolute inset-0 hidden md:block"
          role="img"
          aria-label={heroImage.alt}
        ></div>
        {/* Professional overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-br from-white/80 via-white/75 to-white/70" />
      </div>

      {/* Subtle accent gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,121,188,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.08)_0%,transparent_50%)]" />

      {/* Removed decorative floating elements for performance */}

      <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Two-column at 2xl only: text+CTAs left, product showcase right */}
        <div className="2xl:grid 2xl:grid-cols-[1fr_1.2fr] 2xl:items-center 2xl:gap-16">

          {/* Left column: headline + CTAs */}
          <div className="2xl:pb-4">
            <HeroContent
              title={translations.title}
              description={translations.description}
              taglines={translations.taglines}
              className="2xl:mx-0 2xl:text-left"
            />
            <HeroActions
              actions={actions}
              className="2xl:justify-start"
            />
          </div>

          {/* Right column / stacked below 2xl — hidden at xl to avoid crowding on 15" screens */}
          <div className="mt-12 hidden 2xl:mt-0 2xl:block">
            <div className="hero-image-container overflow-hidden rounded-2xl">
              <img
                src="/images/products/families/BAPI_Full_Family_Hero_Mobile.webp"
                srcSet="/images/products/families/BAPI_Full_Family_Hero_Mobile.webp 768w, /images/products/families/BAPI_Full_Family_Hero_Desktop.webp 1920w"
                sizes="(max-width: 768px) 100vw, 1920px"
                alt="BAPI 2025 Complete Product Family - Temperature, Humidity, Pressure, Air Quality Sensors"
                width="768"
                height="495"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="hero-image"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Subtle wave divider - elegant transition */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-20 w-full sm:h-24 lg:h-28"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Single smooth blue wave - subtle and professional */}
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
            fill="#1479BC"
            opacity="0.12"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
