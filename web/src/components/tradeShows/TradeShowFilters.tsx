/**
 * TradeShowFilters Component
 * @module components/tradeShows/TradeShowFilters
 *
 * Filter tabs for trade show calendar: Upcoming, Past, All Events
 * Client component for interactive tab switching
 */

'use client';

import { CalendarIcon, ClockIcon, ListIcon } from '@/lib/icons';

export type FilterType = 'upcoming' | 'past' | 'all';

interface TradeShowFiltersProps {
  /** Currently active filter */
  activeFilter: FilterType;
  /** Callback when filter changes */
  onFilterChange: (filter: FilterType) => void;
  /** Number of upcoming events */
  upcomingCount: number;
  /** Number of past events */
  pastCount: number;
  /** Total number of events */
  totalCount: number;
  /** Translated labels for filters (i18n support) */
  labels?: {
    upcoming: string;
    past: string;
    all: string;
  };
}

export function TradeShowFilters({
  activeFilter,
  onFilterChange,
  upcomingCount,
  pastCount,
  totalCount,
  labels = {
    upcoming: 'Upcoming',
    past: 'Past',
    all: 'All Events',
  },
}: TradeShowFiltersProps) {
  const filters: Array<{
    id: FilterType;
    label: string;
    count: number;
    icon: typeof CalendarIcon;
  }> = [
    {
      id: 'upcoming',
      label: labels.upcoming,
      count: upcomingCount,
      icon: CalendarIcon,
    },
    {
      id: 'past',
      label: labels.past,
      count: pastCount,
      icon: ClockIcon,
    },
    {
      id: 'all',
      label: labels.all,
      count: totalCount,
      icon: ListIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Tabs */}
      <div
        className="inline-flex w-full gap-2 rounded-xl bg-neutral-100 p-1.5 sm:w-auto"
        role="tablist"
        aria-label="Trade show filters"
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              id={`${filter.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="trade-shows-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onFilterChange(filter.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:flex-initial ${
                isActive
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{filter.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
                aria-label={`${filter.count} events`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
