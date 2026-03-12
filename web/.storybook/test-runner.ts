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

    // Document-level rules disabled for component stories (industry best practice)
    // Components are tested in isolation, not as complete documents.
    // These rules are for full pages, not component libraries.
    // See: Material-UI, Ant Design, Radix UI test configurations
    const disabledRules = [
      'landmark-one-main', // Components don't need <main> landmark
      'page-has-heading-one', // Components don't need <h1> heading
      'region', // Layout stories don't always have regions
    ];

    // Run accessibility checks with disabled rules
    await checkA11y(
      page,
      '#storybook-root',
      {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
        rules: disabledRules.reduce((acc, rule) => {
          acc[rule] = { enabled: false };
          return acc;
        }, {} as Record<string, { enabled: boolean }>),
      },
      true // skipFailures - we'll handle violations manually to filter disabled rules
    );

    // Get violations for logging (filtered to exclude disabled rules)
    const allViolations = await getViolations(page);
    const violations = allViolations.filter(
      (v) => !disabledRules.includes(v.id)
    );

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
        console.error(`   Affected elements: ${violation.nodes.length}\n`);
        
        violation.nodes.forEach((node, index) => {
          console.error(`   [${index + 1}] Target: ${node.target.join(', ')}`);
          console.error(`       HTML: ${node.html.substring(0, 200)}${node.html.length > 200 ? '...' : ''}`);
          
          // Show additional context for color-contrast violations
          if (violation.id === 'color-contrast' && node.any && node.any[0]) {
            const contrastData = node.any[0].data;
            if (contrastData) {
              console.error(`       Foreground: ${contrastData.fgColor || 'N/A'}`);
              console.error(`       Background: ${contrastData.bgColor || 'N/A'}`);
              console.error(`       Contrast Ratio: ${contrastData.contrastRatio || 'N/A'}`);
              console.error(`       Expected: ${contrastData.expectedContrastRatio || 'N/A'}`);
            }
          }
          console.error('');
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
