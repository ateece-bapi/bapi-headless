'use client';

import { useState } from 'react';
import { XIcon, SlidersHorizontalIcon } from '@/lib/icons';
import type { GetProductAttributesQuery } from '@/lib/graphql/generated';
import FilterGroup from './FilterGroup';
import FilterCheckbox from './FilterCheckbox';

interface Subcategory {
  id: string;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
}

interface ActiveFilters {
  subcategory: string[];
  application: string[];
  enclosure: string[];
  output: string[];
  display: string[];
  tempSetpoint: string[];
  optionalTempOutput: string[];
}

interface FilterSidebarProps {
  subcategories: Subcategory[];
  filters: GetProductAttributesQuery;
  activeFilters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

/**
 * FilterSidebar provides filtering controls for product categories and attributes.
 * Includes subcategory, application, enclosure, output, and display filters.
 */
export default function FilterSidebar({
  subcategories,
  filters,
  activeFilters,
  onChange,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some((arr) => arr.length > 0);

  const clearAllFilters = () => {
    onChange({
      subcategory: [],
      application: [],
      enclosure: [],
      output: [],
      display: [],
      tempSetpoint: [],
      optionalTempOutput: [],
    });
  };

  const updateFilter = (key: keyof ActiveFilters, value: string, checked: boolean) => {
    const currentValues = activeFilters[key];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onChange({
      ...activeFilters,
      [key]: newValues,
    });
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Subcategories */}
      {subcategories.length > 0 && (
        <FilterGroup title="Category">
          {subcategories
            .filter((sub) => sub.name && sub.slug)
            .map((sub) => (
              <FilterCheckbox
                key={sub.id}
                label={sub.name!}
                count={sub.count}
                checked={activeFilters.subcategory.includes(sub.slug!)}
                onChange={(checked) => updateFilter('subcategory', sub.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Application Filter */}
      {(filters.paApplications?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Application">
          {filters.paApplications!.nodes
            .filter((app) => app.name && app.slug)
            .map((app) => (
              <FilterCheckbox
                key={app.id}
                label={app.name!}
                count={app.count}
                checked={activeFilters.application.includes(app.slug!)}
                onChange={(checked) => updateFilter('application', app.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Room Enclosure Style */}
      {(filters.paRoomEnclosureStyles?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Enclosure Style">
          {filters.paRoomEnclosureStyles!.nodes
            .filter((style) => style.name && style.slug)
            .map((style) => (
              <FilterCheckbox
                key={style.id}
                label={style.name!}
                count={style.count}
                checked={activeFilters.enclosure.includes(style.slug!)}
                onChange={(checked) => updateFilter('enclosure', style.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Sensor Output */}
      {(filters.paTemperatureSensorOutputs?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Sensor Output">
          {filters.paTemperatureSensorOutputs!.nodes
            .filter((output) => output.name && output.slug)
            .map((output) => (
              <FilterCheckbox
                key={output.id}
                label={output.name!}
                count={output.count}
                checked={activeFilters.output.includes(output.slug!)}
                onChange={(checked) => updateFilter('output', output.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Humidity Sensor Output */}
      {(filters.paHumiditySensorOutputs?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Humidity Output">
          {filters.paHumiditySensorOutputs!.nodes
            .filter((output) => output.name && output.slug)
            .map((output) => (
              <FilterCheckbox
                key={output.id}
                label={output.name!}
                count={output.count}
                checked={activeFilters.output.includes(output.slug!)}
                onChange={(checked) => updateFilter('output', output.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Display Options */}
      {(filters.paDisplays?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Display">
          {filters.paDisplays!.nodes
            .filter((display) => display.name && display.slug)
            .map((display) => (
              <FilterCheckbox
                key={display.id}
                label={display.name!}
                count={display.count}
                checked={activeFilters.display.includes(display.slug!)}
                onChange={(checked) => updateFilter('display', display.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Temperature Setpoint & Override */}
      {(filters.paTempSetpointAndOverride?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Temp Setpoint & Override">
          {filters.paTempSetpointAndOverride!.nodes
            .filter((temp) => temp.name && temp.slug)
            .map((temp) => (
              <FilterCheckbox
                key={temp.id}
                label={temp.name!}
                count={temp.count}
                checked={activeFilters.tempSetpoint.includes(temp.slug!)}
                onChange={(checked) => updateFilter('tempSetpoint', temp.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Optional Temperature Sensor Output */}
      {(filters.paOptionalTempSensorOutputs?.nodes.length ?? 0) > 0 && (
        <FilterGroup title="Optional Temp Sensor Output">
          {filters.paOptionalTempSensorOutputs!.nodes
            .filter((output) => output.name && output.slug)
            .map((output) => (
              <FilterCheckbox
                key={output.id}
                label={output.name!}
                count={output.count}
                checked={activeFilters.optionalTempOutput.includes(output.slug!)}
                onChange={(checked) => updateFilter('optionalTempOutput', output.slug!, checked)}
              />
            ))}
        </FilterGroup>
      )}

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full rounded-lg border-2 border-primary-400 bg-white px-4 py-3 text-sm font-semibold text-primary-600 transition-all hover:bg-primary-50 hover:border-primary-500 hover:text-primary-700"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 lg:hidden"
      >
        <span className="flex items-center gap-2 font-medium text-neutral-900">
          <SlidersHorizontalIcon className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="rounded-full bg-primary-500 px-2 py-0.5 text-xs text-white">
              {Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0)}
            </span>
          )}
        </span>
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">Filters</h2>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl lg:hidden">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 hover:bg-neutral-100"
                  aria-label="Close filters"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">{sidebarContent}</div>

              {/* Footer */}
              <div className="border-t border-neutral-200 px-6 py-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-lg bg-primary-500 px-4 py-3 font-semibold text-white hover:bg-primary-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
