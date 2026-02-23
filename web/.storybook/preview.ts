// Import Tailwind CSS with @theme definitions
import '../src/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from './mocks/handlers';

/**
 * Initialize MSW for Storybook
 * 
 * This enables mocking of GraphQL/REST API requests in stories.
 * Useful for testing components without a live backend.
 */
initialize({
  onUnhandledRequest: 'bypass', // Allow unhandled requests (Next.js internal, images, etc.)
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Next.js App Router support
    nextjs: {
      appDirectory: true,
      // Configure Next.js Image for Storybook
      images: {
        domains: ['bapiheadlessstaging.kinsta.cloud'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.kinsta.cloud',
          },
          {
            protocol: 'https',
            hostname: '**.wordpress.org',
          },
        ],
        // Disable image optimization in Storybook for better compatibility
        unoptimized: true,
        // Custom loader for Storybook static assets
        loader: 'custom',
        loaderFile: './image-loader.ts',
      },
    },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader], // Enable MSW for all stories
};

export default preview;