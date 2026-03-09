/**
 * TradeShowCard Component
 * @module components/tradeShows/TradeShowCard
 *
 * Displays a single trade show event in card format.
 * Reuses ProductCard hover effects and BapiButton styling for brand consistency.
 */

import { Calendar, MapPin, Building, User, FileDown, ExternalLink } from 'lucide-react';
import type { TradeShow } from '@/lib/data/tradeShows';
import { formatDateRange, getEventStatus, getDaysUntilEvent } from '@/lib/data/tradeShows';
import { CalendarDownloadButton } from './CalendarDownloadButton';

interface TradeShowCardProps {
  show: TradeShow;
  locale?: string;
}

export function TradeShowCard({ show, locale = 'en' }: TradeShowCardProps) {
  const dateRange = formatDateRange(show.startDate, show.endDate, locale);
  const status = getEventStatus(show.startDate, show.endDate);
  const daysUntil = getDaysUntilEvent(show.startDate);
  const isPastEvent = status === 'past';

  // Format relative time for upcoming events
  const getRelativeTime = () => {
    if (status === 'tbd' || !show.startDate) return null;
    if (status === 'happening-now') return 'Happening Now';
    if (status === 'past') return null;
    
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil > 1 && daysUntil < 7) return `In ${daysUntil} days`;
    return null;
  };

  const relativeTime = getRelativeTime();

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-500 hover:shadow-2xl ${
        isPastEvent
          ? 'border-neutral-200 opacity-75'
          : 'border-neutral-100 hover:border-transparent'
      }`}
    >
      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Status Badges */}
        {status === 'happening-now' && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 animate-pulse">
            <span className="size-2 rounded-full bg-green-500" aria-hidden="true"></span>
            Live Now
          </div>
        )}
        {status === 'starting-soon' && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
            <span className="size-2 rounded-full bg-yellow-500" aria-hidden="true"></span>
            Starting Soon - {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
          </div>
        )}
        {status === 'past' && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            Past Event
          </div>
        )}
        {status === 'tbd' && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Date TBD
          </div>
        )}

        {/* Date - Enhanced Prominence */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
            <Calendar className="size-5 text-primary-500" aria-hidden="true" />
            <span>{dateRange}</span>
          </div>
          {relativeTime && (
            <span className="ml-7 text-sm font-medium text-primary-600">
              {relativeTime}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="size-4 text-primary-500" aria-hidden="true" />
          <span>
            {show.location.city}
            {show.location.state && `, ${show.location.state}`}, {show.location.country}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`line-clamp-2 text-xl font-bold transition-colors ${
            isPastEvent
              ? 'text-neutral-700'
              : 'text-neutral-900 group-hover:text-primary-600'
          }`}
        >
          {show.title}
        </h2>

        {/* Venue (if available) */}
        {show.location.venue && (
          <p className="text-sm italic text-neutral-500">{show.location.venue}</p>
        )}

        {/* Booth Number */}
        {show.booth && (
          <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">
            <Building className="size-4" aria-hidden="true" />
            <span>{show.booth}</span>
          </div>
        )}

        {/* Description */}
        <p className="line-clamp-3 flex-1 text-neutral-600 leading-relaxed">
          {show.description}
        </p>

        {/* Contact Person */}
        {show.contact && (
          <div className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <User className="size-4 text-neutral-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-neutral-900">{show.contact.name}</span>
              <a
                href={`mailto:${show.contact.email}`}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                {show.contact.email}
              </a>
              {show.contact.phone && (
                <a
                  href={`tel:${show.contact.phone}`}
                  className="text-neutral-600 hover:text-neutral-700 hover:underline"
                >
                  {show.contact.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-neutral-100 bg-neutral-50 p-4">
        {/* Register Button - Primary Action */}
        {show.registrationUrl && !isPastEvent && (
          <a
            href={show.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl btn-bapi-primary transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-primary-600/50 active:scale-95 antialiased"
            aria-label={`Register for ${show.title} (opens in new tab)`}
          >
            <span>Register</span>
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}

        {/* Past Event - Disabled Button */}
        {show.registrationUrl && isPastEvent && (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl bg-neutral-200 text-neutral-500 cursor-not-allowed"
            aria-label={`${show.title} has ended`}
          >
            Event Ended
          </button>
        )}

        {/* Download Flyer - Secondary Action */}
        {show.flyerUrl && (
          <a
            href={show.flyerUrl}
            download
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl btn-bapi-accent transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-accent-500/50 active:scale-95 antialiased ${
              show.registrationUrl ? 'w-auto' : 'flex-1'
            }`}
            aria-label={`Download flyer for ${show.title}`}
          >
            <FileDown className="size-4" aria-hidden="true" />
            <span className={show.registrationUrl ? 'hidden sm:inline' : ''}>Flyer</span>
          </a>
        )}

        {/* Add to Calendar - Available for all events with valid dates */}
        {show.startDate && (
          <CalendarDownloadButton show={show} variant="compact" />
        )}
      </div>
    </article>
  );
}
