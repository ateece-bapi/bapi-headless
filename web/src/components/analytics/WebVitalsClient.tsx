'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side WebVitals wrapper
 * 
 * Dynamically imports WebVitals component to prevent blocking initial render.
 */

const WebVitalsComponent = dynamic(
  () => import('./WebVitals').then((mod) => mod.WebVitals),
  {
    ssr: false,
    loading: () => null,
  }
);

export function WebVitalsClient() {
  return <WebVitalsComponent />;
}
