'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface ProductFiltersProps {
  categorySlug: string;
  products: Product[];
  currentFilters: {
    application?: string;
    enclosure?: string;
    output?: string;
    display?: string;
    sort?: string;
    page?: string;
  };
}

interface FilterOption {
  slug: string;
  name: string;
  count: number;
}

export function ProductFilters({
  categorySlug,
  products,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract filter options from products
  const filterOptions = extractFilterOptions(products);

  // Parse active filters from URL
  const activeFilters = {
    application: currentFilters.application?.split(',') || [],
    enclosure: currentFilters.enclosure?.split(',') || [],
    output: currentFilters.output?.split(',') || [],
    display: currentFilters.display?.split(',') || [],
  };

  const hasActiveFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

  const handleFilterChange = useCallback(
    (filterType: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
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

      // Update URL without scroll
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-6">
        {/* Application Filter */}
        {filterOptions.application.length > 0 && (
          <FilterGroup
            title="Application"
            options={filterOptions.application}
            activeValues={activeFilters.application}
            filterType="application"
            onChange={handleFilterChange}
          />
        )}

        {/* Enclosure Filter */}
        {filterOptions.enclosure.length > 0 && (
          <FilterGroup
            title="Enclosure Style"
            options={filterOptions.enclosure}
            activeValues={activeFilters.enclosure}
            filterType="enclosure"
            onChange={handleFilterChange}
          />
        )}

        {/* Output Filter */}
        {filterOptions.output.length > 0 && (
          <FilterGroup
            title="Sensor Output"
            options={filterOptions.output}
            activeValues={activeFilters.output}
            filterType="output"
            onChange={handleFilterChange}
          />
        )}

        {/* Display Filter */}
        {filterOptions.display.length > 0 && (
          <FilterGroup
            title="Display"
            options={filterOptions.display}
            activeValues={activeFilters.display}
            filterType="display"
            onChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  activeValues: string[];
  filterType: string;
  onChange: (filterType: string, value: string, checked: boolean) => void;
}

function FilterGroup({
  title,
  options,
  activeValues,
  filterType,
  onChange,
}: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide">
          {title}
        </h3>
        <svg
          className={`w-5 h-5 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Options */}
      {isExpanded && (
        <div className="space-y-2">
          {options.map((option) => {
            const isActive = activeValues.includes(option.slug);
            return (
              <label
                key={option.slug}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => onChange(filterType, option.slug, e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="flex-1 text-sm text-neutral-700 group-hover:text-neutral-900">
                  {option.name}
                </span>
                <span className="text-xs text-neutral-400">({option.count})</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Extract unique filter options from products with counts
 */
function extractFilterOptions(products: Product[]) {
  const applicationMap = new Map<string, { name: string; count: number }>();
  const enclosureMap = new Map<string, { name: string; count: number }>();
  const outputMap = new Map<string, { name: string; count: number }>();
  const displayMap = new Map<string, { name: string; count: number }>();

  products.forEach((product) => {
    if (product.__typename === 'SimpleProduct' || product.__typename === 'VariableProduct') {
      const p = product as any;

      // Application
      p.allPaApplication?.nodes?.forEach((attr: any) => {
        const current = applicationMap.get(attr.slug) || { name: attr.name, count: 0 };
        applicationMap.set(attr.slug, { name: attr.name, count: current.count + 1 });
      });

      // Enclosure
      p.allPaRoomEnclosureStyle?.nodes?.forEach((attr: any) => {
        const current = enclosureMap.get(attr.slug) || { name: attr.name, count: 0 };
        enclosureMap.set(attr.slug, { name: attr.name, count: current.count + 1 });
      });

      // Output
      p.allPaTemperatureSensorOutput?.nodes?.forEach((attr: any) => {
        const current = outputMap.get(attr.slug) || { name: attr.name, count: 0 };
        outputMap.set(attr.slug, { name: attr.name, count: current.count + 1 });
      });

      // Display
      p.allPaDisplay?.nodes?.forEach((attr: any) => {
        const current = displayMap.get(attr.slug) || { name: attr.name, count: 0 };
        displayMap.set(attr.slug, { name: attr.name, count: current.count + 1 });
      });
    }
  });

  return {
    application: Array.from(applicationMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count),
    enclosure: Array.from(enclosureMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count),
    output: Array.from(outputMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count),
    display: Array.from(displayMap.entries())
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.count - a.count),
  };
}
