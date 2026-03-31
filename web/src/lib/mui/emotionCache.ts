import createCache from '@emotion/cache';

/**
 * Create Emotion cache for MUI components
 * 
 * This configures Emotion to work properly with Next.js App Router SSR.
 * The cache prepends styles to ensure MUI styles have lower specificity
 * than Tailwind utility classes.
 */
export default function createEmotionCache() {
  return createCache({
    key: 'mui',
    prepend: true,
  });
}
