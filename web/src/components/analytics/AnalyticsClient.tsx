'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side analytics components wrapper
 * 
 * Dynamically imports Vercel Analytics and Speed Insights to prevent
 * blocking initial page render. Only loads after client-side hydration.
 */

const AnalyticsComponent = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  {
    ssr: false,
    loading: () => null,
  }
);

const SpeedInsightsComponent = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  {
    ssr: false,
    loading: () => null,
  }
);

export function AnalyticsClient() {
  return <AnalyticsComponent />;
}

export function SpeedInsightsClient() {
  return <SpeedInsightsComponent />;
}
