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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-primary-600"
        aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-primary-600">
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
