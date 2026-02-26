'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ProductGrid } from './ProductGrid';
import { Pagination } from './Pagination';
import ComparisonButton from './ComparisonButton';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

interface FilteredProductGridProps {
  products: Product[];
  locale: string;
}

const PRODUCTS_PER_PAGE = 18;

/**
 * Map of URL filter keys to GraphQL field names
 * Phase 1: Product Navigation - 15 filter taxonomies for mega-menu integration
 */
type FilterFieldKey =
  | 'application'
  | 'roomEnclosure'
  | 'sensorOutput'
  | 'display'
  | 'setpointOverride'
  | 'optionalTempHumidity'
  | 'optionalSensorOutput'
  | 'humidityApplication'
  | 'humidityRoomEnclosure'
  | 'humiditySensorOutput'
  | 'pressureApplication'
  | 'pressureSensorStyle'
  | 'airQualityApplication'
  | 'airQualitySensorType'
  | 'wirelessApplication';

type FilterFieldMap = Record<FilterFieldKey, string>;

/**
 * Type guard to check if a string is a valid FilterFieldKey
 */
function isFilterFieldKey(key: string): key is FilterFieldKey {
  const validKeys: FilterFieldKey[] = [
    'application',
    'roomEnclosure',
    'sensorOutput',
    'display',
    'setpointOverride',
    'optionalTempHumidity',
    'optionalSensorOutput',
    'humidityApplication',
    'humidityRoomEnclosure',
    'humiditySensorOutput',
    'pressureApplication',
    'pressureSensorStyle',
    'airQualityApplication',
    'airQualitySensorType',
    'wirelessApplication',
  ];
  return validKeys.includes(key as FilterFieldKey);
}

/**
 * Type for product with taxonomy fields
 * Uses intersection type instead of extends for GraphQL union type compatibility
 */
type ProductWithTaxonomies = Product & {
  [key: string]: unknown;
};

/**
 * Type for taxonomy node structure from GraphQL
 */
interface TaxonomyNode {
  slug?: string | null;
}

interface TaxonomyConnection {
  nodes?: (TaxonomyNode | null)[] | null;
}

/**
 * Client component that filters, sorts, and paginates products
 * Phase 1 Priority: Product Navigation (April 10, 2026 deadline)
 *
 * Features:
 * - Filters by 15 product attribute taxonomies
 * - Sort by name (A-Z, Z-A) and price (Low-High, High-Low)
 * - Pagination (18 products per page)
 * - Screen reader announcements via aria-live
 * - Type-safe with no 'any' types (ESLint compliant)
 * - Uses useMemo for synchronous filtering (no cascading renders)
 */
export default function FilteredProductGrid({ products, locale }: FilteredProductGridProps) {
  const searchParams = useSearchParams();
  const sortBy = searchParams?.get('sort') || 'default';
  const currentPage = parseInt(searchParams?.get('page') || '1', 10);

  // Define all possible filter keys and their corresponding GraphQL fields
  // Wrapped in useMemo to prevent recreating on every render
  const filterFieldMap = useMemo<FilterFieldMap>(
    () => ({
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
    }),
    [] // Empty dependency array - this mapping never changes
  );

  // Get active filters from URL (comma-separated values)
  const activeFilters = useMemo(() => {
    const filters: Partial<Record<FilterFieldKey, string[]>> = {};

    (Object.keys(filterFieldMap) as FilterFieldKey[]).forEach((filterKey) => {
      const values = searchParams?.get(filterKey)?.split(',').filter(Boolean) || [];
      if (values.length > 0) {
        filters[filterKey] = values;
      }
    });

    return filters;
  }, [searchParams, filterFieldMap]);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Helper to extract numeric price from product
  const getNumericPrice = (product: Product): number => {
    const productData = product as ProductWithTaxonomies;

    // Try multiple price fields in order of preference
    const price =
      (typeof productData.price === 'string' ? productData.price : null) ||
      (typeof productData.regularPrice === 'string' ? productData.regularPrice : null) ||
      (typeof productData.salePrice === 'string' ? productData.salePrice : null) ||
      '0';

    // Extract numeric value from price string (handles "$123.45" or "123.45")
    const numericValue = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  // Filter products using useMemo (synchronous, no setState in effects)
  const filteredProducts = useMemo(() => {
    if (!hasActiveFilters) return products;

    return products.filter((product) => {
      const p = product as ProductWithTaxonomies;

      // Check each filter category
      for (const [filterKey, selectedValues] of Object.entries(activeFilters)) {
        if (!isFilterFieldKey(filterKey) || !selectedValues || selectedValues.length === 0)
          continue;

        // Get the GraphQL field name for this filter
        const fieldName = filterFieldMap[filterKey];
        if (!fieldName) continue;

        // Get the product's attributes for this filter type
        const taxonomyField = p[fieldName] as TaxonomyConnection | undefined;
        const productAttributes = (taxonomyField?.nodes || [])
          .map((attr) => attr?.slug)
          .filter((slug): slug is string => typeof slug === 'string');

        // Check if product has ANY of the selected values for this filter
        const hasMatch = selectedValues.some((value) => productAttributes.includes(value));

        // If no match for this filter category, exclude the product
        if (!hasMatch) return false;
      }

      // Product matches all active filter categories
      return true;
    });
  }, [products, hasActiveFilters, activeFilters, filterFieldMap]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'price-asc':
        return sorted.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
      case 'price-desc':
        return sorted.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Track filter usage for analytics (Sentry breadcrumbs)
  useEffect(() => {
    if (hasActiveFilters) {
      Sentry.addBreadcrumb({
        category: 'product-filter',
        message: 'Filter applied',
        level: 'info',
        data: {
          activeFilters: Object.keys(activeFilters),
          filterCount: Object.keys(activeFilters).length,
          resultCount: totalProducts,
          sortBy,
        },
      });
    }
  }, [activeFilters, hasActiveFilters, totalProducts, sortBy]);

  return (
    <>
      <ProductGrid products={paginatedProducts} locale={locale} />

      {totalProducts > 0 && (
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
          role="status"
          aria-relevant="text"
        >
          Showing {startIndex + 1} to {Math.min(endIndex, totalProducts)} of {totalProducts}{' '}
          products
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
        />
      )}

      <ComparisonButton locale={locale} />
    </>
  );
}
