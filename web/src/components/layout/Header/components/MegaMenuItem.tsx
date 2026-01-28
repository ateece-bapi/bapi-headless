'use client';

import React, { useRef } from 'react';
import { Link } from '@/lib/navigation';
import { ChevronDown, Radio } from 'lucide-react';
import clsx from 'clsx';
import type { MegaMenuItem } from '../types';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface MegaMenuItemProps {
  item: MegaMenuItem;
  index: number;
  isOpen: boolean;
  onOpenWithIntent: () => void;
  onCloseWithGrace: () => void;
  onCancelTimers: () => void;
  onToggle: () => void;
  onCloseImmediate: () => void;
}

const MegaMenuItemComponent: React.FC<MegaMenuItemProps> = ({
  item,
  index,
  isOpen,
  onOpenWithIntent,
  onCloseWithGrace,
  onCancelTimers,
  onToggle,
  onCloseImmediate,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `mega-menu-${index}`;

  // Close on outside click
  useOutsideClick(panelRef, onCloseImmediate, isOpen);

  // If no mega menu, render simple link
  if (!item.megaMenu) {
    return (
      <Link
        href={item.href || '#'}
        className="group relative inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold text-neutral-700 hover:text-white hover:bg-primary-600 transition-all duration-300 ease-out hover:shadow-sm"
      >
        {item.label}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-primary-400 transition-all duration-300 ease-out" />
      </Link>
    );
  }

  // ...existing code...
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
    if (e.key === 'Escape') {
      onCloseImmediate();
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button: Use <Link> when href exists, <button> otherwise */}
      {item.href ? (
        <Link
          href={item.href}
          ref={buttonRef as any}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onMouseEnter={onOpenWithIntent}
          onMouseLeave={onCloseWithGrace}
          onFocus={onOpenWithIntent}
          onBlur={onCloseWithGrace}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={clsx(
            'group relative inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold transition-all duration-300 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            isOpen
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-white hover:bg-primary-600 hover:shadow-sm',
            'cursor-pointer'
          )}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={clsx(
              'h-4 w-4 transition-all duration-300 ease-out',
              isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
            )}
            aria-hidden="true"
          />
          <span className="sr-only">{isOpen ? 'close menu' : 'open menu'}</span>
          {!isOpen && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-primary-400 transition-all duration-300 ease-out" />}
        </Link>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onMouseEnter={onOpenWithIntent}
          onMouseLeave={onCloseWithGrace}
          onFocus={onOpenWithIntent}
          onBlur={onCloseWithGrace}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className={clsx(
            'group relative inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-base font-semibold transition-all duration-300 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'cursor-pointer',
            isOpen
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-neutral-700 hover:text-white hover:bg-primary-600 hover:shadow-sm'
          )}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={clsx(
              'h-4 w-4 transition-all duration-300 ease-out',
              isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
            )}
            aria-hidden="true"
          />
          <span className="sr-only">{isOpen ? 'close menu' : 'open menu'}</span>
          {!isOpen && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-0.5 bg-primary-400 transition-all duration-300 ease-out" />}
        </button>
      )}

      {/* Mega Menu Panel */}
      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-label={`${item.label} menu`}
        onMouseEnter={onCancelTimers}
        onMouseLeave={onCloseWithGrace}
        className={clsx(
          'absolute left-0 md:left-1/2 top-full z-50 mt-2 md:-translate-x-1/2',
          'mx-auto max-w-7xl w-[min(100vw-1rem,72rem)]',
          'overflow-y-auto max-h-[calc(100vh-8rem)] rounded-2xl border-2 border-primary-500/20 bg-white shadow-2xl',
          'p-3 sm:p-4 md:p-5',
          'origin-top transition-all duration-300 ease-out',
          'focus-within:border-primary-500/40',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0 pointer-events-none'
        )}
      >
        <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-12">
          {/* Main Columns */}
          <div className="md:col-span-9">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {item.megaMenu.columns.map((column, colIndex) => {
                // Handle both string (image path) and React component icons
                const IconComponent = typeof column.icon === 'string' ? null : column.icon;
                const iconPath = typeof column.icon === 'string' ? column.icon : null;
                
                return (
                <div 
                  key={column.title} 
                  className="space-y-3 relative animate-in fade-in slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${colIndex * 75}ms` }}
                >
                  {/* Column divider (except first column) */}
                  {colIndex > 0 && (
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent hidden xl:block" />
                  )}
                  
                  {/* Column header with icon */}
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-primary-500/20">
                    {iconPath ? (
                      <div className="p-1.5 rounded-md bg-primary-100">
                        <img 
                          src={iconPath} 
                          alt={`${column.title} icon`}
                          className="h-5 w-5 object-contain"
                        />
                      </div>
                    ) : IconComponent ? (
                      <div className="p-1.5 rounded-md bg-primary-100">
                        <IconComponent className="h-4 w-4 text-primary-700" />
                      </div>
                    ) : null}
                    <h3 className="text-xs font-black uppercase tracking-wider text-primary-800">
                      {column.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {column.links.map((link, linkIndex) => (
                      <li key={`${link.href}-${link.label}-${linkIndex}`}>
                        <Link
                          href={link.href}
                          onClick={onCloseImmediate}
                          className="group block rounded-lg p-2.5 bg-white hover:bg-primary-50 transition-all duration-300 ease-out hover:shadow-sm border border-transparent hover:border-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:bg-primary-50"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 ease-out">
                              {link.label}
                            </span>
                            {link.badge && (
                              <span className="inline-flex items-center rounded-full bg-accent-500 px-2.5 py-1 text-xs font-bold text-neutral-900 shadow-sm">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          {link.description && (
                            <p className="mt-1.5 text-xs text-neutral-700 leading-relaxed">
                              {link.description}
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  {/* View All Link */}
                  <Link
                    href={`/products/${column.title.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                    onClick={onCloseImmediate}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 hover:gap-2 transition-all"
                  >
                    View All {column.title}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )})}
            </div>
          </div>

          {/* Featured Section */}
          {item.megaMenu.featured && (
            <div className="md:col-span-3">
              <div className={clsx(
                "rounded-xl border-2 p-5 sm:p-6 md:p-8 transition-shadow duration-300 relative overflow-hidden",
                // WAM™ gets yellow accent styling
                item.megaMenu.featured.title.includes('WAM™')
                  ? "border-accent-400 bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-50 hover:shadow-2xl hover:shadow-accent-500/20"
                  : "border-accent-400 bg-gradient-to-br from-accent-50 via-accent-100/80 to-accent-50 hover:shadow-2xl hover:shadow-accent-500/20"
              )}>
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,200,67,0.3)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-accent-300/0 via-accent-300/20 to-accent-300/0 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                
                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 text-neutral-900 text-xs font-black rounded-full shadow-sm">
                    {item.megaMenu.featured.badge ? (
                      <>
                        <Radio className="w-3 h-3" />
                        {item.megaMenu.featured.badge}
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        FEATURED PRODUCT
                      </>
                    )}
                  </div>

                  {/* Product Image Placeholder */}
                  <div className={clsx(
                    "w-full aspect-video rounded-lg overflow-hidden shadow-inner relative",
                    item.megaMenu.featured.title.includes('WAM™')
                      ? "bg-gradient-to-br from-accent-200 to-accent-300"
                      : "bg-gradient-to-br from-primary-100 to-primary-200"
                  )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        {item.megaMenu.featured.title.includes('WAM™') ? (
                          <>
                            <Radio className="w-16 h-16 mx-auto text-accent-600 mb-2" />
                            <p className="text-xs text-accent-700 font-semibold">Wireless Monitoring</p>
                          </>
                        ) : (
                          <>
                            <svg className="w-16 h-16 mx-auto text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            <p className="text-xs text-primary-600 font-semibold">Product Image</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-black text-neutral-900 leading-tight">
                    {item.megaMenu.featured.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {item.megaMenu.featured.description}
                  </p>

                  {/* Social Proof */}
                  <div className="flex items-center gap-2 py-2 px-3 bg-white/60 backdrop-blur-sm rounded-lg border border-primary-200/50">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-primary-500 border-2 border-white" />
                      <div className="w-6 h-6 rounded-full bg-primary-400 border-2 border-white" />
                      <div className="w-6 h-6 rounded-full bg-primary-600 border-2 border-white" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-neutral-900">Used by 1,000+ facilities</p>
                      <p className="text-neutral-600">Trusted worldwide</p>
                    </div>
                  </div>
                  
                  {/* Enhanced CTA */}
                  <Link
                    href={item.megaMenu.featured.href}
                    onClick={onCloseImmediate}
                    className="group flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 text-white text-base font-black rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {item.megaMenu.featured.cta}
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* B2B Quick Actions Footer */}
        <div className="mt-6 pt-6 border-t-2 border-neutral-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Need Help Section */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary-100">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">Need help choosing?</p>
                <p className="text-xs text-neutral-600 mt-0.5">Our product selector tool can help you find the right sensor</p>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/contact-sales"
                onClick={onCloseImmediate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors border border-primary-200 hover:border-primary-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Sales
              </Link>
              <Link
                href="/where-to-buy"
                onClick={onCloseImmediate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-md transition-colors border border-neutral-200 hover:border-neutral-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Find Distributor
              </Link>
              <Link
                href="/support"
                onClick={onCloseImmediate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-md transition-colors border border-neutral-200 hover:border-neutral-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Technical Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuItemComponent;
