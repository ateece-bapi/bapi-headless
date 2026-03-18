/**
 * CalendarDownloadButton Component
 * @module components/tradeShows/CalendarDownloadButton
 *
 * Client component for downloading trade show events as .ics calendar files.
 * Separated from TradeShowCard to keep the card as a server component.
 */

'use client';

import { CalendarPlusIcon } from '@/lib/icons';
import type { TradeShow } from '@/lib/data/tradeShows';
import { downloadICS } from '@/lib/utils/icsGenerator';

interface CalendarDownloadButtonProps {
  show: TradeShow;
  variant?: 'default' | 'compact';
}

/**
 * Calendar download button component
 * Generates and downloads .ics file for a trade show event
 * @param props - Component props
 * @param props.show - Trade show object
 * @param props.variant - Button style variant (default or compact)
 */
export function CalendarDownloadButton({
  show,
  variant = 'default',
}: CalendarDownloadButtonProps) {
  const handleDownload = () => {
    downloadICS(show);
  };

  if (variant === 'compact') {
    // Compact icon-only button for secondary action area
    return (
      <button
        onClick={handleDownload}
        className="inline-flex items-center justify-center gap-2 p-4 text-lg font-bold rounded-xl border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary-600/50 active:scale-95"
        aria-label={`Add ${show.title} to calendar`}
        title="Add to Calendar"
      >
        <CalendarPlusIcon className="size-5" aria-hidden="true" />
      </button>
    );
  }

  // Default full-width button
  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary-600/50 active:scale-95 antialiased"
      aria-label={`Add ${show.title} to calendar`}
    >
      <CalendarPlusIcon className="size-4" aria-hidden="true" />
      <span>Add to Calendar</span>
    </button>
  );
}
