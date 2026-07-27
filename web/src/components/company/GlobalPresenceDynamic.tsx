'use client';

/**
 * Client-side-only wrapper for GlobalPresence.
 *
 * `ssr: false` must live inside a Client Component — it cannot be used in a
 * Server Component (page.tsx). GlobalPresence uses react-simple-maps which
 * computes SVG projection transforms in floating-point; Node.js and V8 produce
 * slightly different results, causing React hydration errors. Skipping SSR
 * entirely avoids the mismatch.
 */
import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { GlobalPresence as GlobalPresenceType } from './GlobalPresence';

const GlobalPresenceLazy = dynamic(
  () => import('./GlobalPresence').then((mod) => ({ default: mod.GlobalPresence })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-neutral-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="mx-auto h-8 w-64 rounded bg-neutral-200"></div>
            <div className="mx-auto h-96 rounded-2xl bg-neutral-200"></div>
          </div>
        </div>
      </div>
    ),
  },
);

export function GlobalPresenceDynamic(
  props: ComponentProps<typeof GlobalPresenceType>,
) {
  return <GlobalPresenceLazy {...props} />;
}
