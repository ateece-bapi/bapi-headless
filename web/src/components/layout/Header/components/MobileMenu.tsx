'use client';

import React, { useState } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronRight, Globe, Languages } from 'lucide-react';
import clsx from 'clsx';
import { MEGA_MENU_ITEMS } from '../config';
import RegionSelector from './RegionSelector';
import { LanguageSelector } from './LanguageSelector';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleExpanded = (index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <nav
        id="mobile-menu"
        className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-neutral-200 shadow-lg animate-in slide-in-from-top-2 duration-200 z-50 max-h-[calc(100vh-200px)] overflow-y-auto"
        aria-label="Mobile navigation"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Region & Language Settings - Mobile Only */}
          <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 via-white to-primary-50 rounded-lg border border-primary-200 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-bold text-neutral-900">Settings</h3>
            </div>
            <div className="flex flex-col gap-3">
              <RegionSelector />
              <LanguageSelector />
            </div>
          </div>

          {MEGA_MENU_ITEMS.map((item, index) => (
            <div key={item.label} className="border-b border-neutral-100 last:border-0">
              {/* Top-level item */}
              {item.megaMenu ? (
                <button
                  type="button"
                  onClick={() => toggleExpanded(index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-bold text-neutral-900 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
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
                  className="block px-4 py-3 text-base font-semibold text-neutral-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}

              {/* Expanded mega menu content */}
              {item.megaMenu && expandedIndex === index && (
                <div className="px-2 py-3 space-y-4 bg-primary-50/30 rounded-lg border-l-4 border-primary-500">
                  {item.megaMenu.columns.map((column) => {
                    const IconComponent = column.icon;
                    return (
                    <div key={column.title} className="space-y-2">
                      <div className="flex items-center gap-2 px-3 pb-1.5 border-b border-primary-200">
                        {IconComponent && (
                          <div className="p-1 rounded bg-primary-100">
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
                              className="flex items-start gap-2 px-3 py-2.5 text-sm text-neutral-900 font-semibold hover:bg-white hover:text-primary-700 rounded-md transition-all duration-200 border border-transparent hover:border-primary-200 hover:shadow-sm hover:-translate-y-0.5 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 focus-visible:bg-white"
                            >
                              <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-neutral-400" />
                              <div>
                                <div className="font-medium">{link.label}</div>
                                {link.description && (
                                  <div className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                                    {link.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )})}

                  {/* Featured section in mobile */}
                  {item.megaMenu.featured && (
                    <div className="mt-4 p-5 rounded-lg bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-50 border-2 border-accent-400 relative overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-300/0 via-accent-300/20 to-accent-300/0 animate-pulse" style={{ animationDuration: '3s' }} />
                      
                      {/* Content */}
                      <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-500 text-neutral-900 text-xs font-black rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          FEATURED
                        </div>
                        
                        <h4 className="text-base font-black text-neutral-900 leading-tight">
                          {item.megaMenu.featured.title}
                        </h4>
                        
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {item.megaMenu.featured.description}
                        </p>

                        {/* Social Proof - Mobile */}
                        <div className="flex items-center gap-2 py-2 px-2.5 bg-white/60 backdrop-blur-sm rounded-md border border-primary-200/50">
                          <div className="flex -space-x-1.5">
                            <div className="w-5 h-5 rounded-full bg-primary-500 border-2 border-white" />
                            <div className="w-5 h-5 rounded-full bg-primary-400 border-2 border-white" />
                            <div className="w-5 h-5 rounded-full bg-primary-600 border-2 border-white" />
                          </div>
                          <p className="text-xs font-bold text-neutral-900">1,000+ facilities</p>
                        </div>
                        
                        <Link
                          href={item.megaMenu.featured.href}
                          onClick={onClose}
                          className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-black rounded-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-md min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {item.megaMenu.featured.cta}
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
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
}

export default MobileMenu;