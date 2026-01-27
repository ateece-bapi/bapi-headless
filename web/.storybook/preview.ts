// Import Tailwind CSS with @theme definitions
import '../src/app/globals.css';

import type { Preview } from '@storybook/nextjs-vite';

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
    },
  },
};

export default preview;