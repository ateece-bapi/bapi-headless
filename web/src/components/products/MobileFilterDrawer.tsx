'use client';

import { useEffect, useRef } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categorySlug: string;
  products: Product[];
  currentFilters: Record<string, string | undefined>;
  activeFilterCount: number;
}

/**
 * Mobile filter drawer that slides up from bottom
 *
 * Features:
 * - Slides up from bottom with smooth animation
 * - Backdrop overlay with click-to-close
 * - Prevents body scroll when open
 * - ESC key to close
 * - Focus trap for accessibility
 * - Touch-friendly close button
 */
export function MobileFilterDrawer({
  isOpen,
  onClose,
  categorySlug,
  products,
  currentFilters,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap - keep focus inside drawer
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="z-modal-backdrop fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="z-modal animate-slide-up fixed bottom-0 left-0 right-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 p-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary-500" />
            <h2 id="mobile-filters-title" className="text-lg font-bold text-neutral-900">
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
            aria-label="Close filters"
          >
            <X className="h-6 w-6 text-neutral-600" />
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          <ProductFilters
            categorySlug={categorySlug}
            products={products}
            currentFilters={currentFilters}
          />
        </div>

        {/* Footer with Apply Button */}
        <div className="flex-shrink-0 border-t border-neutral-200 bg-neutral-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-primary-600"
          >
            Apply Filters
            {activeFilterCount > 0 && <span className="ml-2">({activeFilterCount})</span>}
          </button>
        </div>
      </div>

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
