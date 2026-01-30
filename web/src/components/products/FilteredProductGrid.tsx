'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ProductGrid } from './ProductGrid';
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
      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-600">Active Filters:</span>
          
          {Object.entries(activeFilters).map(([type, values]) =>
            values.map((value) => (
              <div
                key={`${type}-${value}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
              >
                <span className="capitalize">{type}:</span>
                <span className="font-semibold">{value.replace(/-/g, ' ')}</span>
              </div>
            ))
          )}
          
          <span className="text-sm text-neutral-500 ml-2">
            ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
          </span>
        </div>
      )}

      {/* Product Grid with loading overlay */}
      {isFiltering ? (
        <div className="relative">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-white/70 z-10 animate-[fade-in_150ms_ease-out]" />
          
          {/* Skeleton loading grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-lg mb-4" />
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} locale={locale} />
      )}

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
