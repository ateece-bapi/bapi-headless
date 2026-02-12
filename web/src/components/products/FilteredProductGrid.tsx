'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { ProductGrid } from './ProductGrid';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import { Pagination } from './Pagination';
import ComparisonButton from './ComparisonButton';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';
import { getProductPrice } from '@/lib/graphql/types';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface FilteredProductGridProps {
  products: Product[];
  locale: string;
}

const PRODUCTS_PER_PAGE = 18;

/**
 * Client component that filters, sorts, and paginates products
 *
 * Features:
 * - Filters by 15 product attribute taxonomies
 * - Sort by name (A-Z, Z-A) and price (Low-High, High-Low)
 * - Pagination (18 products per page)
 * - Skeleton loading state during filter changes
 * - Screen reader announcements via aria-live
 * - Debounced filter updates (300ms)
 */
export default function FilteredProductGrid({ products, locale }: FilteredProductGridProps) {
  const searchParams = useSearchParams();
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const sortBy = searchParams?.get('sort') || 'default';
  const currentPage = parseInt(searchParams?.get('page') || '1', 10);

  // Define all possible filter keys and their corresponding GraphQL fields
  const filterFieldMap: Record<string, string> = {
    application: 'allPaApplication',
    roomEnclosure: 'allPaRoomEnclosureStyle',
    sensorOutput: 'allPaTemperatureSensorOutput',
    display: 'allPaDisplay',
    setpointOverride: 'allPaTempSetpointAndOverride',
    optionalTempHumidity: 'allPaOptionalTempHumidity',
    optionalSensorOutput: 'allPaOptionalTempSensorOutput',
    humidityApplication: 'allPaHumidityApplication',
    humidityRoomEnclosure: 'allPaHumidityRoomEnclosure',
    humiditySensorOutput: 'allPaHumiditySensorOutput',
    pressureApplication: 'allPaPressureApplication',
    pressureSensorStyle: 'allPaPressureSensorStyle',
    airQualityApplication: 'allPaAirQualityApplication',
    airQualitySensorType: 'allPaAirQualitySensorType',
    wirelessApplication: 'allPaWirelessApplication',
  };

  // Get active filters from URL (comma-separated values)
  const activeFilters: Record<string, string[]> = {};
  Object.keys(filterFieldMap).forEach((filterKey) => {
    const values = searchParams?.get(filterKey)?.split(',').filter(Boolean) || [];
    if (values.length > 0) {
      activeFilters[filterKey] = values;
    }
  });

  // Check if any filters are active
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Debounced filtering with loading state
  useEffect(() => {
    setIsFiltering(true);

    const timer = setTimeout(() => {
      // Filter products based on active filters
      const filtered = hasActiveFilters
        ? products.filter((product) => {
            const p = product as any;

            // Check each filter category
            for (const [filterKey, selectedValues] of Object.entries(activeFilters)) {
              if (selectedValues.length === 0) continue;

              // Get the GraphQL field name for this filter
              const fieldName = filterFieldMap[filterKey];
              if (!fieldName) continue;

              // Get the product's attributes for this filter type
              const productAttributes = (p[fieldName]?.nodes || [])
                .map((attr: any) => attr?.slug)
                .filter((slug: any): slug is string => slug !== null && slug !== undefined);

              // Check if product has ANY of the selected values for this filter
              const hasMatch = selectedValues.some((value) => productAttributes.includes(value));

              // If no match for this filter category, exclude the product
              if (!hasMatch) return false;
            }

            // Product matches all active filter categories
            return true;
          })
        : products;

      setFilteredProducts(filtered);
      setIsFiltering(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchParams, products, hasActiveFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = parseFloat(getProductPrice(a as any)?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(getProductPrice(b as any)?.replace(/[^0-9.]/g, '') || '0');
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = parseFloat(getProductPrice(a as any)?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(getProductPrice(b as any)?.replace(/[^0-9.]/g, '') || '0');
          return priceB - priceA;
        });
        break;
      default:
        // Keep original order
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  return (
    <div>
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isFiltering
          ? 'Updating product results...'
          : `Showing ${paginatedProducts.length} of ${sortedProducts.length} products. Page ${currentPage} of ${totalPages}.`}
      </div>

      {/* Active Filter Pills with animations */}
      {hasActiveFilters && (
        <div className="mb-8 animate-[fade-in_300ms_ease-out]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 px-4 py-2">
              <svg
                className="h-4 w-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-sm font-semibold text-primary-700">
                {Object.values(activeFilters).flat().length} Active Filters
              </span>
            </div>

            {Object.entries(activeFilters).map(([type, values]) =>
              values.map((value, index) => (
                <button
                  key={`${type}-${value}`}
                  className="inline-flex animate-[fade-in_300ms_ease-out] items-center gap-2 rounded-full border-2 border-primary-500 bg-white px-4 py-2 text-sm font-medium text-primary-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:border-primary-600 focus-visible:ring-4 focus-visible:ring-primary-500/50"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    params.delete(type);
                    window.history.pushState({}, '', `?${params.toString()}`);
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const params = new URLSearchParams(searchParams?.toString() || '');
                      params.delete(type);
                      window.history.pushState({}, '', `?${params.toString()}`);
                      window.dispatchEvent(new Event('popstate'));
                    }
                  }}
                  aria-label={`Remove filter: ${type} - ${value}`}
                >
                  <span className="font-semibold capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-neutral-900">{value.replace(/-/g, ' ')}</span>
                  <svg
                    className="h-4 w-4 text-primary-600 transition-colors hover:text-error-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>

          {/* Product count with animated number transition */}
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="font-medium">
              Showing{' '}
              <span className="font-bold tabular-nums text-primary-600">
                {filteredProducts.length}
              </span>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>
      )}

      {/* Product Grid with smooth loading transition */}
      <div className="relative">
        {isFiltering && (
          <div className="absolute inset-0 z-10 animate-[fade-in_200ms_ease-out] bg-white/80 backdrop-blur-sm">
            <ProductGridSkeleton count={9} />
          </div>
        )}

        <div className={isFiltering ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'}>
          <ProductGrid products={paginatedProducts} locale={locale} />
        </div>
      </div>

      {/* Pagination Controls */}
      {sortedProducts.length > PRODUCTS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={sortedProducts.length}
        />
      )}

      {/* No Results Message */}
      {hasActiveFilters && filteredProducts.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-neutral-900">
            No products match your filters
          </h3>
          <p className="mb-6 text-neutral-600">Try removing some filters to see more results.</p>
        </div>
      )}

      {/* Floating Comparison Button */}
      <ComparisonButton locale={locale} />
    </div>
  );
}
