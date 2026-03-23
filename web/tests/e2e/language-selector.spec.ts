import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { waitForFullPageLoad, safeClick, waitForPageReady } from './helpers/test-utils';
import { routes } from './helpers/routes';

/**
 * Language Selector E2E Tests
 * 
 * Tests the language switching functionality including:
 * - Language dropdown interaction
 * - Toast notification appearance
 * - URL locale change
 * - Page content translation
 * - Accessibility compliance
 */

test.describe('Language Selector', () => {
  test.beforeEach(async ({ page }) => {
    // Start on the homepage
    await page.goto(routes.home());
    
    // Wait for page to be fully loaded
    await waitForFullPageLoad(page);
  });

  test('should display language selector with current language', async ({ page }) => {
    // Find the language selector button (Headless UI Listbox)
    const languageButton = page.getByRole('button', { name: /select language/i });
    await expect(languageButton).toBeVisible();
    
    // Should show English by default
    await expect(languageButton).toContainText('English');
    
    // Should have the English flag emoji
    await expect(languageButton).toContainText('🇺🇸');
  });

  test('should open language dropdown on click', async ({ page }) => {
    // Click the language selector button
    const languageButton = page.getByRole('button', { name: /select language/i });
    await safeClick(languageButton);
    
    // Wait for dropdown menu to appear
    const dropdown = page.getByRole('listbox');
    await expect(dropdown).toBeVisible();
    
    // Should contain all 11 languages
    const options = page.getByRole('option');
    await expect(options).toHaveCount(11);
  });

  test('should change language and show toast notification', async ({ page }) => {
    // Click the language selector button
    const languageButton = page.getByRole('button', { name: /select language/i });
    await safeClick(languageButton);
    
    // Wait for dropdown to open
    await page.waitForSelector('[role="listbox"]');
    
    // Select Spanish
    await safeClick(page.getByRole('option', { name: /español/i }));
    
    // Check that toast notification appeared
    const toast = page.locator('[role="alert"], [role="status"]').filter({ hasText: /language changed/i });
    await toast.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    await expect(toast).toBeVisible();
    
    // Toast should show the target language
    await expect(toast).toContainText('Español');
    
    // URL should change to Spanish locale
    await expect(page).toHaveURL('/es');
    
    // Wait for toast to disappear (2.5s duration)
    await toast.waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
    await expect(toast).not.toBeVisible();
  });

  test('should translate page content when language changes', async ({ page }) => {
    // Initial page should be in English
    await expect(page).toHaveURL('/en');
    
    // Change to Spanish
    const languageButton = page.getByRole('button', { name: /select language/i });
    await safeClick(languageButton);
    await safeClick(page.getByRole('option', { name: /español/i }));
    
    // Wait for navigation
    await page.waitForURL('/es');
    await waitForFullPageLoad(page);
    
    // Language selector should now show Spanish
    const updatedButton = page.getByRole('button', { name: /select language/i });
    await expect(updatedButton).toContainText('Español');
  });

  test('should not show toast when selecting same language', async ({ page }) => {
    // Click the language selector
    const languageButton = page.getByRole('button', { name: /select language/i });
    await safeClick(languageButton);
    
    // Select English (current language)
    await safeClick(page.getByRole('option', { name: /english/i }));
    
    // Toast should NOT appear (guard clause)
    const toast = page.locator('[role="alert"], [role="status"]');
    await expect(toast).not.toBeVisible();
    
    // URL should remain on English
    await expect(page).toHaveURL('/en');
  });

  test('should work across multiple language switches', async ({ page }) => {
    // English → Spanish
    await safeClick(page.getByRole('button', { name: /select language/i }));
    await safeClick(page.getByRole('option', { name: /español/i }));
    await page.waitForURL('/es');
    
    // Spanish → German
    await safeClick(page.getByRole('button', { name: /select language/i }));
    await safeClick(page.getByRole('option', { name: /deutsch/i }));
    await page.waitForURL('/de');
    
    // German → Japanese
    await safeClick(page.getByRole('button', { name: /select language/i }));
    await safeClick(page.getByRole('option', { name: /日本語/i }));
    await page.waitForURL('/ja');
    
    // Verify final state
    const languageButton = page.getByRole('button', { name: /select language/i });
    await expect(languageButton).toContainText('日本語');
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to the language selector
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs depending on layout
    
    // Press Enter to open dropdown
    await page.keyboard.press('Enter');
    
    // Wait for dropdown
    await page.waitForSelector('[role="listbox"]');
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    
    // Select with Enter
    await page.keyboard.press('Enter');
    
    // Should have navigated to a different language
    await waitForPageReady(page);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/en');
  });

  test('should pass accessibility checks', async ({ page }) => {
    // Inject axe-core
    await injectAxe(page);
    
    // Check accessibility of initial state
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
    
    // Open dropdown
    await safeClick(page.getByRole('button', { name: /select language/i }));
    
    // Check accessibility of open state
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to page
    await page.goto(routes.home());
    await waitForFullPageLoad(page);
    
    // On mobile, language selector is in mobile menu (hidden by default in header)
    // Open mobile menu first
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenuButton).toBeVisible();
    await safeClick(mobileMenuButton);
    
    // Language selector should be visible in mobile menu
    const languageButton = page.getByRole('button', { name: /select language/i });
    await languageButton.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    await expect(languageButton).toBeVisible();
    
    // Should work the same as desktop
    await safeClick(languageButton);
    await safeClick(page.getByRole('option', { name: /español/i }));
    
    // Toast should appear
    const toast = page.locator('[role="alert"], [role="status"]').filter({ hasText: /language changed/i });
    await toast.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    await expect(toast).toBeVisible();
  });
});
