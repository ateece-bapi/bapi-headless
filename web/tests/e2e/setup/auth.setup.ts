/**
 * Authentication Setup for E2E Tests
 *
 * Runs once before any authenticated test project. Logs in with the E2E test
 * user credentials and persists the browser state (cookies + localStorage) to
 * playwright/.auth/user.json so every authenticated test starts already logged in
 * without repeating the login flow.
 *
 * Required env vars (add to .env.local or export before running):
 *   E2E_USERNAME  — WordPress username or email of the test account
 *   E2E_PASSWORD  — Password for the test account
 *
 * Run the full authenticated suite:
 *   pnpm test:e2e:auth
 */

import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { buildRoute } from '../helpers/routes';

/** Path to the persisted auth state file — imported by playwright.config.ts */
export const AUTH_STATE_PATH = path.join(
  __dirname,
  '../../../playwright/.auth/user.json'
);

setup('authenticate as E2E test user', async ({ page }) => {
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Missing E2E credentials.\n' +
      'Set E2E_USERNAME and E2E_PASSWORD in .env.local or export them before running.\n' +
      'Example: E2E_USERNAME=testuser@bapihvac.com E2E_PASSWORD=TestPassword123!'
    );
  }

  // ── Navigate to sign-in ──────────────────────────────────────────────────
  await page.goto(buildRoute('/sign-in'));
  await page.waitForLoadState('networkidle');

  // ── Fill credentials ─────────────────────────────────────────────────────
  // The SignInForm uses id="username" (accepts email or username) and id="password"
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);

  // ── Submit ───────────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /sign in|log in/i }).first().click();

  // ── Wait for successful redirect away from sign-in ───────────────────────
  await page.waitForURL(
    (url) => !url.pathname.includes('sign-in'),
    { timeout: 20000 }
  );

  // ── Verify the auth_token cookie was set (JWT from WPGraphQL JWT Auth) ───
  const cookies = await page.context().cookies();
  const authCookie = cookies.find((c) => c.name === 'auth_token');
  expect(authCookie, 'auth_token cookie must be present after login').toBeTruthy();

  // ── Persist full browser state (cookies + localStorage) ─────────────────
  // Tests that use storageState: AUTH_STATE_PATH will start with this context
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
