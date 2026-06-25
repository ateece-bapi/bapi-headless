/**
 * Auth fixtures for authenticated E2E tests.
 *
 * Re-exports @playwright/test so *.auth.spec.ts files can import `test` and
 * `expect` from a single, consistent location.  The actual storageState is
 * applied at the project level in playwright.config.ts (project: authenticated),
 * so the standard `{ page }` fixture is already logged-in inside those specs.
 *
 * AUTH_STATE_PATH is defined here (not imported from auth.setup.ts) to avoid
 * side-effects: importing auth.setup.ts registers a Playwright `setup()` test
 * which would run inside the authenticated project, duplicating the login flow.
 */
import path from 'path';

export { test, expect } from '@playwright/test';

/** Shared path to the persisted browser auth state used by playwright.config.ts */
export const AUTH_STATE_PATH = path.join(
  __dirname,
  '../../playwright/.auth/user.json'
);
