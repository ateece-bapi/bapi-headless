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
    qualities: [75, 85],
  },
  // Optimize preloading behavior
  experimental: {
    optimizePackageImports: ['@/components'],
  },
  // other Next options (keep whatever you already need here)...
  // Example: uncomment if you want a custom distDir explicitly inside the project:
  // distDir: path.join(path.resolve(__dirname), '.next'),
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
