import { defineConfig } from 'vitest/config';
import path from 'path';

// Only enable JUnit reporter in CI (for GitHub Actions and artifact upload)
const reporters = process.env.CI
  ? [['junit', { outputFile: 'test-output/junit.xml' }]]
  : [];

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './test/setupTests.ts',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    reporters,
  },
});
