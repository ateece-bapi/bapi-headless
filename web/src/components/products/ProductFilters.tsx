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
  const activeFilters: Record<string, string[]> = {};
  Object.keys(filterOptions).forEach(key => {
    activeFilters[key] = currentFilters[key as keyof typeof currentFilters]?.split(',') || [];
  });

  const hasActiveFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

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

      // Update URL without scroll
      router.push(`${pathname || ''}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname || '/', { scroll: false });
  }, [pathname, router]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200 hover:underline"
          >
            Clear All
          </button>
        )}
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
        className="flex items-center justify-between w-full text-left mb-4 group"
      >
        <h3 className="font-semibold text-neutral-900 text-sm uppercase tracking-wider group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>
        <svg
          className={`w-5 h-5 text-neutral-500 transition-all duration-300 ease-out group-hover:text-primary-600 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
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
        <div className="space-y-3 animate-[fade-in_200ms_ease-out]">
          {options.map((option) => {
            const isActive = activeValues.includes(option.slug);
            return (
              <label
                key={option.slug}
                className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => onChange(filterType, option.slug, e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-colors duration-150"
                />
                <span className={`flex-1 text-sm transition-colors duration-200 ${isActive ? 'text-neutral-900 font-medium' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                  {option.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'}`}>
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
  // Define all available filters with their GraphQL field names and display names
  const filterDefinitions = [
    { key: 'application', field: 'allPaApplication', title: 'Application' },
    { key: 'roomEnclosure', field: 'allPaRoomEnclosureStyle', title: 'Temperature Room Enclosure Style' },
    { key: 'sensorOutput', field: 'allPaTemperatureSensorOutput', title: 'Sensor Output' },
    { key: 'display', field: 'allPaDisplay', title: 'Display' },
    { key: 'setpointOverride', field: 'allPaTempSetpointAndOverride', title: 'Temp Setpoint and Override' },
    { key: 'optionalTempHumidity', field: 'allPaOptionalTempHumidity', title: 'Optional Temp & Humidity' },
    { key: 'optionalSensorOutput', field: 'allPaOptionalTempSensorOutput', title: 'Optional Input Sensor & Output' },
    { key: 'humidityApplication', field: 'allPaHumidityApplication', title: 'Humidity Application' },
    { key: 'humidityRoomEnclosure', field: 'allPaHumidityRoomEnclosure', title: 'Humidity Room Enclosure' },
    { key: 'humiditySensorOutput', field: 'allPaHumiditySensorOutput', title: 'Humidity Sensor Output' },
    { key: 'pressureApplication', field: 'allPaPressureApplication', title: 'Pressure Application' },
    { key: 'pressureSensorStyle', field: 'allPaPressureSensorStyle', title: 'Pressure Sensor Style' },
    { key: 'airQualityApplication', field: 'allPaAirQualityApplication', title: 'Air Quality Application' },
    { key: 'airQualitySensorType', field: 'allPaAirQualitySensorType', title: 'Air Quality Sensor Type' },
    { key: 'wirelessApplication', field: 'allPaWirelessApplication', title: 'Wireless Application' },
  ];

  const filterMaps = new Map<string, Map<string, { name: string; count: number }>>();
  
  // Initialize maps for each filter
  filterDefinitions.forEach(def => {
    filterMaps.set(def.key, new Map());
  });

  // Extract attributes from all products
  products.forEach((product) => {
    const p = product as any;

    filterDefinitions.forEach(({ key, field }) => {
      const nodes = p[field]?.nodes;
      if (nodes && Array.isArray(nodes)) {
        nodes.forEach((attr: any) => {
          if (attr && attr.slug && attr.name) {
            const map = filterMaps.get(key)!;
            const current = map.get(attr.slug) || { name: attr.name, count: 0 };
            map.set(attr.slug, { name: attr.name, count: current.count + 1 });
          }
        });
      }
    });
  });

  // Convert maps to sorted arrays and build result object
  const result: Record<string, Array<{ slug: string; name: string; count: number; title: string }>> = {};
  
  filterDefinitions.forEach(({ key, title }) => {
    const map = filterMaps.get(key)!;
    if (map.size > 0) {
      result[key] = Array.from(map.entries())
        .map(([slug, data]) => ({ slug, ...data, title }))
        .sort((a, b) => b.count - a.count);
    }
  });

  return result;
}
