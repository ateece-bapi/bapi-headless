'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';
import type { GetProductsWithFiltersQuery, GetProductsByCategoryQuery } from '@/lib/graphql/generated';

// Accept products from either query type
type ProductFromFiltersQuery = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];
type ProductFromCategoryQuery = NonNullable<GetProductsByCategoryQuery['products']>['nodes'][number];
type Product = ProductFromFiltersQuery | ProductFromCategoryQuery;

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

export function ProductFilters({ categorySlug, products, currentFilters }: ProductFiltersProps) {
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
  const filterOptions = extractFilterOptions(products);

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
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-bold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-primary-500 transition-colors duration-200 hover:text-primary-600 hover:underline"
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
      <div className="space-y-6">
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
  options: FilterOption[];
  activeValues: string[];
  filterType: string;
  onChange: (filterType: string, value: string, checked: boolean) => void;
}

function FilterGroup({ title, options, activeValues, filterType, onChange }: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="group mb-4 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 transition-colors duration-200 group-hover:text-primary-600">
          {title}
        </h3>
        <svg
          className={`h-5 w-5 text-neutral-500 transition-all duration-300 ease-out group-hover:text-primary-600 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options */}
      {isExpanded && (
        <div className="animate-[fade-in_200ms_ease-out] space-y-3">
          {options.map((option) => {
            const isActive = activeValues.includes(option.slug);
            return (
              <label
                key={option.slug}
                className="group -mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => onChange(filterType, option.slug, e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-primary-500 transition-colors duration-150 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                />
                <span
                  className={`flex-1 text-sm transition-colors duration-200 ${isActive ? 'font-medium text-neutral-900' : 'text-neutral-700 group-hover:text-neutral-900'}`}
                >
                  {option.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs transition-colors duration-200 ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200'}`}
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

/**
 * Extract unique filter options from products with counts
 */
function extractFilterOptions(products: Product[]) {
  // Map attribute names to filter keys and titles
  // NOTE: WooCommerce uses BOTH underscores and hyphens in attribute names
  const attributeMap: Record<string, { key: string; title: string }> = {
    // Temperature filters
    'pa_application': { key: 'application', title: 'Temperature Application' },
    'pa-application': { key: 'application', title: 'Temperature Application' },
    'pa_room_enclosure_style': { key: 'roomEnclosure', title: 'Temperature Room Enclosure Style' },
    'pa_room-enclosure-style': { key: 'roomEnclosure', title: 'Temperature Room Enclosure Style' },
    'pa_temperature_sensor_output': { key: 'sensorOutput', title: 'Temperature Sensor/Output' },
    'pa_temperature-sensor-output': { key: 'sensorOutput', title: 'Temperature Sensor/Output' },
    'pa_display': { key: 'display', title: 'Display' },
    'pa-display': { key: 'display', title: 'Display' },
    'pa_temp_setpoint_and_override': { key: 'setpointOverride', title: 'Temperature Setpoint and Override' },
    'pa_temp-setpoint-and-override': { key: 'setpointOverride', title: 'Temperature Setpoint and Override' },
    'pa_optional_temp_humidity': { key: 'optionalTempHumidity', title: 'Optional Temp & Humidity' },
    'pa_optional-temp-humidity': { key: 'optionalTempHumidity', title: 'Optional Temp & Humidity' },
    'pa_optional_temp_sensor_output': { key: 'optionalSensorOutput', title: 'Optional Temp Sensor & Output' },
    'pa_optional-temp-sensor-output': { key: 'optionalSensorOutput', title: 'Optional Temp Sensor & Output' },
    // Humidity filters
    'pa_humidity_application': { key: 'humidityApplication', title: 'Humidity Application' },
    'pa_humidity-application': { key: 'humidityApplication', title: 'Humidity Application' },
    'pa_humidity_room_enclosure': { key: 'humidityRoomEnclosure', title: 'Humidity Room Enclosure' },
    'pa_humidity-room-enclosure': { key: 'humidityRoomEnclosure', title: 'Humidity Room Enclosure' },
    'pa_humidity_sensor_output': { key: 'humiditySensorOutput', title: 'Humidity Sensor Output' },
    'pa_humidity-sensor-output': { key: 'humiditySensorOutput', title: 'Humidity Sensor Output' },
    // Pressure filters
    'pa_pressure_application': { key: 'pressureApplication', title: 'Pressure Application' },
    'pa_pressure-application': { key: 'pressureApplication', title: 'Pressure Application' },
    'pa_pressure_sensor_style': { key: 'pressureSensorStyle', title: 'Pressure Sensor Style' },
    'pa_pressure-sensor-style': { key: 'pressureSensorStyle', title: 'Pressure Sensor Style' },
    // Air Quality filters
    'pa_air_quality_application': { key: 'airQualityApplication', title: 'Air Quality Application' },
    'pa_air-quality-application': { key: 'airQualityApplication', title: 'Air Quality Application' },
    'pa_air_quality_sensor_type': { key: 'airQualitySensorType', title: 'Air Quality Sensor Type' },
    'pa_air-quality-sensor-type': { key: 'airQualitySensorType', title: 'Air Quality Sensor Type' },
    // Wireless filters
    'pa_wireless_application': { key: 'wirelessApplication', title: 'Wireless Application' },
    'pa_wireless-application': { key: 'wirelessApplication', title: 'Wireless Application' },
  };

  const filterMaps = new Map<string, Map<string, { name: string; count: number; title: string }>>();

  // Extract attributes from all products using the optimized attributes field
  products.forEach((product) => {
    const p = product as any;
    
    // Use the generic attributes field (works for both Simple and Variable products)
    const attributes = p.attributes?.nodes;
    if (attributes && Array.isArray(attributes)) {
      attributes.forEach((attr: any) => {
        if (!attr || !attr.name || !attr.options) return;
        
        const mapping = attributeMap[attr.name];
        if (!mapping) return;
        
        const { key, title } = mapping;
        if (!filterMaps.has(key)) {
          filterMaps.set(key, new Map());
        }
        
        const map = filterMaps.get(key)!;
        
        // Process each option value
        (attr.options as string[]).forEach((optionValue: string) => {
          if (!optionValue) return;
          
          // Create slug from option value (lowercase, replace spaces/special chars with hyphens)
          const slug = optionValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          const current = map.get(slug) || { name: optionValue, count: 0, title };
          map.set(slug, { ...current, count: current.count + 1 });
        });
      });
    }
  });

  // Convert maps to sorted arrays and build result object
  const result: Record<
    string,
    Array<{ slug: string; name: string; count: number; title: string }>
  > = {};

  filterMaps.forEach((map, key) => {
    if (map.size > 0) {
      result[key] = Array.from(map.entries())
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => b.count - a.count);
    }
  });

  return result;
}
