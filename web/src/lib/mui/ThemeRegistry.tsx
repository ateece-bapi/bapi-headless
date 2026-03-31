'use client';

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import createEmotionCache from './emotionCache';

/**
 * MUI Theme Registry for Next.js App Router with SSR support
 * 
 * Provides Emotion cache to MUI components with proper server-side rendering.
 * Uses next/navigation's useServerInsertedHTML to flush styles into the HTML stream.
 * 
 * This prevents hydration mismatches and FOUC (Flash of Unstyled Content).
 * 
 * @see https://mui.com/material-ui/guides/next-js-app-router/
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState(() => {
    const emotionCache = createEmotionCache();
    emotionCache.compat = true; // Enable compat mode for legacy MUI versions
    return emotionCache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
