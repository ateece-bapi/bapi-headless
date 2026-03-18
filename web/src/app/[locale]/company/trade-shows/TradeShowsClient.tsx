/**
 * TradeShowsClient Component
 * @module app/[locale]/company/trade-shows/TradeShowsClient
 *
 * Client component handling filter state and event card display.
 * Separated from page.tsx to maintain Server Component for SEO.
 */

'use client';

import { useState, useMemo } from 'react';
import { CalendarIcon, SearchIcon, XIcon } from '@/lib/icons';
import type { TradeShow } from '@/lib/data/tradeShows';
import { TradeShowCard } from '@/components/tradeShows/TradeShowCard';
import {
  TradeShowFilters,
  type FilterType,
} from '@/components/tradeShows/TradeShowFilters';

// Regional mapping for filter (moved outside component to avoid repeated allocations)
const REGION_MAP: Record<string, string> = {
  // Americas
  'USA': 'americas',
  'Canada': 'americas',
  'Puerto Rico': 'americas',
  // EMEA (Europe, Middle East, Africa)
  'United Kingdom': 'emea',
  'Germany': 'emea',
  'Italy': 'emea',
  'Poland': 'emea',
  'Sweden': 'emea',
  'Turkey': 'emea',
  'UAE': 'emea',
  // APAC (Asia-Pacific)
  'Japan': 'apac',
  'China': 'apac',
  'India': 'apac',
  'Vietnam': 'apac',
  'Australia': 'apac',
};

/**
 * Get region for a country
 * @param country - Country name
 * @returns Region code or 'other'
 */
function getRegion(country: string): string {
  return REGION_MAP[country] || 'other';
}

interface TradeShowsClientProps {
  upcomingShows: TradeShow[];
  pastShows: TradeShow[];
  allShows: TradeShow[];
  locale: string;
  labels: {
    filters: {
      upcoming: string;
      past: string;
      all: string;
    };
    emptyState: {
      upcoming: { title: string; description: string };
      past: { title: string; description: string };
      all: { title: string; description: string };
    };
  };
  counts: {
    upcoming: number;
    past: number;
    total: number;
  };
}

export function TradeShowsClient({
  upcomingShows,
  pastShows,
  allShows,
  locale,
  labels,
  counts,
}: TradeShowsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Apply search and regional filters (all logic inside useMemo for correct dependencies)
  const filteredShows = useMemo(() => {
    // Get base filtered shows by time (upcoming/past/all)
    let shows: TradeShow[];
    switch (activeFilter) {
      case 'upcoming':
        shows = upcomingShows;
        break;
      case 'past':
        shows = pastShows;
        break;
      case 'all':
        shows = allShows;
        break;
      default:
        shows = upcomingShows;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      shows = shows.filter((show) => 
        show.title.toLowerCase().includes(query) ||
        show.location.city.toLowerCase().includes(query) ||
        show.location.country.toLowerCase().includes(query) ||
        show.description.toLowerCase().includes(query) ||
        (show.location.venue?.toLowerCase() || '').includes(query)
      );
    }

    // Apply regional filter
    if (selectedRegion !== 'all') {
      shows = shows.filter((show) => getRegion(show.location.country) === selectedRegion);
    }

    return shows;
  }, [activeFilter, searchQuery, selectedRegion, upcomingShows, pastShows, allShows]);

  const emptyStateConfig = labels.emptyState[activeFilter];

  return (
    <div className="space-y-8">
      {/* Search and Regional Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon 
            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-400" 
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, cities, or venues..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-10 text-sm transition-all duration-200 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            aria-label="Search trade shows"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Regional Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'americas', label: 'Americas' },
            { id: 'emea', label: 'EMEA' },
            { id: 'apac', label: 'Asia-Pacific' },
          ].map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedRegion === region.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={selectedRegion === region.id}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filters (Upcoming/Past/All) */}
      <TradeShowFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        upcomingCount={counts.upcoming}
        pastCount={counts.past}
        totalCount={counts.total}
        labels={labels.filters}
      />

      {/* Event Cards Grid - Always render tabpanel for ARIA consistency */}
      <div
        role="tabpanel"
        id="trade-shows-panel"
        aria-labelledby={`${activeFilter}-tab`}
      >
        {/* Results Counter */}
        {(searchQuery || selectedRegion !== 'all') && (
          <div className="mb-4 text-sm text-neutral-600">
            Showing <span className="font-semibold text-neutral-900">{filteredShows.length}</span> {filteredShows.length === 1 ? 'event' : 'events'}
            {searchQuery && <> matching "<span className="font-medium">{searchQuery}</span>"</>}
            {selectedRegion !== 'all' && <> in <span className="font-medium">{
              selectedRegion === 'americas' ? 'Americas' :
              selectedRegion === 'emea' ? 'EMEA' :
              'Asia-Pacific'
            }</span></>}
          </div>
        )}

        {filteredShows.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredShows.map((show) => (
              <TradeShowCard key={show.id} show={show} locale={locale} />
            ))}
          </div>
        ) : (
          /* Empty State - Better messaging based on active filters */
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center">
            <CalendarIcon
              className="mb-4 size-16 text-neutral-400"
              aria-hidden="true"
            />
            {searchQuery || selectedRegion !== 'all' ? (
              <>
                <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                  No events found
                </h2>
                <p className="mb-4 text-neutral-600">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                  }}
                  className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                  {emptyStateConfig.title}
                </h2>
                <p className="text-neutral-600">{emptyStateConfig.description}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
