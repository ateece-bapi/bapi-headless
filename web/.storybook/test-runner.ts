import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

/**
 * Storybook Test Runner Configuration
 * 
 * Runs automated accessibility tests on all stories using axe-core.
 * This catches ~40-50% of WCAG 2.1 Level AA violations automatically.
 * 
 * Usage:
 * - Development: pnpm run test:storybook (requires Storybook running)
 * - CI/CD: pnpm run test:storybook:ci (builds and serves Storybook first)
 */
const config: TestRunnerConfig = {
  // Run axe accessibility tests on every story
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    // Get story context for better error messages
    const storyId = context.id;
    const storyTitle = context.title;
    const storyName = context.name;

    // Run accessibility checks
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      // WCAG 2.1 Level AA compliance (industry standard for e-commerce)
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        // Configure rules
        rules: {
          // Critical rules - fail the test
          'aria-roles': { enabled: true },
          'button-name': { enabled: true },
          'color-contrast': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'image-alt': { enabled: true },
          'input-button-name': { enabled: true },
          'label': { enabled: true },
          'link-name': { enabled: true },

          // Known issues - temporarily warn only (fix these!)
          // TODO: Remove these waivers as issues are fixed
          'region': { enabled: false }, // Layout stories don't always have regions
        },
      },
    });

    // Get violations for logging
    const violations = await getViolations(page);

    if (violations.length > 0) {
      console.error(
        `\n❌ Accessibility violations found in story: ${storyTitle} / ${storyName}`
      );
      console.error(`Story ID: ${storyId}\n`);

      violations.forEach((violation) => {
        console.error(`\n🔴 ${violation.id}: ${violation.description}`);
        console.error(`   Impact: ${violation.impact}`);
        console.error(`   WCAG: ${violation.tags.filter((t) => t.startsWith('wcag')).join(', ')}`);
        console.error(`   Help: ${violation.helpUrl}`);
        console.error(`   Affected elements: ${violation.nodes.length}`);
        violation.nodes.forEach((node) => {
          console.error(`     - ${node.html}`);
        });
      });
    }

    // Critical violations fail the test
    const criticalViolations = violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      throw new Error(
        `Found ${criticalViolations.length} critical accessibility violations in ${storyTitle} / ${storyName}`
      );
    }
  },

  // Tags to filter stories in test runs
  tags: {
    // Skip specific stories that are intentionally inaccessible (e.g., bad examples)
    skip: ['skip-a11y', 'test-only'],
  },
};

export default config;
