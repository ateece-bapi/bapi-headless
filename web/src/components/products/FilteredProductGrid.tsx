'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProductGrid } from './ProductGrid';
import { ProductGridSkeleton } from './ProductGridSkeleton';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface FilteredProductGridProps {
  products: Product[];
  locale: string;
}

/**
 * Client component that filters products based on URL search params
 * 
 * Features:
 * - Filters by 15 product attribute taxonomies
 * - Skeleton loading state during filter changes
 * - Screen reader announcements via aria-live
 * - Debounced filter updates (300ms)
 */
export default function FilteredProductGrid({ products, locale }: FilteredProductGridProps) {
  const searchParams = useSearchParams();
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  
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
  Object.keys(filterFieldMap).forEach(filterKey => {
    const values = searchParams.get(filterKey)?.split(',').filter(Boolean) || [];
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
              const hasMatch = selectedValues.some(value => productAttributes.includes(value));
              
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

  return (
    <div>
      {/* Screen reader announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isFiltering
          ? 'Updating product results...'
          : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
        }
      </div>
      {/* Active Filter Pills with animations */}
      {hasActiveFilters && (
        <div className="mb-8 animate-[fade-in_300ms_ease-out]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 px-4 py-2 rounded-full">
              <svg
                className="w-4 h-4 text-primary-600"
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
                <div
                  key={`${type}-${value}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary-500 text-primary-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-[fade-in_300ms_ease-out]"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <span className="font-semibold capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-neutral-900">{value.replace(/-/g, ' ')}</span>
                </div>
              ))
            )}
          </div>
          
          {/* Product count with animated number transition */}
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="font-medium">
              Showing{' '}
              <span className="text-primary-600 font-bold tabular-nums">
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
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 animate-[fade-in_200ms_ease-out]">
            <ProductGridSkeleton count={9} />
          </div>
        )}
        
        <div className={isFiltering ? 'opacity-50' : 'opacity-100 transition-opacity duration-300'}>
          <ProductGrid products={filteredProducts} locale={locale} />
        </div>
      </div>

      {/* No Results Message */}
      {hasActiveFilters && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No products match your filters
          </h3>
          <p className="text-neutral-600 mb-6">
            Try removing some filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
}
