'use client';

import React, { useState } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronRight, Globe, Languages } from 'lucide-react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { getMegaMenuItems } from '../config';
import { RegionSelector, LanguageSelector } from './index';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = useTranslations('megaMenu');

  // Generate menu items with translations
  const menuItems = getMegaMenuItems(t);

  if (!isOpen) return null;

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <nav
        id="mobile-menu"
        className="animate-in slide-in-from-top-2 absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-200px)] overflow-y-auto border-t border-neutral-200 bg-white shadow-lg duration-200 lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          {/* Region & Language Settings - Mobile Only */}
          <div className="mb-4 space-y-3 rounded-lg border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-primary-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary-600" />
              <h3 className="text-sm font-bold text-neutral-900">Settings</h3>
            </div>
            <div className="flex flex-col gap-3">
              <RegionSelector />
              <LanguageSelector />
            </div>
          </div>

          {menuItems.map((item, index) => (
            <div key={item.label} className="border-b border-neutral-100 last:border-0">
              {/* Top-level item */}
              {item.megaMenu ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(index)}
                  className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-4 py-3 text-base font-bold text-neutral-900 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  aria-expanded={expandedIndex === index}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={clsx(
                      'h-5 w-5 text-neutral-400 transition-transform duration-200',
                      expandedIndex === index && 'rotate-90'
                    )}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="block min-h-[44px] rounded-lg px-4 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}

              {/* Expanded mega menu content */}
              {item.megaMenu && expandedIndex === index && (
                <div className="space-y-4 rounded-lg border-l-4 border-primary-500 bg-primary-50/30 px-2 py-3">
                  {item.megaMenu.columns.map((column) => {
                    const IconComponent = column.icon;
                    return (
                      <div key={column.title} className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-primary-200 px-3 pb-1.5">
                          {IconComponent && (
                            <div className="rounded bg-primary-100 p-1">
                              <IconComponent className="h-3 w-3 text-primary-700" />
                            </div>
                          )}
                          <h3 className="text-xs font-black uppercase tracking-wider text-primary-800">
                            {column.title}
                          </h3>
                        </div>
                        <ul className="space-y-1">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="flex min-h-[44px] items-start gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:text-primary-700 hover:shadow-sm focus:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                              >
                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                                <div>
                                  <div className="font-medium">{link.label}</div>
                                  {link.description && (
                                    <div className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                                      {link.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}

                  {/* Featured section in mobile */}
                  {item.megaMenu.featured && (
                    <div className="relative mt-4 overflow-hidden rounded-lg border-2 border-accent-400 bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-50 p-5">
                      {/* Animated background */}
                      <div
                        className="absolute inset-0 animate-pulse bg-gradient-to-br from-accent-300/0 via-accent-300/20 to-accent-300/0"
                        style={{ animationDuration: '3s' }}
                      />

                      {/* Content */}
                      <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-black text-neutral-900">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          FEATURED
                        </div>

                        <h4 className="text-base font-black leading-tight text-neutral-900">
                          {item.megaMenu.featured.title}
                        </h4>

                        <p className="text-xs leading-relaxed text-neutral-700">
                          {item.megaMenu.featured.description}
                        </p>

                        {/* Social Proof - Mobile */}
                        <div className="flex items-center gap-2 rounded-md border border-primary-200/50 bg-white/60 px-2.5 py-2 backdrop-blur-sm">
                          <div className="flex -space-x-1.5">
                            <div className="h-5 w-5 rounded-full border-2 border-white bg-primary-500" />
                            <div className="h-5 w-5 rounded-full border-2 border-white bg-primary-400" />
                            <div className="h-5 w-5 rounded-full border-2 border-white bg-primary-600" />
                          </div>
                          <p className="text-xs font-bold text-neutral-900">1,000+ facilities</p>
                        </div>

                        <Link
                          href={item.megaMenu.featured.href}
                          onClick={onClose}
                          className="group flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-black text-white shadow-md transition-all hover:scale-105 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {item.megaMenu.featured.cta}
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileMenu;
