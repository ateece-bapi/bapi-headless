'use client';

import {
  ComposableMap,
  Geographies,
  Geography as _Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import React from 'react';
import {
  BAPI_LOCATIONS,
  FACILITY_TYPE_LABELS,
  FACILITY_TYPE_COLORS,
  getActiveFacilityTypes,
} from '@/lib/constants/locations';
import type { Location, FacilityType } from '@/lib/constants/locations';
import { getRegionForCountry } from '@/lib/constants/salesRegions';
import type { SalesRep, SalesRegion } from '@/lib/constants/salesRegions';
import { Building2Icon, MapPinIcon, UserIcon, MailIcon, PhoneIcon } from '@/lib/icons';
import { useState, useRef, useEffect } from 'react';
import { Link } from '@/lib/navigation';

// react-simple-maps Geography supports mouse events at runtime but its bundled
// type declarations omit them. Extend the component type so we can attach hover
// handlers without suppressing all type-checking on this element.
const Geography = _Geography as React.ComponentType<
  React.ComponentProps<typeof _Geography> & {
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void;
  }
>;

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

  // Two separate states for map vs. popup so they can update at different rates:
  // - activeRegionId  → immediate, drives map highlight color (feels responsive)
  // - popupRegionInfo → debounced, drives the popup card (stays stable so user can click it)
  const [activeRegionId, setActiveRegionId] = useState<number | null>(null);
  const [popupRegionInfo, setPopupRegionInfo] = useState<{
    region: SalesRegion;
    rep: SalesRep;
  } | null>(null);

  // Debounce timer — popup content only updates after the cursor has rested on a
  // country for ~220 ms, so moving quickly toward the popup doesn't change it.
  const popupDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending timer on unmount to prevent state updates on dead components.
  useEffect(() => {
    return () => {
      if (popupDebounceRef.current) clearTimeout(popupDebounceRef.current);
    };
  }, []);

  // Get active facility types for legend (only show types that exist in data)
  const activeFacilityTypes = getActiveFacilityTypes();

  function handleCountryEnter(countryName: string, isoId?: number) {
    const info = getRegionForCountry(countryName, isoId);

    // Map highlight: immediate
    setActiveRegionId(info?.region.id ?? null);

    // Popup: if the country has no region (ocean, unmapped territory) clear
    // immediately so the highlight and popup are never out of sync.
    // Otherwise debounce so the card stays stable while the user moves to click it.
    if (popupDebounceRef.current) clearTimeout(popupDebounceRef.current);
    if (!info) {
      setPopupRegionInfo(null);
      popupDebounceRef.current = null;
    } else {
      popupDebounceRef.current = setTimeout(() => {
        setPopupRegionInfo(info);
        popupDebounceRef.current = null;
      }, 220);
    }
  }

  function handleCountryLeave() {
    // Container-level leave — clear everything immediately
    if (popupDebounceRef.current) {
      clearTimeout(popupDebounceRef.current);
      popupDebounceRef.current = null;
    }
    setActiveRegionId(null);
    setPopupRegionInfo(null);
  }

  function handlePopupMouseEnter() {
    // Mouse is now on the popup card — cancel any pending debounced update so the
    // content doesn't change while the user is trying to read or click it.
    if (popupDebounceRef.current) {
      clearTimeout(popupDebounceRef.current);
      popupDebounceRef.current = null;
    }
  }

  function getGeographyFill(countryName: string, isoId?: number): string {
    if (activeRegionId === null) return '#E5E7EB'; // neutral-200 default
    const info = getRegionForCountry(countryName, isoId);
    if (info && info.region.id === activeRegionId) {
      return '#93C5FD'; // blue-300 – strong contrast highlight
    }
    return '#F3F4F6'; // neutral-100 – dimmed non-active countries
  }

  function getGeographyStroke(countryName: string, isoId?: number): string {
    if (activeRegionId === null) return '#D1D5DB';
    const info = getRegionForCountry(countryName, isoId);
    if (info && info.region.id === activeRegionId) {
      return '#1e6fb9'; // primary-600 – highlighted border
    }
    return '#E5E7EB';
  }

  return (
    <section className="bg-linear-to-b from-white to-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            <Building2Icon className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mb-4 text-4xl font-bold text-neutral-900">
            {title || 'Our Global Presence'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-700">
            {subtitle ||
              'From our headquarters in Wisconsin to facilities across three continents, BAPI serves customers worldwide with local expertise and global reach.'}
          </p>
        </div>

        {/* Interactive World Map */}
        {/* onMouseLeave on the card (not per-country) so the panel stays reachable */}
        <div className="relative mb-12 rounded-2xl bg-white p-6 shadow-lg" onMouseLeave={handleCountryLeave}>
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
                    geographies.map((geo: GeoFeature) => {
                      const countryName = geo.properties.name as string;
                      const isoId = geo.properties.id as number | undefined;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getGeographyFill(countryName, isoId)}
                          stroke={getGeographyStroke(countryName, isoId)}
                          onMouseEnter={() => handleCountryEnter(countryName, isoId)}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      );
                    })
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
                       
                        opacity={0.6}
                        className="animate-ping"
                      />
                    )}
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>

            {/* Facility marker tooltip — top-center, pointer-events: none */}
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
                        <div className="mb-2 text-sm text-neutral-700">
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

            {/* Regional sales contact popup — bottom-right corner, anchored */}
            {/* onMouseEnter cancels the debounce so content freezes the moment the */}
            {/* user's cursor arrives — they can always click what they originally saw. */}
            <div
              onMouseEnter={handlePopupMouseEnter}
              className={`absolute bottom-4 right-4 z-40 w-64 transition-all duration-200 ${
                popupRegionInfo
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-2 opacity-0'
              }`}
            >
              {popupRegionInfo && (
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white/95 shadow-xl backdrop-blur-sm">
                  {/* Colored top bar */}
                  <div className="h-1 w-full bg-primary-600" />
                  <div className="p-4">
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
                      {popupRegionInfo.region.name}
                    </p>
                    <p className="mb-3 text-xs text-neutral-500">
                      {popupRegionInfo.region.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <UserIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight text-neutral-900">
                          {popupRegionInfo.rep.name}
                        </p>
                        <p className="text-xs leading-tight text-neutral-500">
                          Regional Sales
                        </p>
                      </div>
                    </div>
                    {(popupRegionInfo.rep.email || popupRegionInfo.rep.phone) && (
                      <div className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3">
                        {popupRegionInfo.rep.email && (
                          <a
                            href={`mailto:${popupRegionInfo.rep.email}`}
                            className="flex items-center gap-2 text-xs text-neutral-600 hover:text-primary-600"
                          >
                            <MailIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{popupRegionInfo.rep.email}</span>
                          </a>
                        )}
                        {popupRegionInfo.rep.phone && (
                          <a
                            href={`tel:${popupRegionInfo.rep.phone}`}
                            className="flex items-center gap-2 text-xs text-neutral-600 hover:text-primary-600"
                          >
                            <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                            {popupRegionInfo.rep.phone}
                          </a>
                        )}
                      </div>
                    )}
                    <Link
                      href={`/contact/${popupRegionInfo.rep.id}`}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Contact {popupRegionInfo.rep.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Interaction hint — center-bottom, fades out when a region is active */}
            <div
              className={`pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-200 ${
                popupRegionInfo ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-neutral-400 shadow backdrop-blur-sm">
                Hover a country to find your regional contact
              </span>
            </div>
          </div>

          {/* Map Legend */}
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

          {/* Mobile fallback — touch devices can't hover */}
          <p className="mt-4 text-center text-xs text-neutral-400 md:hidden">
            Visit our{' '}
            <Link href="/contact" className="text-primary-600 underline">
              contact page
            </Link>{' '}
            to reach your regional sales rep.
          </p>
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
                    <div className="flex items-center gap-1 text-sm text-neutral-700">
                      <MapPinIcon className="h-4 w-4" />
                      <span>
                        {translation?.city || location.city},{' '}
                        {translation?.country || location.country}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mb-3 text-sm text-neutral-700">
                  {translation?.description || location.description}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-primary-50 px-2 py-1 font-medium text-primary-700">
                    {translation?.type || FACILITY_TYPE_LABELS[location.type]}
                  </span>
                  {location.status === 'opening-soon' && (
                    <span className="rounded bg-accent-50 px-2 py-1 font-medium text-neutral-900">
                      {translation?.status || 'Opening Soon'}
                    </span>
                  )}
                  {location.established && (
                    <span className="ml-auto text-neutral-700">
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
          <p className="mb-4 text-neutral-700">
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
