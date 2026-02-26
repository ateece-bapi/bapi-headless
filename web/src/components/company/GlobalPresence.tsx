'use client';

import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import {
  BAPI_LOCATIONS,
  FACILITY_TYPE_LABELS,
  FACILITY_TYPE_COLORS,
  getActiveFacilityTypes,
} from '@/lib/constants/locations';
import type { Location, FacilityType } from '@/lib/constants/locations';
import { Building2, MapPin } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Type definitions for map data
type GeoFeature = {
  rsmKey: string;
  type: string;
  geometry: unknown;
  properties: Record<string, unknown>;
};

interface LocationTranslations {
  mapLegend: {
    headquarters: string;
    manufacturing: string;
    sales: string;
    distributionPartner: string;
  };
  facilities: {
    [key: string]: {
      name: string;
      city: string;
      country: string;
      description: string;
      type: string;
      established?: string;
      status?: string;
    };
  };
  cta: {
    text: string;
    button: string;
  };
}

interface GlobalPresenceProps {
  title?: string;
  subtitle?: string;
  locationTranslations?: LocationTranslations;
}

/**
 * GlobalPresence component displays BAPI's worldwide facilities on an interactive map
 *
 * Features:
 * - Interactive SVG world map with location markers
 * - Hover tooltips showing facility details
 * - Color-coded markers by facility type
 * - Responsive layout with location cards
 * - Zero runtime cost (no API calls)
 *
 * Updated February 2026 per Mike Moss feedback:
 * - All manufacturing facilities (Poland, Vietnam) use same color/category
 * - UK changed from "Distribution Centre" to "Sales Office"
 * - Support for sales staff and distribution partner locations
 *
 * Performance:
 * - Static data from constants (no GraphQL queries)
 * - SVG map with minimal re-renders
 * - Tooltip state managed with useState (no global state)
 *
 * i18n:
 * - Accepts locationTranslations prop for all text
 * - Falls back to English defaults
 * - Location names, descriptions, and labels all translatable
 *
 * @param {string} [title] - Section heading
 * @param {string} [subtitle] - Section description
 * @param {LocationTranslations} [locationTranslations] - i18n translations
 * @returns {JSX.Element} Global presence section with map and location details
 */
export function GlobalPresence({
  title,
  subtitle,
  locationTranslations,
}: GlobalPresenceProps = {}) {
  const [tooltip, setTooltip] = useState<{ location: Location; visible: boolean } | null>(null);

  // Get active facility types for legend (only show types that exist in data)
  const activeFacilityTypes = getActiveFacilityTypes();

  return (
    <section className="bg-linear-to-b from-white to-neutral-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mb-4 text-4xl font-bold text-neutral-900">
            {title || 'Our Global Presence'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            {subtitle ||
              'From our headquarters in Wisconsin to facilities across three continents, BAPI serves customers worldwide with local expertise and global reach.'}
          </p>
        </div>

        {/* Interactive World Map */}
        <div className="relative mb-12 rounded-2xl bg-white p-6 shadow-lg">
          <div className="relative" style={{ height: '500px' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: [15, 30],
              }}
              className="h-full w-full"
            >
              <ZoomableGroup center={[15, 30]} zoom={1}>
                {/* World Geography Base Layer */}
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: GeoFeature[] }) =>
                    geographies.map((geo: GeoFeature) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E5E7EB" // neutral-200
                        stroke="#D1D5DB" // neutral-300
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: '#D1D5DB' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Location Markers */}
                {BAPI_LOCATIONS.map((location) => (
                  <Marker
                    key={location.id}
                    coordinates={location.coordinates}
                    onMouseEnter={() => setTooltip({ location, visible: true })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Marker Circle */}
                    <circle
                      r={location.type === 'headquarters' ? 8 : 6}
                      fill={FACILITY_TYPE_COLORS[location.type]}
                      stroke="white"
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-200 hover:scale-125"
                      style={{
                        filter:
                          location.type === 'headquarters'
                            ? 'drop-shadow(0 4px 6px rgba(20, 121, 188, 0.4))'
                            : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                      }}
                    />
                    {/* Pulse Animation for Headquarters */}
                    {location.type === 'headquarters' && (
                      <circle
                        r={8}
                        fill="none"
                        stroke={FACILITY_TYPE_COLORS[location.type]}
                        strokeWidth={2}
                        opacity={0.6}
                        className="animate-ping"
                      />
                    )}
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover Tooltip */}
            {tooltip?.visible &&
              (() => {
                const translation = locationTranslations?.facilities[tooltip.location.id];
                return (
                  <div
                    className="absolute left-1/2 top-4 z-50 min-w-[17.5rem] -translate-x-1/2 rounded-lg border-2 border-primary-500 bg-white p-4 shadow-xl"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: FACILITY_TYPE_COLORS[tooltip.location.type] }}
                      />
                      <div>
                        <div className="mb-1 font-semibold text-neutral-900">
                          {translation?.name || tooltip.location.name}
                        </div>
                        <div className="mb-2 text-sm text-neutral-600">
                          {translation?.city || tooltip.location.city}
                          <br />
                          {translation?.country || tooltip.location.country}
                        </div>
                        <div className="text-xs font-medium text-primary-600">
                          {translation?.type || FACILITY_TYPE_LABELS[tooltip.location.type]}
                        </div>
                        {tooltip.location.status === 'opening-soon' && (
                          <div className="mt-1 text-xs font-medium text-accent-600">
                            {translation?.status || 'Opening Soon'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Map Legend - Only show active facility types */}
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {activeFacilityTypes.map((type) => {
                // Type-safe mapping from facility types to translation keys
                const FACILITY_TYPE_TO_LEGEND_KEY: Record<
                  FacilityType,
                  keyof LocationTranslations['mapLegend']
                > = {
                  headquarters: 'headquarters',
                  manufacturing: 'manufacturing',
                  sales: 'sales',
                  'distribution-partner': 'distributionPartner',
                };

                const translationKey = FACILITY_TYPE_TO_LEGEND_KEY[type];

                return (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: FACILITY_TYPE_COLORS[type] }}
                    />
                    <span className="text-neutral-700">
                      {locationTranslations?.mapLegend[translationKey] ||
                        FACILITY_TYPE_LABELS[type]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BAPI_LOCATIONS.map((location) => {
            const translation = locationTranslations?.facilities[location.id];
            return (
              <div
                key={location.id}
                className="rounded-xl border-2 border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-primary-500 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: FACILITY_TYPE_COLORS[location.type] }}
                  />
                  <div className="flex-1">
                    <h3 className="mb-1 font-bold text-neutral-900">
                      {translation?.name || location.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-neutral-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {translation?.city || location.city},{' '}
                        {translation?.country || location.country}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-3 text-sm text-neutral-600">
                  {translation?.description || location.description}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-primary-50 px-2 py-1 font-medium text-primary-700">
                    {translation?.type || FACILITY_TYPE_LABELS[location.type]}
                  </span>
                  {location.status === 'opening-soon' && (
                    <span className="rounded bg-accent-50 px-2 py-1 font-medium text-accent-700">
                      {translation?.status || 'Opening Soon'}
                    </span>
                  )}
                  {location.established && (
                    <span className="ml-auto text-neutral-500">
                      {translation?.established || `Est. ${location.established}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-neutral-600">
            {locationTranslations?.cta.text ||
              'Looking for local support or partnership opportunities?'}
          </p>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
          >
            {locationTranslations?.cta.button || 'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}
