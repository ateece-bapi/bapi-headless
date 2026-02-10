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
  },
  
  // Redirects for legacy/misplaced URLs
  async redirects() {
    return [
      // Product navigation links that should redirect to proper sections
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/technical-documentation',
        destination: '/:locale/resources',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/tools-guides',
        destination: '/:locale/resources/selector',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/learning-center',
        destination: '/:locale/resources',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/get-help',
        destination: '/:locale/support',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/for-existing-customers',
        destination: '/:locale/support',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/about-bapi',
        destination: '/:locale/company',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/get-in-touch',
        destination: '/:locale/contact',
        permanent: true,
      },
      // Resources routes consolidation
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/resources/application-notes',
        destination: '/:locale/application-notes',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/en/quote',
        destination: '/:locale/request-quote',
        permanent: true,
      },
      // Locale routing - legacy URLs without locale prefix
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/products/categories',
        destination: '/:locale/products',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/support/contact',
        destination: '/:locale/contact',
        permanent: true,
      },
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/company/about',
        destination: '/:locale/company/why-bapi',
        permanent: true,
      },      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/contact-sales',
        destination: '/:locale/contact',
        permanent: true,
      },      // Company news article slugs - redirect to main news page until article pages implemented
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)?/company/news/:slug*',
        destination: '/:locale/company/news',
        permanent: false, // Temporary redirect until article detail pages are implemented
      },
    ];
  },
  
  // Cache headers for static pages + Security headers
  async headers() {
    return [
      {
        source: '/:locale(en|de|fr|es|ja|zh|vi|ar)/:path*',
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
