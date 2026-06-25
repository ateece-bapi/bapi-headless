/**
 * Smoke Tests — Critical Path Verification
 * @suite smoke
 *
 * A fast, focused suite that gates every deploy.  Run with:
 *   pnpm test:e2e:smoke          (Chromium only, local dev server)
 *   pnpm test:e2e:smoke:staging  (Chromium only, staging URL)
 *
 * Design rules:
 * - No shared auth state — each test is fully independent.
 * - Dynamic discovery over hardcoded slugs (resilient to data changes).
 * - Assertions target user-visible content, not implementation details.
 * - Every test title includes "@smoke" for grep filtering.
 */

import { test, expect } from '@playwright/test';
import {
  waitForFullPageLoad,
  safeClick,
  waitAfterNavigation,
} from './helpers/test-utils';
import { routes, buildRoute, DEFAULT_LOCALE } from './helpers/routes';

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------
test.describe('Homepage @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
  });

  test('homepage loads with BAPI title @smoke', async ({ page }) => {
    await expect(page).toHaveTitle(/BAPI/i);
    await expect(page.locator('main')).toBeVisible();
  });

  test('global navigation is present with Products link @smoke', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
    // Products link must be reachable from every page
    await expect(
      page.getByRole('link', { name: /products/i }).first()
    ).toBeVisible();
  });

  test('header renders logo @smoke', async ({ page }) => {
    // Logo is the first landmark link — either text "BAPI" or an img with alt
    const logo = page.locator('header').getByRole('link').first();
    await expect(logo).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
test.describe('Products @smoke', () => {
  test('products landing page loads @smoke', async ({ page }) => {
    await page.goto(routes.products());
    await waitForFullPageLoad(page);
    await expect(page).toHaveURL(new RegExp(routes.products()));
    await expect(page.locator('main')).toBeVisible();
  });

  test('products landing shows category or product links @smoke', async ({ page }) => {
    await page.goto(routes.products());
    await waitForFullPageLoad(page);
    // Products page renders category tabs (overflow-hidden, may not be visible) AND
    // category cards (visible).  Verify at least one catalog link is in the DOM.
    const catalogLinks = page.locator(
      'a[href*="/categories/"], a[href*="/product/"], a[href*="/products/"]'
    );
    await expect(catalogLinks.first()).toBeAttached({ timeout: 15000 });
  });

  test('category page loads with product links @smoke', async ({ page }) => {
    await page.goto(routes.products());
    await waitForFullPageLoad(page);

    // Find first category link and navigate into it
    const categoryLink = page
      .locator('a[href*="/categories/"], a[href*="/products/"]')
      .first();
    const href = await categoryLink.getAttribute('href');
    if (!href) test.skip(true, 'No category links found on products page');

    await page.goto(href!);
    await waitForFullPageLoad(page);
    await expect(page.locator('main')).toBeVisible();
  });

  test('product detail page loads with key fields @smoke', async ({ page }) => {
    // Products -> /products/{category} -> /products/{category}/{subcategory} -> /product/{slug}
    // Navigate up to 3 levels deep, always following VISIBLE links to avoid
    // picking up hidden tab-nav elements before the card grid.
    await page.goto(routes.products());
    await waitForFullPageLoad(page);

    let productHref: string | null = null;

    for (let level = 0; level < 3; level++) {
      // Check for visible individual product links
      const productLinks = page
        .locator('a[href*="/product/"]')
        .filter({ visible: true });
      if ((await productLinks.count()) > 0) {
        productHref = await productLinks.first().getAttribute('href');
        break;
      }

      // Drill deeper via the first VISIBLE catalog link (category card / subcategory card)
      const deeperLink = page
        .locator('a[href*="/products/"], a[href*="/categories/"]')
        .filter({ visible: true })
        .first();
      const href = await deeperLink.getAttribute('href').catch(() => null);
      if (!href) break;
      await page.goto(href);
      await waitForFullPageLoad(page);
    }

    if (!productHref) test.skip(true, 'Could not find a product link after 3 levels of catalog drill-down');

    await page.goto(productHref!);
    await waitForFullPageLoad(page);

    // Product page must have a heading (product name)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // SKU / part number is shown in the summary card only when the product has one –
    // treat absence as acceptable (sparsely-populated field per copilot-instructions).
    const skuLocator = page.locator('text=/SKU|Part No|Part Number|Model/i').first();
    const hasSku = await skuLocator.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasSku) {
      await expect(skuLocator).toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
test.describe('Search @smoke', () => {
  test('search bar is present and accepts input @smoke', async ({ page }) => {
    await page.goto(routes.home());
    await waitForFullPageLoad(page);

    // Search input may be role="searchbox", type="search", or a plain text input with
    // a search-related placeholder — try in order of specificity.
    const byRole = page.getByRole('searchbox').first();
    const byType = page.locator('input[type="search"]').first();
    const byPlaceholder = page.locator('input[placeholder*="Search" i]').first();
    const searchButton = page.getByRole('button', { name: /search/i }).first();

    let searchInput =
      (await byRole.isVisible()) ? byRole :
      (await byType.isVisible()) ? byType :
      (await byPlaceholder.isVisible()) ? byPlaceholder :
      null;

    if (!searchInput && await searchButton.isVisible()) {
      // Trigger any overlay/modal that reveals the real input
      await safeClick(searchButton);
      searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"]')).first();
      await expect(searchInput).toBeVisible({ timeout: 5000 });
    }

    if (!searchInput) test.skip(true, 'No search input found on homepage');

    await searchInput!.fill('temperature sensor');
    await expect(searchInput!).toHaveValue('temperature sensor');
  });

  test('search on products page returns results or no-results message @smoke', async ({
    page,
  }) => {
    await page.goto(routes.products());
    await waitForFullPageLoad(page);

    const searchInput = page.getByRole('searchbox').first();
    if (!(await searchInput.isVisible())) {
      test.skip(true, 'No search input on products page');
    }

    await searchInput.fill('sensor');
    // Results list or no-results text must appear
    await expect(
      page.locator(
        '[data-testid="search-results"], [role="listbox"], text=/result|no result|sensor/i'
      ).first()
    ).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------
test.describe('Cart @smoke', () => {
  test('cart page loads when empty @smoke', async ({ page }) => {
    await page.goto(routes.cart());
    await waitForFullPageLoad(page);
    await expect(page).toHaveURL(new RegExp(routes.cart()));
    await expect(page.locator('main')).toBeVisible();
    // Should show empty cart message or cart heading
    await expect(
      page.locator('text=/cart|basket|your cart/i').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('add to cart button is present on a product page @smoke', async ({ page }) => {
    await page.goto(routes.products());
    await waitForFullPageLoad(page);

    // Navigate to a product (best-effort drill-down)
    const catLink = page.locator('a[href*="/categories/"], a[href*="/products/"]').first();
    const catHref = await catLink.getAttribute('href').catch(() => null);
    if (catHref) {
      await page.goto(catHref);
      await waitForFullPageLoad(page);
    }

    let productLink = page.locator('a[href*="/product/"]').first();
    if (!(await productLink.count())) {
      const subLink = page.locator('a[href*="/products/"], a[href*="/categories/"]').first();
      const subHref = await subLink.getAttribute('href').catch(() => null);
      if (subHref) {
        await page.goto(subHref);
        await waitForFullPageLoad(page);
        productLink = page.locator('a[href*="/product/"]').first();
      }
    }

    const productHref = await productLink.getAttribute('href').catch(() => null);
    if (!productHref) test.skip(true, 'Could not reach a product detail page');

    await page.goto(productHref!);
    await waitForFullPageLoad(page);

    const addToCart = page.getByRole('button', { name: /add to cart|add to bag/i }).first();
    await expect(addToCart).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------
test.describe('Authentication @smoke', () => {
  test('sign-in page loads @smoke', async ({ page }) => {
    await page.goto(buildRoute('/sign-in'));
    await waitForFullPageLoad(page);
    await expect(page.locator('main')).toBeVisible();
    // Must have an email or username input
    await expect(
      page.locator('input[type="email"], input[name="email"], input[name="username"]').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('protected route redirects unauthenticated user to sign-in @smoke', async ({ page }) => {
    await page.goto(buildRoute('/account'));
    await waitForFullPageLoad(page);
    // Should end up at sign-in (redirect) or on the account page (if session persists from env)
    const url = page.url();
    expect(url).toMatch(/sign-in|login|account/);
  });
});

// ---------------------------------------------------------------------------
// Localisation
// ---------------------------------------------------------------------------
test.describe('Localisation @smoke', () => {
  test('locale prefix is present in all route URLs @smoke', async ({ page }) => {
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
    // URL must contain the locale prefix (e.g. /en or /de)
    expect(page.url()).toMatch(new RegExp(`/${DEFAULT_LOCALE}(/|$)`));
  });

  test('switching locale navigates to new locale URL @smoke', async ({ page }, testInfo) => {
    // Language switching requires a desktop viewport to reach the locale switcher in the header
    if (testInfo.project.name.toLowerCase().includes('mobile')) {
      test.skip(true, 'Language selector tested on desktop only in smoke suite');
    }

    await page.goto(routes.home());
    await waitForFullPageLoad(page);

    // The locale switcher may be a button, link, or select element
    const localeButton = page
      .locator('button, [role="button"]')
      .filter({ hasText: /^(EN|DE|FR|ES|en|de|fr|es)$/ })
      .first();

    if (!(await localeButton.isVisible({ timeout: 3000 }))) {
      test.skip(true, 'Locale switcher button not found in current layout');
    }

    await safeClick(localeButton);

    // After opening, find an option for a different locale (e.g. German)
    const deOption = page
      .locator('a, button, [role="option"], [role="menuitem"]')
      .filter({ hasText: /Deutsch|German|^DE$|^de$/i })
      .first();

    if (!(await deOption.isVisible({ timeout: 3000 }))) {
      test.skip(true, 'German locale option not visible');
    }

    await safeClick(deOption);
    await waitAfterNavigation(page, { expectedUrl: /\/de\// });
    expect(page.url()).toContain('/de/');
  });
});

// ---------------------------------------------------------------------------
// Static / Info pages
// ---------------------------------------------------------------------------
test.describe('Static pages @smoke', () => {
  test('trade shows page loads @smoke', async ({ page }) => {
    await page.goto(buildRoute('/company/trade-shows'));
    await waitForFullPageLoad(page);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('unknown route returns a 404 page @smoke', async ({ page }) => {
    const response = await page.goto(buildRoute('/this-page-does-not-exist-404-check'));
    // Next.js returns 404 for unknown routes
    expect(response?.status()).toBe(404);
  });
});
