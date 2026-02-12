'use client';

import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { BAPI_LOCATIONS, FACILITY_TYPE_LABELS, FACILITY_TYPE_COLORS } from '@/lib/constants/locations';
import type { Location } from '@/lib/constants/locations';
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

interface GlobalPresenceProps {
  title?: string;
  subtitle?: string;
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
 * @returns {JSX.Element} Global presence section with map and location details
 */
export function GlobalPresence({ title, subtitle }: GlobalPresenceProps = {}) {
  const [tooltip, setTooltip] = useState<{ location: Location; visible: boolean } | null>(null);

  return (
    <section className="py-16 bg-linear-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            {title || 'Our Global Presence'}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {subtitle || 'From our headquarters in Wisconsin to facilities across three continents, BAPI serves customers worldwide with local expertise and global reach.'}
          </p>
        </div>

        {/* Interactive World Map */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 relative">
          <div className="relative" style={{ height: '500px' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: [15, 30]
              }}
              className="w-full h-full"
            >
              <ZoomableGroup center={[15, 30]} zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: GeoFeature[] }) =>
                    geographies.map((geo: GeoFeature) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E5E7EB"
                        stroke="#D1D5DB"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: '#D1D5DB' },
                          pressed: { outline: 'none' }
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
                        filter: location.type === 'headquarters' 
                          ? 'drop-shadow(0 4px 6px rgba(20, 121, 188, 0.4))' 
                          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
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

            {/* Tooltip */}
            {tooltip?.visible && (
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 border-2 border-primary-500 z-50 min-w-70"
                style={{ pointerEvents: 'none' }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: FACILITY_TYPE_COLORS[tooltip.location.type] }}
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 mb-1">
                      {tooltip.location.name}
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">
                      {tooltip.location.city}, {tooltip.location.region}
                      <br />
                      {tooltip.location.country}
                    </div>
                    <div className="text-xs font-medium text-primary-600">
                      {FACILITY_TYPE_LABELS[tooltip.location.type]}
                    </div>
                    {tooltip.location.status === 'opening-soon' && (
                      <div className="text-xs font-medium text-accent-600 mt-1">
                        Opening Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#1479BC]" />
                <span className="text-neutral-700">Headquarters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFC843]" />
                <span className="text-neutral-700">Distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                <span className="text-neutral-700">Production</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#10B981]" />
                <span className="text-neutral-700">Production & Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BAPI_LOCATIONS.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl border-2 border-neutral-200 p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: FACILITY_TYPE_COLORS[location.type] }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-1">
                    {location.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span>{location.city}, {location.country}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-neutral-600 mb-3">
                {location.description}
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 font-medium rounded">
                  {FACILITY_TYPE_LABELS[location.type]}
                </span>
                {location.status === 'opening-soon' && (
                  <span className="px-2 py-1 bg-accent-50 text-accent-700 font-medium rounded">
                    Opening Soon
                  </span>
                )}
                {location.established && (
                  <span className="text-neutral-500 ml-auto">
                    Est. {location.established}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 mb-4">
            Looking for local support or partnership opportunities?
          </p>
          <Link
            href="/company/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
