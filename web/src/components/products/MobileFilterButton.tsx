'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface MobileFilterButtonProps {
  categorySlug: string;
  products: Product[];
  currentFilters: Record<string, string | undefined>;
}

/**
 * Mobile filter button with drawer control
 * 
 * Counts active filters and displays badge
 * Opens mobile filter drawer on click
 */
export function MobileFilterButton({
  categorySlug,
  products,
  currentFilters,
}: MobileFilterButtonProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(currentFilters).filter(
    (value) => value && value.length > 0
  ).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
        aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-white text-primary-600 text-sm font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      <MobileFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categorySlug={categorySlug}
        products={products}
        currentFilters={currentFilters}
        activeFilterCount={activeFilterCount}
      />
    </>
  );
}
