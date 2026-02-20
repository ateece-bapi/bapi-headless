import type { Meta, StoryObj } from '@storybook/nextjs';

/**
 * Accessibility Testing Guide
 *
 * How to use Storybook's a11y addon (@storybook/addon-a11y):
 * 1. Check the "Accessibility" tab below each story
 * 2. Review violations (red), passes (green), incomplete (yellow)
 * 3. Click violations for detailed information and remediation
 * 4. Test keyboard navigation with Tab, Enter, Space, Arrow keys
 * 5. Screen reader testing: Enable VoiceOver (Mac) or NVDA (Windows)
 *
 * WCAG 2.1 Level AA Compliance Goals:
 * - Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
 * - Keyboard accessibility: All interactive elements reachable via Tab
 * - ARIA labels: Proper roles, states, and properties
 * - Focus indicators: Visible focus rings on interactive elements
 * - Form labels: All inputs have associated <label> elements
 */

const meta: Meta = {
  title: 'Tests/AccessibilityGuide',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      // Enable for all stories in this file
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'aria-*',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        component:
          'Accessibility testing guide and examples. Shows how to use @storybook/addon-a11y for WCAG 2.1 Level AA compliance. Demonstrates common accessibility patterns, violations, and remediation strategies for B2B e-commerce.',
      },
    },
  },
};

export default meta;

/**
 * Accessible Button - Good Example
 */
export const AccessibleButton: StoryObj = {
  render: () => (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">✅ Accessible Button</h2>
      <p className="text-neutral-600">Proper button with text label, focus ring, and semantic HTML</p>
      <button
        type="button"
        className="rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
      >
        Add to Cart
      </button>
      <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
        <p className="font-semibold">✅ Passes Accessibility Checks:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Uses semantic <code>&lt;button&gt;</code> element</li>
          <li>Has visible text label</li>
          <li>Focus ring visible (try Tab key)</li>
          <li>Sufficient color contrast (WCAG AA)</li>
          <li>Keyboard accessible (Tab, Enter)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of a fully accessible button. Open Accessibility tab to verify all checks pass (green). Try keyboard navigation with Tab and Enter keys.',
      },
    },
  },
};

/**
 * Inaccessible Button - Bad Example
 */
export const InaccessibleButton: StoryObj = {
  render: () => (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">❌ Inaccessible Button (Bad Example)</h2>
      <p className="text-neutral-600">Common accessibility mistakes to avoid</p>
      <div
        onClick={() => alert('Clicked!')}
        style={{ backgroundColor: '#e0e0e0', color: '#999', padding: '12px 24px', display: 'inline-block', cursor: 'pointer' }}
      >
        Click Here
      </div>
      <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">❌ Accessibility Violations:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Not a semantic button (just a &lt;div&gt;)</li>
          <li>No keyboard accessibility (can't Tab to it)</li>
          <li>Low color contrast (AAA fail)</li>
          <li>No focus indicator</li>
          <li>No ARIA role="button"</li>
        </ul>
        <p className="mt-3 font-semibold">How to fix:</p>
        <ul className="mt-1 list-inside list-disc">
          <li>Use &lt;button&gt; element instead of &lt;div&gt;</li>
          <li>Increase contrast: dark text on light bg</li>
          <li>Add focus:ring-4 for keyboard users</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of common accessibility mistakes. Check Accessibility tab to see violations (red). Notice it cannot be reached via Tab key.',
      },
    },
  },
};

/**
 * Form with Labels - Good Example
 */
export const AccessibleForm: StoryObj = {
  render: () => (
    <div className="max-w-md space-y-6 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">✅ Accessible Form</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email-input" className="mb-2 block text-sm font-semibold text-neutral-700">
            Email Address
          </label>
          <input
            type="email"
            id="email-input"
            name="email"
            className="w-full rounded-lg border-2 border-neutral-300 px-4 py-3 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="quantity-input" className="mb-2 block text-sm font-semibold text-neutral-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity-input"
            name="quantity"
            min="1"
            max="100"
            defaultValue="1"
            className="w-full rounded-lg border-2 border-neutral-300 px-4 py-3 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-2 border-neutral-300 text-primary-500 transition-colors focus:ring-4 focus:ring-primary-500/20"
            />
            <span className="text-sm text-neutral-700">Subscribe to newsletter</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
        >
          Submit Order
        </button>
      </form>

      <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
        <p className="font-semibold">✅ Passes Accessibility Checks:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>All inputs have &lt;label&gt; elements</li>
          <li>Labels use htmlFor to associate with inputs</li>
          <li>Focus rings visible on all interactive elements</li>
          <li>Tab order is logical (top to bottom)</li>
          <li>Checkbox has clickable label text</li>
          <li>Button has descriptive text</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of accessible form. All inputs labeled, keyboard navigable, proper focus indicators. Try Tab to navigate through form fields.',
      },
    },
  },
};

/**
 * Form without Labels - Bad Example
 */
export const InaccessibleForm: StoryObj = {
  render: () => (
    <div className="max-w-md space-y-6 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">❌ Inaccessible Form (Bad Example)</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-full rounded border px-3 py-2"
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Subscribe</span>
        </div>
        <div
          onClick={() => alert('Submitted')}
          className="cursor-pointer bg-blue-400 px-6 py-2 text-center text-white"
        >
          Submit
        </div>
      </form>

      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">❌ Accessibility Violations:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Inputs have no &lt;label&gt; elements</li>
          <li>No visible labels (only placeholders)</li>
          <li>Checkbox label not clickable</li>
          <li>Submit is &lt;div&gt; not &lt;button&gt;</li>
          <li>No focus indicators</li>
          <li>Poor color contrast on blue button</li>
        </ul>
        <p className="mt-3 font-semibold">How to fix:</p>
        <ul className="mt-1 list-inside list-disc">
          <li>Add &lt;label&gt; for each input with htmlFor</li>
          <li>Use &lt;button type="submit"&gt; for submit</li>
          <li>Wrap checkbox in &lt;label&gt; to make text clickable</li>
          <li>Add focus:ring-4 classes</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of common form accessibility mistakes. Check Accessibility tab to see multiple violations. Screen readers cannot identify input purposes.',
      },
    },
  },
};

/**
 * Color Contrast Examples
 */
export const ColorContrastExamples: StoryObj = {
  render: () => (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">Color Contrast Testing</h2>
      <p className="text-neutral-600">WCAG AA requires 4.5:1 for normal text, 3:1 for large text</p>

      <div className="space-y-4">
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-900">✅ Good Contrast (WCAG AA Pass)</h3>
          <p className="mt-2 text-green-900">
            This text has sufficient contrast against the background (ratio: 8.2:1)
          </p>
          <button className="mt-3 rounded bg-green-700 px-4 py-2 text-white">
            Button Text (7.5:1)
          </button>
        </div>

        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
          <h3 className="text-lg font-semibold text-yellow-900">⚠️ Marginal Contrast (AAA Fail, AA Pass)</h3>
          <p className="mt-2 text-yellow-800">
            This text passes WCAG AA (4.6:1) but fails AAA (needs 7:1)
          </p>
          <button className="mt-3 rounded bg-yellow-600 px-4 py-2 text-white">
            Button (4.5:1 - minimum)
          </button>
        </div>

        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-900">❌ Accessibility Violations</h3>
          <p className="mt-2 text-red-300">
            This text has POOR contrast (ratio: 2.1:1 - FAILS WCAG AA)
          </p>
          <button className="mt-3 rounded bg-red-300 px-4 py-2 text-red-100">
            Button (1.8:1 - FAIL)
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
        <p className="font-semibold">🔍 How to Check:</p>
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>Open Accessibility tab below this story</li>
          <li>Look for "color-contrast" violations (red)</li>
          <li>Click violation for ratio and remediation</li>
          <li>Use Chrome DevTools: Inspect → Contrast in color picker</li>
        </ol>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of passing and failing color contrast ratios. Red text in third box should show contrast violation in Accessibility tab.',
      },
    },
  },
};

/**
 * ARIA Labels and Roles
 */
export const ARIAExamples: StoryObj = {
  render: () => (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">ARIA Labels and Roles</h2>
      <p className="text-neutral-600">Proper use of ARIA for accessibility</p>

      <div className="space-y-4">
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-900">✅ Good ARIA Usage</h3>
          <button
            type="button"
            aria-label="Add BA/T10K-O-BB Temperature Sensor to shopping cart"
            className="mt-2 rounded bg-primary-500 px-4 py-2 text-white"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </button>
          <p className="mt-2 text-sm text-green-800">
            Icon-only button with descriptive aria-label. Screen readers announce full context.
          </p>
        </div>

        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-900">✅ Status Announcement</h3>
          <div
            role="status"
            aria-live="polite"
            className="mt-2 rounded bg-green-600 px-4 py-2 text-white"
          >
            ✓ Item added to cart successfully
          </div>
          <p className="mt-2 text-sm text-green-800">
            role="status" and aria-live="polite" announce changes to screen readers.
          </p>
        </div>

        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-900">✅ Loading State</h3>
          <button
            type="button"
            disabled
            aria-busy="true"
            aria-label="Adding item to cart, please wait"
            className="mt-2 flex items-center gap-2 rounded bg-neutral-400 px-4 py-2 text-white"
          >
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </button>
          <p className="mt-2 text-sm text-green-800">
            aria-busy="true" informs screen readers of async operation in progress.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
        <p className="font-semibold">📚 ARIA Best Practices:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Use aria-label for icon-only buttons</li>
          <li>Use aria-live for dynamic content changes</li>
          <li>Use aria-busy for loading states</li>
          <li>Use aria-hidden="true" for decorative icons</li>
          <li>Use role="status" for toast notifications</li>
          <li>Prefer semantic HTML over ARIA when possible</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of proper ARIA usage for screen reader support. Demonstrates aria-label, aria-live, aria-busy, and role attributes.',
      },
    },
  },
};

/**
 * Keyboard Navigation Test
 */
export const KeyboardNavigation: StoryObj = {
  render: () => (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold text-neutral-900">Keyboard Navigation Test</h2>
      <p className="text-neutral-600">Try navigating with keyboard only (no mouse)</p>

      <div className="space-y-4">
        <button className="w-full rounded-lg bg-primary-500 px-6 py-3 text-left text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50">
          Button 1 - Press Tab to reach this
        </button>
        <button className="w-full rounded-lg bg-primary-500 px-6 py-3 text-left text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50">
          Button 2 - Press Tab again
        </button>
        <button className="w-full rounded-lg bg-primary-500 px-6 py-3 text-left text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50">
          Button 3 - One more Tab
        </button>
        <button className="w-full rounded-lg bg-accent-500 px-6 py-3 text-left text-neutral-900 transition-colors hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-accent-500/50">
          Button 4 - Press Enter or Space to activate
        </button>
      </div>

      <div className="mt-6 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
        <p className="font-semibold">⌨️ Keyboard Testing Checklist:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li><kbd className="rounded bg-neutral-200 px-2 py-1">Tab</kbd> - Navigate forward</li>
          <li><kbd className="rounded bg-neutral-200 px-2 py-1">Shift+Tab</kbd> - Navigate backward</li>
          <li><kbd className="rounded bg-neutral-200 px-2 py-1">Enter</kbd> or <kbd className="rounded bg-neutral-200 px-2 py-1">Space</kbd> - Activate buttons</li>
          <li><kbd className="rounded bg-neutral-200 px-2 py-1">Esc</kbd> - Close modals/dropdowns</li>
          <li>Focus rings must be visible (blue glow)</li>
          <li>Tab order should be logical (top to bottom, left to right)</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Test keyboard navigation. Use Tab key to move between buttons. Notice visible focus rings (blue glow). Press Enter or Space to activate.',
      },
    },
  },
};

/**
 * Accessibility Testing Summary
 */
export const AccessibilitySummary: StoryObj = {
  render: () => (
    <div className="max-w-4xl space-y-8 p-8">
      <div>
        <h2 className="mb-3 text-3xl font-bold text-neutral-900">
          Accessibility Testing with Storybook
        </h2>
        <p className="text-lg text-neutral-600">
          Complete guide to WCAG 2.1 Level AA compliance using @storybook/addon-a11y
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
          <h3 className="mb-3 text-xl font-bold text-primary-900">✅ Good Examples</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            <li>• Accessible Button (semantic HTML)</li>
            <li>• Accessible Form (proper labels)</li>
            <li>• Good Color Contrast (4.5:1+)</li>
            <li>• Proper ARIA Labels</li>
            <li>• Keyboard Navigation</li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <h3 className="mb-3 text-xl font-bold text-red-900">❌ Bad Examples</h3>
          <ul className="space-y-2 text-sm text-red-800">
            <li>• Inaccessible Button (&lt;div&gt; clickable)</li>
            <li>• Inaccessible Form (no labels)</li>
            <li>• Poor Color Contrast (&lt;3:1)</li>
            <li>• Missing ARIA attributes</li>
            <li>• No keyboard access</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border-2 border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-neutral-900">How to Use a11y Addon</h3>
        <ol className="space-y-3 text-neutral-700">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              1
            </span>
            <div>
              <p className="font-semibold">Open Accessibility Tab</p>
              <p className="text-sm text-neutral-600">
                Located at bottom of Storybook UI, next to Actions and Controls
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              2
            </span>
            <div>
              <p className="font-semibold">Review Violations</p>
              <p className="text-sm text-neutral-600">
                Red = fail, Yellow = incomplete, Green = pass. Click for details.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              3
            </span>
            <div>
              <p className="font-semibold">Test Keyboard Navigation</p>
              <p className="text-sm text-neutral-600">
                Use Tab, Enter, Space to navigate. Focus rings must be visible.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
              4
            </span>
            <div>
              <p className="font-semibold">Fix Violations</p>
              <p className="text-sm text-neutral-600">
                Follow remediation guidance. Re-check until all tests pass.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="rounded-xl bg-accent-100 p-6">
        <h3 className="mb-3 text-xl font-bold text-neutral-900">📋 WCAG 2.1 Level AA Checklist</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-neutral-900">Perceivable</h4>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>✓ Text alternatives for images</li>
              <li>✓ Color contrast 4.5:1 (text)</li>
              <li>✓ Color contrast 3:1 (large text)</li>
              <li>✓ No info by color alone</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-neutral-900">Operable</h4>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>✓ Keyboard accessible</li>
              <li>✓ Visible focus indicators</li>
              <li>✓ Enough time to read</li>
              <li>✓ No seizure triggers</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-neutral-900">Understandable</h4>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>✓ Readable language</li>
              <li>✓ Predictable functionality</li>
              <li>✓ Input error assistance</li>
              <li>✓ Labels on forms</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-neutral-900">Robust</h4>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>✓ Valid HTML</li>
              <li>✓ ARIA attributes correct</li>
              <li>✓ Status messages</li>
              <li>✓ Screen reader compatible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Complete accessibility testing guide. Shows how to use a11y addon, what to check, and WCAG 2.1 Level AA compliance checklist.',
      },
    },
  },
};
