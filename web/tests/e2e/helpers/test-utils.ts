import { Page, Locator } from '@playwright/test';

/**
 * Enterprise-Level E2E Test Utilities
 * 
 * Handles common challenges in modern React applications:
 * - CSS animations and transitions
 * - React Suspense boundaries
 * - Lazy-loaded components
 * - Element stability during interactions
 */

/**
 * Wait for animations to complete before interacting with element
 * Prevents "element detached from DOM" errors
 */
export async function waitForAnimations(page: Page, timeout: number = 500): Promise<void> {
  await page.waitForTimeout(timeout);
}

/**
 * Wait for element to be stable (no animations, no DOM changes)
 * Uses Playwright's built-in actionability checks + custom stability verification
 * @throws Error if element never stabilizes within timeout
 */
export async function waitForStableElement(locator: Locator, timeout: number = 5000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  
  // Wait for element to stop moving/changing
  let previousBoundingBox = await locator.boundingBox();
  const startTime = Date.now();
  const checkInterval = 100;
  
  while (Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    const currentBoundingBox = await locator.boundingBox();
    
    if (!previousBoundingBox || !currentBoundingBox) {
      // Element disappeared, wait for it to reappear
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      previousBoundingBox = await locator.boundingBox();
      continue;
    }
    
    // Check if position and size are stable
    const isStable = 
      previousBoundingBox.x === currentBoundingBox.x &&
      previousBoundingBox.y === currentBoundingBox.y &&
      previousBoundingBox.width === currentBoundingBox.width &&
      previousBoundingBox.height === currentBoundingBox.height;
    
    if (isStable) {
      return;
    }
    
    previousBoundingBox = currentBoundingBox;
  }
  
  // If we get here, element never stabilized
  throw new Error(`Element did not stabilize within ${timeout}ms`);
}

/**
 * Safely click element with retry logic for animations and React re-renders
 * Handles: animations, Suspense boundaries, lazy loading, transient errors
 * Retries on common transient failures (detached, not clickable, etc.)
 */
export async function safeClick(
  locator: Locator, 
  options: { 
    waitForAnimations?: boolean;
    timeout?: number;
    force?: boolean;
    retries?: number;
  } = {}
): Promise<void> {
  const { 
    waitForAnimations: shouldWaitForAnimations = true, 
    timeout = 10000,
    force = false,
    retries = 3
  } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      
      if (shouldWaitForAnimations) {
        await waitForStableElement(locator, timeout);
      }
      
      await locator.click({ timeout, force });
      return; // Success!
    } catch (error) {
      lastError = error as Error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a transient error worth retrying
      const isTransient = 
        errorMessage.includes('detached') ||
        errorMessage.includes('not clickable') ||
        errorMessage.includes('obscured') ||
        errorMessage.includes('outside the viewport');
      
      if (isTransient && attempt < retries - 1) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      // Non-transient error or last retry - throw
      throw error;
    }
  }
  
  // Should never reach here, but just in case
  throw lastError || new Error('Click failed after retries');
}

/**
 * Navigate through category/subcategory hierarchy to find products
 * Handles deep nesting (3+ levels) and animations
 */
export async function navigateToProducts(
  page: Page,
  maxDepth: number = 3
): Promise<Locator> {
  let currentDepth = 0;
  
  while (currentDepth < maxDepth) {
    // Wait for page to fully load
    await waitForAnimations(page, 800);
    
    // Look for product links in main content area (not navigation)
    const productLinks = page.locator('main a[href*="/product/"], section a[href*="/product/"]');
    const productCount = await productLinks.count();
    
    if (productCount > 0) {
      // Wait for first product link to be stable
      await waitForStableElement(productLinks.first());
      return productLinks.first();
    }
    
    // No products found, look for subcategory links in main content
    // Exclude navigation, headers, footers
    const subcategoryLinks = page.locator('main a[href*="/products/"], main a[href*="/categories/"]');
    const subcategoryCount = await subcategoryLinks.count();
    
    if (subcategoryCount === 0) {
      // Try alternative selectors - sometimes content is in article or section tags
      const alternativeLinks = page.locator('article a[href*="/products/"], section a[href*="/categories/"]');
      const altCount = await alternativeLinks.count();
      
      if (altCount > 0) {
        const firstLink = await getFirstVisibleElement(alternativeLinks);
        await safeClick(firstLink);
        await waitForFullPageLoad(page);
        currentDepth++;
        continue;
      }
      
      throw new Error(`No products or subcategories found at depth ${currentDepth}. Page may have empty category or unexpected structure.`);
    }
    
    // Navigate to first visible subcategory
    const firstSubcategory = await getFirstVisibleElement(subcategoryLinks);
    await safeClick(firstSubcategory);
    await waitForFullPageLoad(page);
    
    currentDepth++;
  }
  
  throw new Error(`Could not find products after navigating ${maxDepth} levels deep`);
}

/**
 * Wait for page to be fully loaded with all async content
 * More reliable than waitForLoadState alone
 */
export async function waitForFullPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for any React Suspense boundaries to resolve
  await waitForAnimations(page, 300);
  
  // Wait for images to load (important for product pages)
  // Add timeout to prevent hanging on slow/failed image loads
  try {
    await page.evaluate(() => {
      const IMAGE_LOAD_TIMEOUT = 10000; // 10 second timeout per image
      
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            // Set timeout to resolve even if image fails
            const timeout = setTimeout(() => {
              resolve('timeout');
            }, IMAGE_LOAD_TIMEOUT);
            
            // Clear timeout on success/error
            img.onload = img.onerror = () => {
              clearTimeout(timeout);
              resolve('loaded');
            };
          }))
      );
    });
  } catch (error) {
    // Image loading failed, but don't block test execution
    // This can happen with external images, network issues, etc.
    console.warn('Image loading timeout or error:', error);
  }
}

/**
 * Scroll element into view and wait for it to be stable
 * Useful for lazy-loaded content
 */
export async function scrollIntoViewAndWait(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  await waitForAnimations(locator.page(), 300);
  await waitForStableElement(locator);
}

/**
 * Get first visible element from a locator that might match multiple elements
 * Useful when some matches are in hidden navigation
 */
export async function getFirstVisibleElement(locator: Locator): Promise<Locator> {
  const count = await locator.count();
  
  for (let i = 0; i < count; i++) {
    const element = locator.nth(i);
    if (await element.isVisible()) {
      return element;
    }
  }
  
  throw new Error('No visible elements found');
}

/**
 * Wait for network requests to complete
 * Useful after form submissions or AJAX calls
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Retry an action up to N times if it fails
 * Useful for flaky interactions
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const { 
    maxRetries = 3, 
    retryDelay = 1000,
    shouldRetry = () => true 
  } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      
      if (!shouldRetry(lastError) || attempt === maxRetries - 1) {
        throw lastError;
      }
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError;
}
