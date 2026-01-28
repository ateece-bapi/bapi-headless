'use client';

import React from 'react';
import { Link } from '@/lib/navigation';
import { Linkedin, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
      { labelKey: 'sections.resources.links.installation' as const, href: '/resources/installation' },
      { labelKey: 'sections.resources.links.applicationNotes' as const, href: '/resources/application-notes' },
      { labelKey: 'sections.resources.links.videos' as const, href: '/resources/videos' },
      { labelKey: 'sections.resources.links.caseStudies' as const, href: '/resources/case-studies' },
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
      { labelKey: 'sections.support.links.crossReference' as const, href: '/resources/cross-reference' },
      { labelKey: 'sections.support.links.distributorNetwork' as const, href: '/where-to-buy' },
    ],
  },
];

const social = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bapi-building-automation-products-inc-/',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@BAPIInc',
    icon: Youtube,
  },
];

const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const footerSections = getFooterSections(t);
  
  return (
  <footer className="w-full bg-neutral-50 border-t border-neutral-200 mt-16 relative">
    {/* Gradient Accent Line */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 pb-12 border-b border-neutral-200">
        {/* Brand & Mission - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link href="/" className="inline-block mb-2">
            <img 
              src="/bapi-logo.svg" 
              alt="BAPI Logo" 
              className="h-10 lg:h-12 w-auto transition-opacity hover:opacity-80" 
            />
          </Link>
          <p className="text-sm lg:text-base text-neutral-900 font-semibold leading-relaxed max-w-sm">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">{t('brand.tagline')}</span>
          </p>
          <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
            {t('brand.description')}
          </p>
          
          {/* Social Links */}
          <div className="flex gap-3 mt-2">
            {social.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-11 h-11 rounded-lg bg-white border-2 border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-white hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 hover:border-primary-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110"
                >
                  <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Navigation Sections */}
        {footerSections.map((section) => (
          <nav key={section.titleKey} className="flex flex-col gap-3 group">
            <h3 className="font-extrabold text-sm lg:text-base text-primary-600 uppercase tracking-wide mb-2 relative pb-2">
              {t(section.titleKey)}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-500"></span>
            </h3>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-700 hover:text-primary-600 hover:translate-x-1 transition-all duration-300 inline-block font-medium"
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
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-8 border-b border-neutral-200">
        {/* Contact Information */}
        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            {t('contact.title')}
          </h4>
          <address className="not-italic text-sm text-neutral-700 space-y-2 font-medium">
            <p className="text-neutral-900">{t('contact.address.street')}</p>
            <p className="text-neutral-900">{t('contact.address.city')}</p>
            <a
              href="tel:6087354800"
              className="block hover:text-primary-600 transition-all duration-300 hover:translate-x-1 font-semibold"
            >
              (608) 735-4800
            </a>
            <a
              href="mailto:sales@bapihvac.com"
              className="block hover:text-primary-600 transition-all duration-300 hover:translate-x-1 font-semibold"
            >
              sales@bapihvac.com
            </a>
          </address>
        </div>

        {/* Awards & Recognition */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            {t('awards.title')}
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            <img 
              src="/images/awards/AHR_2012_Innovation_Award.webp" 
              alt="AHR 2012 Innovation Award" 
              className="h-16 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer"
              title="AHR Expo 2012 Innovation Award"
            />
            <img 
              src="/images/awards/AHR_Award_07_08.webp" 
              alt="AHR Expo Awards 2007-2008" 
              className="h-14 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer"
              title="AHR Expo Innovation Awards 2007-2008"
            />
            <img 
              src="/images/awards/AHR_Expo_Innovation_Award.webp" 
              alt="AHR Expo Innovation Award" 
              className="h-14 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer"
              title="AHR Expo Innovation Award Winner"
            />
          </div>
          <p className="text-xs text-neutral-600 mt-2 font-medium">
            {t('awards.description')}
          </p>
        </div>

        {/* Certifications */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            {t('certifications.title')}
          </h4>
          
          {/* Certification Logos */}
          <div className="flex flex-col gap-4">
            {/* Logo Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <img 
                src="/images/logos/5_year_warranty_C92M55.webp" 
                alt="5 Year Warranty" 
                className="h-12 w-auto hover:scale-110 transition-transform duration-300"
              />
              <img 
                src="/images/logos/NSF_Logo.webp" 
                alt="NSF Certified" 
                className="h-10 w-auto hover:scale-110 transition-transform duration-300"
              />
              <img 
                src="/images/logos/RoHS_Logo.webp" 
                alt="RoHS Compliant" 
                className="h-10 w-auto hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Text Certifications */}
            <div className="text-sm text-neutral-700 space-y-1.5 font-medium">
              <p className="text-neutral-900 font-semibold">{t('certifications.bacnet')}</p>
              <p className="text-neutral-900 font-semibold">{t('certifications.iso')}</p>
              <p className="text-neutral-900 font-semibold">{t('certifications.ul')}</p>
              <p className="text-neutral-700">{t('certifications.madeInUsa')}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            {t('quickActions.title')}
          </h4>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-neutral-900 font-bold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 border-2 border-accent-600"
          >
            {t('quickActions.requestQuote')}
          </Link>
          <Link
            href="/where-to-buy"
            className="inline-flex items-center justify-center px-5 py-3 bg-white border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 font-bold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
          >
            {t('quickActions.findDistributor')}
          </Link>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="space-y-1.5 font-medium">
          <p>{t('legal.copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-neutral-500">{t('legal.trademark')}</p>
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary-600 transition-all duration-300 font-semibold hover:translate-x-1">
            {t('legal.privacy')}
          </Link>
          <Link href="/terms" className="hover:text-primary-600 transition-all duration-300 font-semibold hover:translate-x-1">
            {t('legal.terms')}
          </Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
