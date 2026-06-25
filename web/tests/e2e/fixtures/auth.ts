/**
 * Auth fixtures for authenticated E2E tests.
 *
 * Re-exports @playwright/test so *.auth.spec.ts files can import `test` and
 * `expect` from a single, consistent location.  The actual storageState is
 * applied at the project level in playwright.config.ts (project: authenticated),
 * so the standard `{ page }` fixture is already logged-in inside those specs.
 */
export { test, expect } from '@playwright/test';
export { AUTH_STATE_PATH } from '../setup/auth.setup';
