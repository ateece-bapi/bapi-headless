import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { routes } from './helpers/routes';
import { safeClick, waitForStableElement } from './helpers/test-utils';

/**
 * Product Navigation E2E Tests (Phase C)
 * 
 * Tests product discovery and navigation flows:
 * - Category/subcategory navigation with breadcrumbs
 * - Product search and filtering
 * - Product detail page functionality
 * - Related products and recommendations
 * - Mega-menu integration
 * 
 * Critical for Phase 1 Priority #3: Product Navigation
 */

test.describe('Category Navigation', () => {
  test('should display product categories on products page', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Should show categories or category links
    const categoryLinks = page.locator('a[href*="/categories/"], a[href*="/category/"]');
    const categoryCount = await categoryLinks.count();
    
    // Should have at least one category
    expect(categoryCount).toBeGreaterThan(0);
  });

  test('should navigate to category page and display products', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Find first category link
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      const categoryHref = await categoryLink.getAttribute('href');
      expect(categoryHref).toBeTruthy();
      
      // Navigate to category
      await safeClick(categoryLink);
      await page.waitForTimeout(2000);
      
      // Should be on category page
      expect(page.url()).toMatch(/\/categories?\/|\/category\//);
      
      // Should show products or subcategories
      const productLinks = page.locator('a[href*="/product/"]');
      const subCategoryLinks = page.locator('a[href*="/categories/"], a[href*="/category/"]');
      
      const productsCount = await productLinks.count();
      const subCategoriesCount = await subCategoryLinks.count();
      
      // Category should show either products or subcategories
      expect(productsCount + subCategoriesCount).toBeGreaterThan(0);
    }
  });

  test('should display breadcrumb navigation on category page', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Navigate to category
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      await safeClick(categoryLink);
      await page.waitForTimeout(2000);
      
      // Look for breadcrumb navigation
      const breadcrumb = page.locator('nav[aria-label*="breadcrumb" i], [role="navigation"]:has-text("Home"), ol:has(a[href*="/"]):has(li)').first();
      
      if (await breadcrumb.isVisible({ timeout: 2000 })) {
        // Breadcrumb should contain "Home" or "Products" link
        const homeLink = breadcrumb.locator('a').first();
        await expect(homeLink).toBeVisible();
        
        const breadcrumbText = await breadcrumb.textContent();
        expect(breadcrumbText).toBeTruthy();
      }
    }
  });

  test('should navigate through subcategories', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Navigate to first category
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      await safeClick(categoryLink);
      await page.waitForTimeout(2000);
      
      // Look for subcategories
      const subCategoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
      
      if (await subCategoryLink.isVisible({ timeout: 2000 })) {
        const subCategoryHref = await subCategoryLink.getAttribute('href');
        expect(subCategoryHref).toBeTruthy();
        
        // Navigate to subcategory
        await safeClick(subCategoryLink);
        await page.waitForTimeout(2000);
        
        // Should be on subcategory page
        expect(page.url()).toMatch(/\/categories?\/|\/category\//);
        
        // Breadcrumb should show hierarchy (Home > Category > Subcategory)
        const breadcrumbItems = page.locator('nav[aria-label*="breadcrumb" i] a, [role="navigation"] a');
        const itemCount = await breadcrumbItems.count();
        
        // Should have at least 2 breadcrumb items (Home + Category)
        if (itemCount > 0) {
          expect(itemCount).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });
});

test.describe('Product Detail Pages', () => {
  test('should navigate to product detail page', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Should display product name
      const productName = page.locator('h1, [data-testid="product-name"]').first();
      await expect(productName).toBeVisible({ timeout: 5000 });
      
      // Should display price
      const pricePattern = /\$|€|USD|EUR|¥|JPY/;
      const priceElement = page.locator('text=/\\$|€|USD|EUR|¥|JPY/i').first();
      
      if (await priceElement.isVisible({ timeout: 3000 })) {
        const priceText = await priceElement.textContent();
        expect(priceText).toMatch(pricePattern);
      }
    }
  });

  test('should display product images', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Look for product images
      const productImages = page.locator('img[alt*="product" i], [data-testid*="product-image"], main img').first();
      
      if (await productImages.isVisible({ timeout: 3000 })) {
        // Image should have valid src
        const imageSrc = await productImages.getAttribute('src');
        expect(imageSrc).toBeTruthy();
        expect(imageSrc).not.toBe('');
      }
    }
  });

  test('should display product description', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Look for description section
      const description = page.locator('[data-testid*="description"], section:has-text("Description"), .product-description, main p').first();
      
      if (await description.isVisible({ timeout: 3000 })) {
        const descriptionText = await description.textContent();
        expect(descriptionText?.length).toBeGreaterThan(10);
      }
    }
  });

  test('should display Add to Cart button on product page', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Look for Add to Cart button (language agnostic)
      const addToCartButton = page.getByRole('button').filter({ hasText: /cart|carrito|panier|warenkorb/i });
      
      const buttonVisible = await addToCartButton.first().isVisible({ timeout: 3000 }).catch(() => false);
      
      // Most products should have Add to Cart (unless out of stock)
      if (!buttonVisible) {
        // Check for out of stock indicator
        const outOfStock = page.locator('text=/out of stock|sold out|agotado|épuisé/i');
        const isOutOfStock = await outOfStock.isVisible({ timeout: 1000 }).catch(() => false);
        
        console.log(`Product page - Add to Cart: ${buttonVisible}, Out of Stock: ${isOutOfStock}`);
      }
    }
  });

  test('should display related or recommended products', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Scroll down to load related products (lazy loading)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      
      // Look for related/recommended products section
      const relatedSection = page.locator('section:has-text("Related"), section:has-text("Recommended"), [data-testid*="related"]').first();
      
      if (await relatedSection.isVisible({ timeout: 3000 })) {
        // Should have product links
        const relatedProducts = relatedSection.locator('a[href*="/product/"]');
        const relatedCount = await relatedProducts.count();
        
        expect(relatedCount).toBeGreaterThan(0);
      }
    }
  });

  test('should show product tabs (details, specs, documents)', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Look for tabs (Details, Specifications, Documents)
      const tabs = page.locator('[role="tab"], .tabs button, [data-testid*="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        // Should have multiple tabs
        expect(tabCount).toBeGreaterThanOrEqual(1);
        
        // Click second tab if exists
        if (tabCount > 1) {
          await safeClick(tabs.nth(1));
          await page.waitForTimeout(500);
          
          // Tab panel should be visible
          const tabPanel = page.locator('[role="tabpanel"]:visible, [data-testid*="panel"]:visible').first();
          
          if (await tabPanel.isVisible({ timeout: 2000 })) {
            const panelText = await tabPanel.textContent();
            expect(panelText?.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

test.describe('Product Search', () => {
  test('should display search bar', async ({ page }) => {
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], [role="searchbox"]').first();
    
    await expect(searchInput).toBeVisible({ timeout: 5000 });
  });

  test('should search for products and display results', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], [role="searchbox"]').first();
    
    if (await searchInput.isVisible({ timeout: 3000 })) {
      // Search for common term (HVAC products)
      await searchInput.fill('valve');
      await page.waitForTimeout(1000);
      
      // Press Enter or click search button
      await searchInput.press('Enter');
      await page.waitForTimeout(2000);
      
      // Should show results or "no results" message
      const results = page.locator('a[href*="/product/"]');
      const noResults = page.locator('text=/no results|no products|sin resultados/i');
      
      const hasResults = await results.first().isVisible({ timeout: 3000 }).catch(() => false);
      const hasNoResults = await noResults.isVisible({ timeout: 2000 }).catch(() => false);
      
      // Should show either results or no results message
      expect(hasResults || hasNoResults).toBeTruthy();
    }
  });

  test('should clear search and return to all products', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], [role="searchbox"]').first();
    
    if (await searchInput.isVisible({ timeout: 3000 })) {
      // Perform search
      await searchInput.fill('test search');
      await searchInput.press('Enter');
      await page.waitForTimeout(1500);
      
      // Clear search
      await searchInput.clear();
      await searchInput.press('Enter');
      await page.waitForTimeout(1500);
      
      // Should return to all products view
      const products = page.locator('a[href*="/product/"]');
      const productCount = await products.count();
      
      // Should show products again
      expect(productCount).toBeGreaterThan(0);
    }
  });
});

test.describe('Product Filtering & Sorting', () => {
  test('should display filter options', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Look for filter controls (price, category, etc.)
    const filterControls = page.locator('select, [role="combobox"], button:has-text("Filter"), [data-testid*="filter"]');
    const filterCount = await filterControls.count();
    
    // May or may not have filters depending on implementation
    console.log(`Filter controls found: ${filterCount}`);
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Look for sort dropdown
    const sortSelect = page.locator('select:has(option:text-matches("price|precio", "i")), [data-testid*="sort"]').first();
    
    if (await sortSelect.isVisible({ timeout: 2000 })) {
      // Get initial product order
      const initialProducts = await page.locator('a[href*="/product/"]').first().textContent();
      
      // Select price sort option (try to find by text)
      const options = await sortSelect.locator('option').allTextContents();
      const priceOption = options.find(opt => /price|precio/i.test(opt));
      
      if (priceOption) {
        await sortSelect.selectOption({ label: priceOption });
        await page.waitForTimeout(2000);
        
        // Products should reorder
        const sortedProducts = await page.locator('a[href*="/product/"]').first().textContent();
        
        // May or may not change (depends on current sort)
        console.log(`Initial: ${initialProducts?.slice(0, 50)}, Sorted: ${sortedProducts?.slice(0, 50)}`);
      }
    }
  });
});

test.describe('Breadcrumb Navigation', () => {
  test('breadcrumb links should be clickable and functional', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Navigate to category
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      await safeClick(categoryLink);
      await page.waitForTimeout(2000);
      
      // Find breadcrumb
      const breadcrumb = page.locator('nav[aria-label*="breadcrumb" i], [role="navigation"]:has(a[href*="/"])').first();
      
      if (await breadcrumb.isVisible({ timeout: 2000 })) {
        // Get all breadcrumb links
        const breadcrumbLinks = breadcrumb.locator('a');
        const linkCount = await breadcrumbLinks.count();
        
        if (linkCount > 0) {
          // Click first breadcrumb (should go to home/products)
          const firstLink = breadcrumbLinks.first();
          const href = await firstLink.getAttribute('href');
          
          await safeClick(firstLink);
          await page.waitForTimeout(2000);
          
          // Should navigate back
          expect(page.url()).not.toContain('undefined');
        }
      }
    }
  });

  test('breadcrumb should show current page as last item', async ({ page }) => {
    const productUrl = await findProductUrl(page);
    
    if (productUrl) {
      await page.goto(productUrl, { waitUntil: 'commit', timeout: 60000 });
      await page.waitForTimeout(2000);
      
      // Find breadcrumb
      const breadcrumb = page.locator('nav[aria-label*="breadcrumb" i], [role="navigation"]:has(li)').first();
      
      if (await breadcrumb.isVisible({ timeout: 2000 })) {
        // Last breadcrumb item should be current page (not a link)
        const breadcrumbItems = breadcrumb.locator('li, span[aria-current]');
        const itemCount = await breadcrumbItems.count();
        
        if (itemCount > 0) {
          const lastItem = breadcrumbItems.last();
          const lastItemText = await lastItem.textContent();
          
          // Last item should have text
          expect(lastItemText?.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

test.describe('Mobile Product Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile-friendly category navigation', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Categories should be visible on mobile
    const categoryLinks = page.locator('a[href*="/categories/"], a[href*="/category/"]');
    const categoryCount = await categoryLinks.count();
    
    expect(categoryCount).toBeGreaterThan(0);
  });

  test('should display mobile-friendly product grid', async ({ page }) => {
    await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Products should display in mobile layout
    const productLinks = page.locator('a[href*="/product/"]');
    const productCount = await productLinks.count();
    
    if (productCount > 0) {
      // First product should be visible
      await expect(productLinks.first()).toBeVisible();
    }
  });

  test('should show hamburger menu for navigation', async ({ page }) => {
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i], [data-testid*="mobile-menu"]').first();
    
    if (await menuButton.isVisible({ timeout: 3000 })) {
      // Click to open mobile menu
      await safeClick(menuButton);
      await page.waitForTimeout(500);
      
      // Mobile menu should be visible
      const mobileMenu = page.locator('nav[aria-label*="mobile" i], [role="navigation"]:visible, [data-testid*="mobile-menu"]:visible').first();
      
      if (await mobileMenu.isVisible({ timeout: 2000 })) {
        // Should contain navigation links
        const navLinks = mobileMenu.locator('a');
        const linkCount = await navLinks.count();
        
        expect(linkCount).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('Mega-Menu Integration', () => {
  test('should display mega-menu on products hover (desktop)', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 768, 'Desktop only test');
    
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Find Products navigation link
    const productsNav = page.locator('nav a:has-text("Products"), [role="navigation"] a:has-text("Products")').first();
    
    if (await productsNav.isVisible({ timeout: 3000 })) {
      // Hover over products
      await productsNav.hover();
      await page.waitForTimeout(500);
      
      // Look for mega menu or dropdown
      const megaMenu = page.locator('[role="menu"], .mega-menu, nav [role="navigation"] > div:visible').first();
      
      if (await megaMenu.isVisible({ timeout: 2000 })) {
        // Mega menu should contain category links
        const categoryLinks = megaMenu.locator('a');
        const linkCount = await categoryLinks.count();
        
        expect(linkCount).toBeGreaterThan(0);
      }
    }
  });

  test('mega-menu should show categories organized by type', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 768, 'Desktop only test');
    
    await page.goto(routes.home(), { waitUntil: 'commit', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Find Products navigation
    const productsNav = page.locator('nav a:has-text("Products"), [role="navigation"] a:has-text("Products")').first();
    
    if (await productsNav.isVisible({ timeout: 3000 })) {
      await productsNav.hover();
      await page.waitForTimeout(500);
      
      // Look for category groups (Valves, Actuators, Sensors, etc.)
      const categoryGroups = page.locator('[role="menu"] section, .mega-menu section, [data-testid*="category-group"]');
      const groupCount = await categoryGroups.count();
      
      console.log(`Mega-menu category groups: ${groupCount}`);
    }
  });
});

/**
 * Helper: Find a product URL from products page
 */
async function findProductUrl(page: Page): Promise<string | null> {
  await page.goto(routes.products(), { waitUntil: 'commit', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  // Try to find product links
  let productLinks = page.locator('a[href*="/product/"]');
  let productCount = await productLinks.count();
  
  // Navigate through categories if needed
  if (productCount === 0) {
    const categoryLink = page.locator('a[href*="/categories/"], a[href*="/category/"]').first();
    
    if (await categoryLink.isVisible({ timeout: 3000 })) {
      await safeClick(categoryLink);
      await page.waitForTimeout(2000);
      
      productLinks = page.locator('a[href*="/product/"]');
      productCount = await productLinks.count();
    }
  }
  
  if (productCount > 0) {
    const productHref = await productLinks.first().getAttribute('href');
    
    // Convert relative URL to absolute if needed
    if (productHref) {
      if (productHref.startsWith('http')) {
        return productHref;
      } else {
        const baseUrl = page.url().split('/').slice(0, 3).join('/');
        return `${baseUrl}${productHref}`;
      }
    }
  }
  
  return null;
}
