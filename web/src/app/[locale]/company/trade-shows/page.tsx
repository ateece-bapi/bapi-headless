/**
 * Trade Shows Page
 * @route /[locale]/company/trade-shows
 *
 * Displays BAPI's trade show calendar with filterable card grid.
 * Phase 1: Static data (TypeScript)
 * Phase 2: WordPress custom post type via GraphQL
 */

import { CalendarIcon } from '@/lib/icons';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TradeShowsClient } from './TradeShowsClient';
import { TRADE_SHOWS, getUpcomingShows, getPastShows } from '@/lib/data/tradeShows';

interface TradeShowsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generate static metadata for SEO
 */
export async function generateMetadata({
  params,
}: TradeShowsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tradeShowsPage.meta' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Trade Shows Page Component (Server Component)
 */
export default async function TradeShowsPage({ params }: TradeShowsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tradeShowsPage' });
  
  const upcomingShows = getUpcomingShows();
  const pastShows = getPastShows();
  const totalShows = TRADE_SHOWS.length;

  // Generate JSON-LD structured data for SEO
  // Only include upcoming events with confirmed dates (filter out TBD)
  const eventsJsonLd = {
    '@context': 'https://schema.org',
    '@graph': upcomingShows
      .filter((show) => show.startDate && show.endDate)
      .map((show) => ({
      '@type': 'Event',
      name: show.title,
      description: show.description,
      startDate: show.startDate ? `${show.startDate}T09:00:00` : undefined,
      endDate: show.endDate ? `${show.endDate}T17:00:00` : undefined,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: show.location.venue || `${show.location.city}, ${show.location.country}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: show.location.city,
          addressRegion: show.location.state,
          addressCountry: show.location.country,
        },
      },
      organizer: {
        '@type': 'Organization',
        name: 'Building Automation Products, Inc. (BAPI)',
        url: 'https://www.bapihvac.com',
      },
      ...(show.registrationUrl && {
        offers: {
          '@type': 'Offer',
          url: show.registrationUrl,
          availability: 'https://schema.org/InStock',
        },
      }),
    })),
  };

  // TODO: Pull labels from i18n in Step 7
  const labels = {
    heroTitle: t('heroTitle'),
    heroDescription: t('heroDescription'),
    heroBadge: t('heroBadge'),
    filters: {
      upcoming: t('filters.upcoming'),
      past: t('filters.past'),
      all: t('filters.all'),
    },
    emptyState: {
      upcoming: {
        title: t('emptyState.upcoming.title'),
        description: t('emptyState.upcoming.description'),
      },
      past: {
        title: t('emptyState.past.title'),
        description: t('emptyState.past.description'),
      },
      all: {
        title: t('emptyState.all.title'),
        description: t('emptyState.all.description'),
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventsJsonLd),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-600 to-primary-800">
        {/* Background Decorations */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 h-150 w-150 -translate-y-1/3 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <CalendarIcon className="size-4" aria-hidden="true" />
            <span>{labels.heroBadge}</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 max-w-4xl text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            {labels.heroTitle}
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-xl text-primary-50">{labels.heroDescription}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Client Component with Filters and Cards */}
        <TradeShowsClient
          upcomingShows={upcomingShows}
          pastShows={pastShows}
          allShows={TRADE_SHOWS}
          locale={locale}
          labels={labels}
          counts={{
            upcoming: upcomingShows.length,
            past: pastShows.length,
            total: totalShows,
          }}
        />
      </section>
    </div>
  );
}
