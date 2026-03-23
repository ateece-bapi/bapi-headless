import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Testing
 * 
 * Tests critical user journeys across 11 languages:
 * - Authentication flows
 * - Product browsing & search
 * - Cart operations
 * - Checkout process
 * - Language/region switching
 */

export default defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run for (increased for enterprise test patterns)
  // Tests now handle React animations, Suspense boundaries, deep category nesting
  timeout: 60 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Reduce workers for stability (11 was causing interference)
  workers: process.env.CI ? 1 : 6,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for e2e tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
      // Increase timeout - responsive test manually sets mobile viewport on webkit
      timeout: 90 * 1000, // 90s to handle viewport changes + slow rendering
    },

    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
      // Mobile devices need longer timeouts (slower rendering, network)
      timeout: 90 * 1000, // 90s vs 60s for desktop
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
      // Mobile devices need longer timeouts (slower rendering, network)
      timeout: 90 * 1000, // 90s vs 60s for desktop
    },
  ],

  // Run local dev server before starting the tests
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
