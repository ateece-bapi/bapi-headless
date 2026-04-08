'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { LinkedinIcon, YoutubeIcon } from '@/lib/icons';
import { useTranslations, useLocale } from 'next-intl';

// Footer sections now use translation keys - next-intl format
const getFooterSections = (t: any) => [
  {
    titleKey: 'sections.products.title' as const,
    links: [
      { labelKey: 'sections.products.links.allSensors' as const, href: '/sensors' },
      { labelKey: 'sections.products.links.wireless' as const, href: '/wireless' },
      { labelKey: 'sections.products.links.testInstruments' as const, href: '/test-instruments' },
      { labelKey: 'sections.products.links.airQuality' as const, href: '/air-quality' },
      { labelKey: 'sections.products.links.accessories' as const, href: '/accessories' },
      { labelKey: 'sections.products.links.browseCatalog' as const, href: '/products' },
    ],
  },
  // PHASE 2: Solutions section deferred to Phase 2 (April 10, 2026 deadline)
  // Awaiting content creation from marketing team
  // {
  //   titleKey: 'sections.solutions.title' as const,
  //   links: [
  //     { labelKey: 'sections.solutions.links.healthcare' as const, href: '/solutions/healthcare' },
  //     { labelKey: 'sections.solutions.links.datacenters' as const, href: '/solutions/data-centers' },
  //     { labelKey: 'sections.solutions.links.commercial' as const, href: '/solutions/commercial' },
  //     { labelKey: 'sections.solutions.links.manufacturing' as const, href: '/solutions/manufacturing' },
  //     { labelKey: 'sections.solutions.links.bacnet' as const, href: '/solutions/bacnet' },
  //   ],
  // },
  {
    titleKey: 'sections.resources.title' as const,
    links: [
      { labelKey: 'sections.resources.links.datasheets' as const, href: '/resources/datasheets' },
      {
        labelKey: 'sections.resources.links.installation' as const,
        href: '/resources/installation',
      },
      {
        labelKey: 'sections.resources.links.applicationNotes' as const,
        href: '/application-notes',
      },
      { labelKey: 'sections.resources.links.videos' as const, href: '/resources/videos' },
      {
        labelKey: 'sections.resources.links.caseStudies' as const,
        href: '/resources/case-studies',
      },
    ],
  },
  {
    titleKey: 'sections.company.title' as const,
    links: [
      { labelKey: 'sections.company.links.mission' as const, href: '/company/mission-values' },
      { labelKey: 'sections.company.links.whyBapi' as const, href: '/company/why-bapi' },
      { labelKey: 'sections.company.links.news' as const, href: '/company/news' },
      { labelKey: 'sections.company.links.careers' as const, href: '/company/careers' },
      { labelKey: 'sections.company.links.contact' as const, href: '/company/contact-us' },
    ],
  },
  {
    titleKey: 'sections.support.title' as const,
    links: [
      { labelKey: 'sections.support.links.technical' as const, href: '/support' },
      { labelKey: 'sections.support.links.selector' as const, href: '/resources/selector' },
      {
        labelKey: 'sections.support.links.crossReference' as const,
        href: '/resources/cross-reference',
      },
      { labelKey: 'sections.support.links.distributorNetwork' as const, href: '/where-to-buy' },
    ],
  },
];

const social = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bapi-building-automation-products-inc-/',
    icon: LinkedinIcon,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@BAPIInc',
    icon: YoutubeIcon,
  },
];

const Footer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations('footer');

  // Prevent hydration mismatch - wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show SSR-safe fallback footer until mounted and locale is ready
  if (!mounted || !locale) {
    return (
      <footer className="relative mt-16 w-full border-t border-neutral-200 bg-neutral-50">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-neutral-700">
            © {new Date().getFullYear()} Building Automation Products, Inc.
          </div>
        </div>
      </footer>
    );
  }

  const footerSections = getFooterSections(t);

  return (
    <footer className="relative mt-16 w-full border-t border-neutral-200 bg-neutral-50">
      {/* Gradient Accent Line */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 border-b border-neutral-200 pb-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-12">
          {/* Brand & Mission - Takes 2 columns on large screens */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="mb-2 inline-block">
              <Image
                src="/bapi_logo_Web_Digital.png"
                alt="BAPI Logo"
                width={200}
                height={48}
                className="h-10 w-auto transition-opacity hover:opacity-80 lg:h-12"
              />
            </Link>
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-neutral-900 lg:text-base">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text font-extrabold text-transparent">
                {t('brand.tagline')}
              </span>
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-700">
              {t('brand.description')}
            </p>

            {/* Social Links */}
            <div className="mt-2 flex gap-3">
              {social.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="flex h-11 w-11 transform items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-neutral-700 shadow-md transition-all duration-300 hover:scale-110 hover:border-primary-600 hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 hover:text-white hover:shadow-xl"
                  >
                    <IconComponent className="h-5 w-5" strokeWidth={2.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <nav key={section.titleKey} className="group flex flex-col gap-3" aria-label={t(section.titleKey)}>
              <div className="relative mb-2 pb-2 text-sm font-extrabold uppercase tracking-wide text-primary-600 lg:text-base">
                {t(section.titleKey)}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 group-hover:w-full"></span>
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm font-medium text-neutral-700 transition-all duration-300 hover:translate-x-1 hover:text-primary-600"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Section - Contact & Legal */}
        <div className="grid grid-cols-1 gap-6 border-b border-neutral-200 pb-8 pt-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Contact Information */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-primary-600">
              {t('contact.title')}
            </div>
            <address className="space-y-2 text-sm font-medium not-italic text-neutral-700">
              <p className="text-neutral-900">{t('contact.address.street')}</p>
              <p className="text-neutral-900">{t('contact.address.city')}</p>
              <a
                href="tel:6087354800"
                className="block font-semibold transition-all duration-300 hover:translate-x-1 hover:text-primary-600"
              >
                (608) 735-4800
              </a>
              <a
                href="mailto:sales@bapihvac.com"
                className="block font-semibold transition-all duration-300 hover:translate-x-1 hover:text-primary-600"
              >
                sales@bapihvac.com
              </a>
            </address>
          </div>

          {/* Awards & Recognition */}
          <div className="flex flex-col gap-3">
            <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-primary-600">
              {t('awards.title')}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src="/images/awards/AHR_2012_Innovation_Award.webp"
                alt="AHR 2012 Innovation Award"
                width={80}
                height={64}
                className="h-16 w-auto cursor-pointer transition-transform duration-300 hover:scale-110"
                title="AHR Expo 2012 Innovation Award"
              />
              <Image
                src="/images/awards/AHR_Award_07_08.webp"
                alt="AHR Expo Awards 2007-2008"
                width={70}
                height={56}
                className="h-14 w-auto cursor-pointer transition-transform duration-300 hover:scale-110"
                title="AHR Expo Innovation Awards 2007-2008"
              />
              <Image
                src="/images/awards/AHR_Expo_Innovation_Award.webp"
                alt="AHR Expo Innovation Award"
                width={70}
                height={56}
                className="h-14 w-auto cursor-pointer transition-transform duration-300 hover:scale-110"
                title="AHR Expo Innovation Award Winner"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-neutral-700">{t('awards.description')}</p>
          </div>

          {/* Certifications */}
          <div className="flex flex-col gap-3">
            <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-primary-600">
              {t('certifications.title')}
            </div>

            {/* Certification Logos */}
            <div className="flex flex-col gap-4">
              {/* Logo Badges */}
              <div className="flex flex-wrap items-center gap-4">
                <Image
                  src="/images/logos/5_year_warranty_C92M55.webp"
                  alt="5 Year Warranty"
                  width={60}
                  height={48}
                  className="h-12 w-auto transition-transform duration-300 hover:scale-110"
                />
                <Image
                  src="/images/logos/NSF_Logo.webp"
                  alt="NSF Certified"
                  width={50}
                  height={40}
                  className="h-10 w-auto transition-transform duration-300 hover:scale-110"
                />
                <Image
                  src="/images/logos/RoHS_Logo.webp"
                  alt="RoHS Compliant"
                  width={50}
                  height={40}
                  className="h-10 w-auto transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Text Certifications */}
              <div className="space-y-1.5 text-sm font-medium text-neutral-700">
                <p className="font-semibold text-neutral-900">{t('certifications.bacnet')}</p>
                <p className="font-semibold text-neutral-900">{t('certifications.iso')}</p>
                <p className="text-neutral-700">{t('certifications.madeInUsa')}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3">
            <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-primary-600">
              {t('quickActions.title')}
            </div>
            <Link
              href="/quote"
              className="inline-flex transform items-center justify-center rounded-lg border-2 border-accent-600 bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3 text-sm font-bold text-neutral-900 shadow-md transition-all duration-300 hover:scale-105 hover:from-accent-600 hover:to-accent-700 hover:shadow-xl"
            >
              {t('quickActions.requestQuote')}
            </Link>
            <Link
              href="/where-to-buy"
              className="inline-flex transform items-center justify-center rounded-lg border-2 border-neutral-300 bg-white px-5 py-3 text-sm font-bold text-neutral-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-xl"
            >
              {t('quickActions.findDistributor')}
            </Link>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-neutral-700 sm:flex-row sm:items-center">
          <div className="space-y-1.5 font-medium">
            <p>{t('legal.copyright', { year: new Date().getFullYear() })}</p>
            <p className="text-neutral-700">{t('legal.trademark')}</p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-semibold transition-all duration-300 hover:translate-x-1 hover:text-primary-600"
            >
              {t('legal.privacy')}
            </Link>
            <Link
              href="/terms"
              className="font-semibold transition-all duration-300 hover:translate-x-1 hover:text-primary-600"
            >
              {t('legal.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
