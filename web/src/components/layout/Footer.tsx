import React from 'react';
import Link from 'next/link';
import { Linkedin, Youtube } from 'lucide-react';

const footerSections = [
  {
    title: 'Products',
    links: [
      { label: 'Temperature Sensors', href: '/products/temperature' },
      { label: 'Humidity Sensors', href: '/products/humidity' },
      { label: 'Pressure Sensors', href: '/products/pressure' },
      { label: 'Air Quality', href: '/products/air-quality' },
      { label: 'Wireless Solutions', href: '/products/wireless' },
      { label: 'Controllers', href: '/products/controllers' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Healthcare', href: '/solutions/healthcare' },
      { label: 'Data Centers', href: '/solutions/data-centers' },
      { label: 'Commercial Buildings', href: '/solutions/commercial' },
      { label: 'Manufacturing', href: '/solutions/manufacturing' },
      { label: 'BACnet Integration', href: '/solutions/bacnet' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Technical Datasheets', href: '/resources/datasheets' },
      { label: 'Installation Guides', href: '/resources/installation' },
      { label: 'Application Notes', href: '/resources/application-notes' },
      { label: 'Video Library', href: '/resources/videos' },
      { label: 'Case Studies', href: '/resources/case-studies' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Mission & Values', href: '/company/mission-values' },
      { label: 'Why BAPI', href: '/company/why-bapi' },
      { label: 'News', href: '/company/news' },
      { label: 'Careers', href: '/company/careers' },
      { label: 'Contact Us', href: '/company/contact-us' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Technical Support', href: '/support' },
      { label: 'Product Selector', href: '/resources/selector' },
      { label: 'Cross Reference', href: '/resources/cross-reference' },
      { label: 'Distributor Network', href: '/where-to-buy' },
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

const Footer: React.FC = () => (
  <footer className="w-full bg-neutral-50 border-t border-neutral-200 mt-16 relative">
    {/* Gradient Accent Line */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
    
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
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
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">Precision Sensor Solutions</span> for Building Automation.
          </p>
          <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
            Trusted by engineers worldwide for mission-critical facilities since 1993.
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
          <nav key={section.title} className="flex flex-col gap-3 group">
            <h3 className="font-extrabold text-sm lg:text-base text-primary-600 uppercase tracking-wide mb-2 relative pb-2">
              {section.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-500"></span>
            </h3>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-700 hover:text-primary-600 hover:translate-x-1 transition-all duration-300 inline-block font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom Section - Contact & Legal */}
      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-8 border-b border-neutral-200">
        {/* Contact Information */}
        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            Contact
          </h4>
          <address className="not-italic text-sm text-neutral-700 space-y-2 font-medium">
            <p className="text-neutral-900">750 N Royal Ave</p>
            <p className="text-neutral-900">Gays Mills, WI 54631</p>
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

        {/* Certifications */}
        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            Certifications
          </h4>
          <div className="text-sm text-neutral-700 space-y-2 font-medium">
            <p className="text-neutral-900">BACnet B-ASC Certified</p>
            <p className="text-neutral-900">ISO 9001:2015</p>
            <p className="text-neutral-900">UL Listed</p>
            <p className="text-neutral-900">UL Listed</p>
            <p>Made in USA</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-sm text-primary-600 uppercase tracking-wide mb-2">
            Quick Actions
          </h4>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-neutral-900 font-bold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 border-2 border-accent-600"
          >
            Request Quote
          </Link>
          <Link
            href="/where-to-buy"
            className="inline-flex items-center justify-center px-5 py-3 bg-white border-2 border-neutral-300 text-neutral-700 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 font-bold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
          >
            Find Distributor
          </Link>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="space-y-1.5 font-medium">
          <p>© {new Date().getFullYear()} Building Automation Products, Inc. All rights reserved.</p>
          <p className="text-neutral-500">BAPI® is a registered trademark of Building Automation Products, Inc.</p>
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary-600 transition-all duration-300 font-semibold hover:translate-x-1">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary-600 transition-all duration-300 font-semibold hover:translate-x-1">
            Terms of Use
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
