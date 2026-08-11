'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useRef, useEffect, useId } from 'react';
import type {
  GetProductsWithFiltersQuery,
  GetProductsByCategoryQuery,
} from '@/lib/graphql/generated';
import {
  extractProductFilterOptions,
  type ProductFilterKey,
  type ProductFilterOption,
} from '@/lib/productFilters';

// Accept products from either query type
type ProductFromFiltersQuery = NonNullable<
  GetProductsWithFiltersQuery['products']
>['nodes'][number];
type ProductFromCategoryQuery = NonNullable<
  GetProductsByCategoryQuery['products']
>['nodes'][number];
type Product = ProductFromFiltersQuery | ProductFromCategoryQuery;

interface ProductFiltersProps {
  categorySlug: string;
  products: Product[];
  currentFilters: Partial<Record<ProductFilterKey | 'sort' | 'page', string | undefined>>;
}

export function ProductFilters({ products, currentFilters }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Extract filter options from products
  const filterOptions = extractProductFilterOptions(products);

  // Parse active filters from URL
  const activeFilters: Record<string, string[]> = {};
  Object.keys(filterOptions).forEach((key) => {
    activeFilters[key] = currentFilters[key as keyof typeof currentFilters]?.split(',') || [];
  });

  const hasActiveFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

  // Calculate total active filter count for live region announcements
  // Count from currentFilters (URL params) rather than filterOptions to catch all active filters
  const activeFilterCount = Object.entries(currentFilters).reduce((total, [key, value]) => {
    // Exclude non-filter params (sort, page, etc.)
    if (key === 'sort' || key === 'page' || !value) return total;
    // Split comma-separated values and count them
    return total + value.split(',').filter(Boolean).length;
  }, 0);

  const handleFilterChange = useCallback(
    (filterType: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      const current = params.get(filterType)?.split(',').filter(Boolean) || [];

      let updated: string[];
      if (checked) {
        updated = [...current, value];
      } else {
        updated = current.filter((v) => v !== value);
      }

      if (updated.length > 0) {
        params.set(filterType, updated.join(','));
      } else {
        params.delete(filterType);
      }

      // Reset to page 1 when filters change
      params.delete('page');

      // Debounce URL updates to prevent excessive history entries (300ms)
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        // Update URL without scroll
        router.push(`${pathname || ''}?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [searchParams, pathname, router]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname || '/', { scroll: false });
  }, [pathname, router]);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-3">
        <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="rounded px-1 py-1 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Live Region for Screen Reader Announcements (WCAG 4.1.3 Status Messages) */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {activeFilterCount > 0 &&
          `${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied`}
      </div>

      {/* Filter Groups */}
      <div>
        {Object.entries(filterOptions).map(([filterKey, options]) => (
          <FilterGroup
            key={filterKey}
            title={options[0]?.title || filterKey}
            options={options}
            activeValues={activeFilters[filterKey] || []}
            filterType={filterKey}
            onChange={handleFilterChange}
          />
        ))}
      </div>
    </div>
  );
}
interface FilterGroupProps {
  title: string;
  options: ProductFilterOption[];
  activeValues: string[];
  filterType: string;
  onChange: (filterType: string, value: string, checked: boolean) => void;
}

function FilterGroup({ title, options, activeValues, filterType, onChange }: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = useId();

  return (
    <div className="border-b border-neutral-100 py-3 first:pt-1 last:border-0 last:pb-0">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex min-h-9 w-full items-center justify-between gap-3 rounded px-1.5 text-left hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <h3 className="text-[13px] font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-primary-700">
          {title}
        </h3>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 group-hover:text-primary-600 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options */}
      {isExpanded && (
        <div id={contentId} className="mt-1 space-y-0.5">
          {options.map((option) => {
            const isActive = activeValues.includes(option.slug);
            return (
              <label
                key={option.slug}
                className={`group flex min-h-10 cursor-pointer items-start gap-2.5 rounded px-2 py-2 transition-colors ${isActive ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => onChange(filterType, option.slug, e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                />
                <span
                  className={`min-w-0 flex-1 text-sm leading-5 ${isActive ? 'font-semibold text-primary-800' : 'text-neutral-700 group-hover:text-neutral-900'}`}
                >
                  {option.name}
                </span>
                <span
                  className={`mt-0.5 min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs tabular-nums ${isActive ? 'bg-primary-100 font-semibold text-primary-800' : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200'}`}
                >
                  {option.count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
