import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineProject } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest Workspace Configuration (Vitest 4+)
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
export default [
  // ── Project 1: existing unit + integration tests ──────────────────────────
  defineProject({
    resolve: {
      alias: {
        '@': path.resolve(dirname, 'src'),
        '@root': path.resolve(dirname),
      },
    },
    test: {
      name: 'unit',
      environment: 'jsdom',
      setupFiles: ['./test/setupTests.ts'],
      globals: true,
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    },
  }),

  // ── Project 2: Storybook story interaction tests ──────────────────────────
  defineProject({
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
        provider: 'playwright' as const,
        instances: [{ browser: 'chromium' as const }],
      },
      setupFiles: ['@storybook/addon-vitest/internal/setup-file'],
      // Only run stories — don't overlap with unit tests
      include: ['src/**/*.stories.{ts,tsx}'],
    },
  }),
];
