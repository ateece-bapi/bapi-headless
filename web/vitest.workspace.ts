import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineWorkspace } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest Workspace Configuration
 *
 * Defines two test projects:
 * 1. unit — standard Vitest tests (src/**\/*.test.{ts,tsx})
 * 2. storybook — story interaction tests via @storybook/addon-vitest
 *
 * Run all: pnpm test:workspace
 * Run unit only: pnpm test
 * Run stories only: pnpm test:stories
 *
 * More info: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
 */
export default defineWorkspace([
  // ── Project 1: existing unit + integration tests ──────────────────────────
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
    },
  },

  // ── Project 2: Storybook story interaction tests ──────────────────────────
  {
    extends: './vitest.config.ts',
    plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook'),
      }),
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['@storybook/addon-vitest/internal/setup-file'],
      // Only run stories — don't overlap with unit tests
      include: ['src/**/*.stories.{ts,tsx}'],
    },
  },
]);
