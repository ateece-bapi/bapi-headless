/**
 * TradeShowsClient Component
 * @module app/[locale]/company/trade-shows/TradeShowsClient
 *
 * Client component handling filter state and event card display.
 * Separated from page.tsx to maintain Server Component for SEO.
 */

'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { TradeShow } from '@/lib/data/tradeShows';
import { TradeShowCard } from '@/components/tradeShows/TradeShowCard';
import {
  TradeShowFilters,
  type FilterType,
} from '@/components/tradeShows/TradeShowFilters';

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

  // Get filtered shows based on active filter
  const getFilteredShows = (): TradeShow[] => {
    switch (activeFilter) {
      case 'upcoming':
        return upcomingShows;
      case 'past':
        return pastShows;
      case 'all':
        return allShows;
      default:
        return upcomingShows;
    }
  };

  const filteredShows = getFilteredShows();
  const emptyStateConfig = labels.emptyState[activeFilter];

  return (
    <div className="space-y-8">
      {/* Filters */}
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
        {filteredShows.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredShows.map((show) => (
              <TradeShowCard key={show.id} show={show} locale={locale} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center">
            <CalendarIcon
              className="mb-4 size-16 text-neutral-400"
              aria-hidden="true"
            />
            <h2 className="mb-2 text-2xl font-bold text-neutral-900">
              {emptyStateConfig.title}
            </h2>
            <p className="text-neutral-600">{emptyStateConfig.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
