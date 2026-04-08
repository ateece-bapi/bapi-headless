// This file configures the initialization of Sentry on the client (browser).
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// PERFORMANCE FIX: Defer Sentry initialization to avoid blocking initial page load
// This improves Speed Index and TBT (Total Blocking Time) metrics
// Sentry will initialize after page becomes interactive (~2s delay)

// Export empty object to make this a valid module (required by Next.js instrumentation)
export {};

if (typeof window !== 'undefined') {
  // Check if page is already interactive, otherwise wait for it
  const initSentry = async () => {
    const Sentry = await import('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Environment
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',

      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Track navigation propagation
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/.*\.vercel\.app/,
        /^https:\/\/.*\.kinsta\.cloud/,
      ],

      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Integrations
      integrations: [
        // Browser performance monitoring
        Sentry.browserTracingIntegration(),

        // Session Replay for debugging
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
          // Capture console logs for context
          networkDetailAllowUrls: [/^https:\/\/.*\.kinsta\.cloud/],
        }),

        // Breadcrumbs for user actions
        Sentry.breadcrumbsIntegration({
          console: true,
          dom: true,
          fetch: true,
          history: true,
          xhr: true,
        }),
      ],

      // Error filtering
      beforeSend(event, hint) {
        // Filter out common browser extension errors
        if (event.exception?.values?.some((e) => e.value?.includes('extension://'))) {
          return null;
        }

        // Filter out network errors from ad blockers
        if (hint.originalException instanceof Error) {
          if (hint.originalException.message.includes('blocked:')) {
            return null;
          }
        }

        return event;
      },

      // Ignore specific errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        // Third-party scripts
        'fb_xd_fragment',
        'bmi_SafeAddOnload',
        // Network issues
        'Network request failed',
        'NetworkError',
        'Failed to fetch',
      ],

      // User context (do not send PII by default)
      sendDefaultPii: false,
    });
  };

  // Defer Sentry initialization until page is interactive
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Page already interactive, init after a short delay
    setTimeout(initSentry, 1500);
  } else {
    // Wait for page to become interactive
    window.addEventListener('load', () => {
      setTimeout(initSentry, 1500);
    });
  }
}
