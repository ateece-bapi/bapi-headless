import { withSentryConfig } from '@sentry/nextjs';
/** web/next.config.ts */
import path from 'path';
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  // Re-enabled React Strict Mode now that auth is stable
  reactStrictMode: true,
  // Use an absolute path for turbopack.root (resolve from this file's directory)
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      // WordPress upload domains and common CDNs used for hosted WP instances
      { protocol: 'https', hostname: '**.wordpress.org' },
      { protocol: 'https', hostname: '**.kinsta.cloud' },
      { protocol: 'https', hostname: '**.wp.com' },
      // Test/placeholder image services (development/testing only)
      { protocol: 'https', hostname: 'placehold.co' },
      // Add your CDN hostname(s) here if needed
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
    // Image optimization configuration
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Quality settings for different sizes
    // Next.js will use 75 by default, we set explicit qualities in components
    qualities: [75, 85], // Support both default (75) and high quality (85)
    // Keep Next.js image optimization enabled; remote image hosts are controlled via remotePatterns above.
  },
  
  // Redirects for legacy/misplaced URLs
  //
  // ────────────────────────────────────────────────────────────────────────────
  // CONVENTIONS
  //   • Bare-source rule  (no locale prefix)  → always redirects to /en/…
  //   • Locale-source rule (/:locale/…)       → preserves the user's locale
  //   • Every rule pair uses the same locale regex:
  //       /:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)
  //   • permanent: true  = HTTP 308 (asset/SEO URLs that will never change)
  //   • permanent: false = HTTP 307 (functional redirects that may change)
  //
  // When adding a new redirect:
  //   1. Add a section comment with the purpose and date added (YYYY-MM-DD).
  //   2. Add both the bare and locale-prefixed pair.
  //   3. Add a test case in web/tests/e2e/redirects.spec.ts.
  // ────────────────────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // ── /company/contact* → /contact ────────────────────────────────────────
      // Added: 2025-09-10
      // Reason: Contact page moved out of /company/ during nav restructure;
      //         both /contact and /contact-us variants existed historically.
      {
        source: '/company/:slug(contact|contact-us)',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/company/:slug(contact|contact-us)',
        destination: '/:locale/contact',
        permanent: true,
      },

      // ── /sign-up → /sign-in ─────────────────────────────────────────────────
      // Added: 2025-10-01
      // Reason: Self-registration is not supported; /sign-up was linked in some
      //         older email campaigns. 307 (not permanent) in case sign-up is
      //         re-introduced later.
      {
        source: '/sign-up',
        destination: '/en/sign-in',
        permanent: false,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/sign-up',
        destination: '/:locale/sign-in',
        permanent: false,
      },

      // ── /products/* stubs → canonical sections ──────────────────────────────
      // Added: 2025-11-15
      // Reason: Legacy mega-menu links inside /products/ that pointed at
      //         sub-sections since moved to top-level routes.

      // technical-documentation + learning-center both map to /resources
      {
        source: '/products/:stub(technical-documentation|learning-center)',
        destination: '/en/resources',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/:stub(technical-documentation|learning-center)',
        destination: '/:locale/resources',
        permanent: true,
      },

      // tools-guides → /resources/selector (product selection tool)
      {
        source: '/products/tools-guides',
        destination: '/en/resources/selector',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/tools-guides',
        destination: '/:locale/resources/selector',
        permanent: true,
      },

      // get-help + for-existing-customers both map to /support
      {
        source: '/products/:stub(get-help|for-existing-customers)',
        destination: '/en/support',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/:stub(get-help|for-existing-customers)',
        destination: '/:locale/support',
        permanent: true,
      },

      // about-bapi → /company
      {
        source: '/products/about-bapi',
        destination: '/en/company',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/about-bapi',
        destination: '/:locale/company',
        permanent: true,
      },

      // get-in-touch → /contact
      {
        source: '/products/get-in-touch',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/get-in-touch',
        destination: '/:locale/contact',
        permanent: true,
      },

      // ── /resources/application-notes → /application-notes ──────────────────
      // Added: 2026-01-20
      // Reason: Application notes promoted to a top-level route; old nested URL
      //         persisted in some bookmarks and external links.
      {
        source: '/resources/application-notes',
        destination: '/en/application-notes',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/resources/application-notes',
        destination: '/:locale/application-notes',
        permanent: true,
      },

      // ── /quote → /request-quote ─────────────────────────────────────────────
      // Added: 2026-01-20
      // Reason: Quote page renamed for clarity; short /quote URL was in printed
      //         materials and email signatures.
      {
        source: '/quote',
        destination: '/en/request-quote',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/quote',
        destination: '/:locale/request-quote',
        permanent: true,
      },

      // ── /products/categories → /products ────────────────────────────────────
      // Added: 2025-12-01
      // Reason: Removed /categories sub-route; product listing is now at root
      //         /products route.
      {
        source: '/products/categories',
        destination: '/en/products',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/products/categories',
        destination: '/:locale/products',
        permanent: true,
      },

      // ── /support/contact → /contact ─────────────────────────────────────────
      // Added: 2025-12-01
      // Reason: Contact moved out of /support/ nesting; some older help pages
      //         still linked to /support/contact.
      {
        source: '/support/contact',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/support/contact',
        destination: '/:locale/contact',
        permanent: true,
      },

      // ── /company/about → /company/why-bapi ──────────────────────────────────
      // Added: 2025-12-01
      // Reason: "About" page renamed to "Why BAPI" during brand refresh; old
      //         URL in external links and press coverage.
      {
        source: '/company/about',
        destination: '/en/company/why-bapi',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/company/about',
        destination: '/:locale/company/why-bapi',
        permanent: true,
      },

      // ── /contact-sales → /contact ────────────────────────────────────────────
      // Added: 2025-12-15
      // Reason: Sales contact funnel simplified; /contact-sales was used in old
      //         partner and distributor email campaigns.
      {
        source: '/contact-sales',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/contact-sales',
        destination: '/:locale/contact',
        permanent: true,
      },

      // ── /company/news[/:slug] → /en/company/news[/:slug] ────────────────────
      // Added: 2026-01-05
      // Reason: Locale prefix required for i18n routing; bare /company/news URLs
      //         existed before locale prefix was introduced.
      //         Slug is preserved so all individual article permalinks stay valid.
      {
        source: '/company/news',
        destination: '/en/company/news',
        permanent: true,
      },
      {
        source: '/company/news/:slug+',
        destination: '/en/company/news/:slug+',
        permanent: true,
      },

      // ── /product/:slug → /en/product/:slug ──────────────────────────────────
      // Added: 2026-01-10
      // Reason: QR code compatibility — printed QR codes on physical products
      //         (e.g., Current Switch model cards) link to /product/:slug without
      //         a locale prefix. These are permanent fixtures that cannot be
      //         reprinted; this redirect MUST remain indefinitely.
      {
        source: '/product/:slug',
        destination: '/en/product/:slug',
        permanent: true,
      },
    ];
  },
  
  // Cache headers for static pages + Security headers
  async headers() {
    return [
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar|th|pl|hi)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  
  // Optimize preloading behavior
  experimental: {
    optimizePackageImports: ['@/components'],
    
    // Enable webpack build worker for better performance
    webpackBuildWorker: true,
  },
  
  // Phase 2: Compiler optimizations for production
  compiler: {
    // Remove console.log in production (except errors) - reduces bundle size
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Phase 2: Production performance optimizations
  compress: true, // Enable gzip compression (reduces transfer size ~70%)
  poweredByHeader: false, // Remove X-Powered-By header (security + performance)
  generateEtags: true, // Enable ETags for cache validation
  
  // other Next options (keep whatever you already need here)...
  // Example: uncomment if you want a custom distDir explicitly inside the project:
  // distDir: path.join(path.resolve(__dirname), '.next'),
};

export default withSentryConfig(withNextIntl(withBundleAnalyzer(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "bapi-gv",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
