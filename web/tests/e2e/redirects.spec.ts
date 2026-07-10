/**
 * Redirect Rule Tests
 * @suite redirects
 *
 * Verifies that every redirect defined in web/next.config.ts resolves to the
 * correct destination.  Tests follow actual HTTP responses (no JS), so they
 * validate the Next.js routing layer directly.
 *
 * Run with:
 *   pnpm test:e2e -- --grep "@redirects"
 *
 * Design rules:
 *   - Each test corresponds to a named redirect rule in next.config.ts.
 *   - Both the bare (no locale) and locale-prefixed variants are tested.
 *   - Tests use `request` (not `page.goto`) so we capture the raw 3xx status.
 *   - Expected destinations are the canonical URLs — include locale prefix.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

/**
 * Asserts that `source` redirects to `expectedDestination`.
 * Follows at most one redirect so we can inspect the final URL.
 */
async function assertRedirects(
  request: import('@playwright/test').APIRequestContext,
  source: string,
  expectedDestination: string,
): Promise<void> {
  const url = `${BASE_URL}${source}`;
  const response = await request.get(url, { maxRedirects: 1 });
  // The response URL after following the single redirect should match.
  expect(
    response.url(),
    `Expected ${source} to redirect to ${expectedDestination}`,
  ).toContain(expectedDestination);
}

// ---------------------------------------------------------------------------
// /company/contact* → /contact
// Added: 2025-09-10
// ---------------------------------------------------------------------------
test.describe('/company/contact* redirects @redirects', () => {
  test('/company/contact → /en/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/company/contact', '/en/contact');
  });

  test('/company/contact-us → /en/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/company/contact-us', '/en/contact');
  });

  test('/de/company/contact → /de/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/de/company/contact', '/de/contact');
  });

  test('/de/company/contact-us → /de/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/de/company/contact-us', '/de/contact');
  });
});

// ---------------------------------------------------------------------------
// /sign-up → /sign-in
// Added: 2025-10-01
// ---------------------------------------------------------------------------
test.describe('/sign-up redirects @redirects', () => {
  test('/sign-up → /en/sign-in @redirects', async ({ request }) => {
    await assertRedirects(request, '/sign-up', '/en/sign-in');
  });

  test('/fr/sign-up → /fr/sign-in @redirects', async ({ request }) => {
    await assertRedirects(request, '/fr/sign-up', '/fr/sign-in');
  });
});

// ---------------------------------------------------------------------------
// /products/* stubs → canonical sections
// Added: 2025-11-15
// ---------------------------------------------------------------------------
test.describe('/products/* stub redirects @redirects', () => {
  // technical-documentation + learning-center → /resources
  test('/products/technical-documentation → /en/resources @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/technical-documentation', '/en/resources');
  });

  test('/products/learning-center → /en/resources @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/learning-center', '/en/resources');
  });

  test('/es/products/technical-documentation → /es/resources @redirects', async ({ request }) => {
    await assertRedirects(request, '/es/products/technical-documentation', '/es/resources');
  });

  test('/es/products/learning-center → /es/resources @redirects', async ({ request }) => {
    await assertRedirects(request, '/es/products/learning-center', '/es/resources');
  });

  // tools-guides → /resources/selector
  test('/products/tools-guides → /en/resources/selector @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/tools-guides', '/en/resources/selector');
  });

  test('/ja/products/tools-guides → /ja/resources/selector @redirects', async ({ request }) => {
    await assertRedirects(request, '/ja/products/tools-guides', '/ja/resources/selector');
  });

  // get-help + for-existing-customers → /support
  test('/products/get-help → /en/support @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/get-help', '/en/support');
  });

  test('/products/for-existing-customers → /en/support @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/for-existing-customers', '/en/support');
  });

  test('/zh/products/get-help → /zh/support @redirects', async ({ request }) => {
    await assertRedirects(request, '/zh/products/get-help', '/zh/support');
  });

  test('/zh/products/for-existing-customers → /zh/support @redirects', async ({ request }) => {
    await assertRedirects(request, '/zh/products/for-existing-customers', '/zh/support');
  });

  // about-bapi → /company
  test('/products/about-bapi → /en/company @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/about-bapi', '/en/company');
  });

  test('/de/products/about-bapi → /de/company @redirects', async ({ request }) => {
    await assertRedirects(request, '/de/products/about-bapi', '/de/company');
  });

  // get-in-touch → /contact
  test('/products/get-in-touch → /en/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/get-in-touch', '/en/contact');
  });

  test('/fr/products/get-in-touch → /fr/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/fr/products/get-in-touch', '/fr/contact');
  });
});

// ---------------------------------------------------------------------------
// /resources/application-notes → /application-notes
// Added: 2026-01-20
// ---------------------------------------------------------------------------
test.describe('/resources/application-notes redirects @redirects', () => {
  test('/resources/application-notes → /en/application-notes @redirects', async ({ request }) => {
    await assertRedirects(request, '/resources/application-notes', '/en/application-notes');
  });

  test('/de/resources/application-notes → /de/application-notes @redirects', async ({ request }) => {
    await assertRedirects(request, '/de/resources/application-notes', '/de/application-notes');
  });
});

// ---------------------------------------------------------------------------
// /quote → /request-quote
// Added: 2026-01-20
// ---------------------------------------------------------------------------
test.describe('/quote redirects @redirects', () => {
  test('/quote → /en/request-quote @redirects', async ({ request }) => {
    await assertRedirects(request, '/quote', '/en/request-quote');
  });

  test('/es/quote → /es/request-quote @redirects', async ({ request }) => {
    await assertRedirects(request, '/es/quote', '/es/request-quote');
  });
});

// ---------------------------------------------------------------------------
// /products/categories → /products
// Added: 2025-12-01
// ---------------------------------------------------------------------------
test.describe('/products/categories redirects @redirects', () => {
  test('/products/categories → /en/products @redirects', async ({ request }) => {
    await assertRedirects(request, '/products/categories', '/en/products');
  });

  test('/fr/products/categories → /fr/products @redirects', async ({ request }) => {
    await assertRedirects(request, '/fr/products/categories', '/fr/products');
  });
});

// ---------------------------------------------------------------------------
// /support/contact → /contact
// Added: 2025-12-01
// ---------------------------------------------------------------------------
test.describe('/support/contact redirects @redirects', () => {
  test('/support/contact → /en/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/support/contact', '/en/contact');
  });

  test('/ja/support/contact → /ja/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/ja/support/contact', '/ja/contact');
  });
});

// ---------------------------------------------------------------------------
// /company/about → /company/why-bapi
// Added: 2025-12-01
// ---------------------------------------------------------------------------
test.describe('/company/about redirects @redirects', () => {
  test('/company/about → /en/company/why-bapi @redirects', async ({ request }) => {
    await assertRedirects(request, '/company/about', '/en/company/why-bapi');
  });

  test('/de/company/about → /de/company/why-bapi @redirects', async ({ request }) => {
    await assertRedirects(request, '/de/company/about', '/de/company/why-bapi');
  });
});

// ---------------------------------------------------------------------------
// /contact-sales → /contact
// Added: 2025-12-15
// ---------------------------------------------------------------------------
test.describe('/contact-sales redirects @redirects', () => {
  test('/contact-sales → /en/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/contact-sales', '/en/contact');
  });

  test('/zh/contact-sales → /zh/contact @redirects', async ({ request }) => {
    await assertRedirects(request, '/zh/contact-sales', '/zh/contact');
  });
});

// ---------------------------------------------------------------------------
// /company/news[/:slug] → /en/company/news[/:slug]
// Added: 2026-01-05
// ---------------------------------------------------------------------------
test.describe('/company/news redirects @redirects', () => {
  test('/company/news → /en/company/news @redirects', async ({ request }) => {
    await assertRedirects(request, '/company/news', '/en/company/news');
  });

  test('/company/news/some-article → /en/company/news/some-article @redirects', async ({ request }) => {
    await assertRedirects(request, '/company/news/some-article', '/en/company/news/some-article');
  });

  test('slug is preserved for nested paths @redirects', async ({ request }) => {
    await assertRedirects(
      request,
      '/company/news/2026/product-launch',
      '/en/company/news/2026/product-launch',
    );
  });
});

// ---------------------------------------------------------------------------
// /product/:slug → /en/product/:slug (QR code compatibility)
// Added: 2026-01-10
// ---------------------------------------------------------------------------
test.describe('/product/:slug QR-code redirects @redirects', () => {
  test('/product/current-switch → /en/product/current-switch @redirects', async ({ request }) => {
    await assertRedirects(request, '/product/current-switch', '/en/product/current-switch');
  });

  test('/product/pressure-transmitter-123 → /en/product/pressure-transmitter-123 @redirects', async ({ request }) => {
    await assertRedirects(
      request,
      '/product/pressure-transmitter-123',
      '/en/product/pressure-transmitter-123',
    );
  });
});
