'use client';

import { useSearchParams } from 'next/navigation';
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
 * Filters products by:
 * - application (pa_application taxonomy)
 * - enclosure (pa_room_enclosure_style taxonomy)
 * - output (pa_temperature_sensor_output taxonomy)
 * - display (pa_display taxonomy)
 */
export default function FilteredProductGrid({ products, locale }: FilteredProductGridProps) {
  const searchParams = useSearchParams();
  
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

  // Filter products based on active filters
  const filteredProducts = hasActiveFilters
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

  return (
    <div>
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

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} locale={locale} />

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
