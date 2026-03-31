'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './emotionCache';

/**
 * MUI Theme Registry for Next.js App Router
 * 
 * Provides Emotion cache to MUI components for proper SSR hydration.
 * Must be a client component to use Emotion's CacheProvider.
 * 
 * Usage: Wrap app content in layout.tsx
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState(() => createEmotionCache());

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
