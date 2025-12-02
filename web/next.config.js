/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // WordPress upload domains and common CDNs used for hosted WP instances
      { protocol: 'https', hostname: '**.wordpress.org' },
      { protocol: 'https', hostname: '**.kinsta.cloud' },
      { protocol: 'https', hostname: '**.wp.com' },
      // Add your CDN hostname(s) here if needed
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
};

module.exports = nextConfig;
