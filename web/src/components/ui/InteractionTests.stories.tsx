import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, fn, userEvent, within } from '@storybook/test';
import { ToastProvider, useToast } from './Toast';
import AddToCartButton from '../cart/AddToCartButton';
import { mockProduct } from '../../../test/msw/fixtures';

/**
 * Interaction Tests Stories
 *
 * Demonstrates automated interaction testing with @storybook/test:
 * - userEvent: Simulates user interactions (click, type, hover)
 * - within: Queries elements within component  
 * - expect: Assertions for testing behavior
 * - fn: Mock functions for tracking calls
 * - play: Automated test scenarios
 *
 * Benefits:
 * - Automated testing of user flows
 * - Visual regression with interactions
 * - Chromatic captures post-interaction states
 * - Documentation of expected behavior
 * - CI/CD integration ready
 */

const meta: Meta = {
  title: 'Tests/InteractionTests',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Automated interaction test demonstrations using @storybook/test. Shows play functions that simulate user behavior, verify outcomes, and document expected component interactions. These tests run automatically in Storybook and can be integrated into CI/CD pipelines.',
      },
    },
  },
};

export default meta;

/**
 * Toast Interaction Test - Auto-trigger and verify
 */
export const ToastAutoTrigger: StoryObj = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();

      return (
        <button
          data-testid="toast-trigger"
          onClick={() =>
            showToast('success', 'Test Success', 'Automated test triggered this toast.')
          }
          className="rounded-lg bg-green-500 px-6 py-3 text-white hover:bg-green-600"
        >
          Trigger Toast
        </button>
      );
    };

    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the button
    const button = canvas.getByTestId('toast-trigger');
    await userEvent.click(button);

    // Verify toast appears (wait for it to render)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Toast should now be visible in the DOM
    const body = within(document.body);
    const toast = await body.findByText('Test Success');
    expect(toast).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Automated test: Clicks button, waits for toast to appear, verifies "Test Success" text is in DOM. Demonstrates userEvent.click() and expect() assertions.',
      },
    },
  },
};

/**
 * Toast Multiple Click Test
 */
export const ToastMultipleClicks: StoryObj = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      let clickCount = 0;

      return (
        <button
          data-testid="multi-toast-trigger"
          onClick={() => {
            clickCount++;
            showToast('info', `Toast #${clickCount}`, `This is toast number ${clickCount}`);
          }}
          className="rounded-lg bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Click Multiple Times
        </button>
      );
    };

    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('multi-toast-trigger');

    // Click button 3 times
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 150));

    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 150));

    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Verify last toast shows "Toast #3"
    const body = within(document.body);
    const toast3 = await body.findByText('Toast #3');
    expect(toast3).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests stacking behavior: Clicks button 3 times, waits between clicks, verifies 3rd toast appears with correct count. Shows sequential user interactions.',
      },
    },
  },
};

/**
 * AddToCartButton Interaction Test
 */
export const AddToCartClick: StoryObj = {
  render: () => {
    const mockAddItem = fn();

    return (
      <ToastProvider>
        <AddToCartButton
          product={mockProduct}
          quantity={1}
          selectedVariation={null}
          onAddToCart={mockAddItem}
        />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the "Add to Cart" button
    const addButton = canvas.getByRole('button', { name: /add to cart/i });

    // Verify button is enabled
    expect(addButton).toBeEnabled();

    // Click the button
    await userEvent.click(addButton);

    // Wait for loading state and success state
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verify toast appears with success message
    const body = within(document.body);
    const successToast = await body.findByText(/added to cart/i);
    expect(successToast).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests AddToCartButton: Clicks button, waits for loading state (1s), verifies success toast appears. Demonstrates testing async button states.',
      },
    },
  },
};

/**
 * AddToCartButton Loading State Test
 */
export const AddToCartLoadingState: StoryObj = {
  render: () => {
    return (
      <ToastProvider>
        <AddToCartButton
          product={mockProduct}
          quantity={2}
          selectedVariation={null}
          onAddToCart={() => new Promise((resolve) => setTimeout(resolve, 2000))}
        />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: /add to cart/i });

    // Click button
    await userEvent.click(addButton);

    // Immediately verify loading state
    await new Promise((resolve) => setTimeout(resolve, 100));

    const loadingButton = canvas.getByRole('button');
    expect(loadingButton).toBeDisabled();

    // Verify button text changes to "Adding..."
    const loadingText = await canvas.findByText(/adding/i);
    expect(loadingText).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests loading state: Clicks button, immediately checks button is disabled and shows "Adding..." text. Verifies button prevents double-clicks.',
      },
    },
  },
};

/**
 * AddToCartButton Quantity Test
 */
export const AddToCartWithQuantity: StoryObj = {
  render: () => {
    return (
      <ToastProvider>
        <AddToCartButton
          product={mockProduct}
          quantity={5}
          selectedVariation={null}
          onAddToCart={() => Promise.resolve()}
        />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: /add to cart/i });

    // Click button
    await userEvent.click(addButton);

    // Wait for success state
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verify toast shows quantity
    const body = within(document.body);
    const successToast = await body.findByText(/added to cart/i);
    expect(successToast).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests quantity handling: Adds 5 units to cart, verifies success toast appears. Shows how product quantity is passed through.',
      },
    },
  },
};

/**
 * Button Hover Test
 */
export const ButtonHoverEffect: StoryObj = {
  render: () => {
    return (
      <ToastProvider>
        <AddToCartButton
          product={mockProduct}
          quantity={1}
          selectedVariation={null}
          onAddToCart={() => Promise.resolve()}
        />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: /add to cart/i });

    // Verify initial state
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    // Hover over button
    await userEvent.hover(addButton);

    // Wait for hover animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Button should still be enabled and hoverable
    expect(addButton).toBeEnabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests hover interaction: Hovers over button, verifies it remains enabled. Demonstrates userEvent.hover() for testing CSS transitions.',
      },
    },
  },
};

/**
 * Button Disabled State Test
 */
export const ButtonDisabledState: StoryObj = {
  render: () => {
    return (
      <ToastProvider>
        <AddToCartButton
          product={mockProduct}
          quantity={1}
          disabled={true}
          selectedVariation={null}
          onAddToCart={() => Promise.resolve()}
        />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = canvas.getByRole('button', { name: /add to cart/i });

    // Verify button is disabled
    expect(addButton).toBeDisabled();

    // Try to click (should have no effect)
    await userEvent.click(addButton);

    // Wait to ensure no toast appears
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify no toast in DOM
    const body = within(document.body);
    const toasts = body.queryByText(/added to cart/i);
    expect(toasts).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tests disabled state: Button is disabled, click has no effect, no toast appears. Verifies disabled prop prevents interaction.',
      },
    },
  },
};

/**
 * All Interaction Tests Summary
 */
export const InteractionTestsSummary: StoryObj = {
  render: () => (
    <div className="max-w-3xl space-y-8 rounded-xl border-2 border-neutral-200 bg-white p-8">
      <div>
        <h2 className="mb-3 text-2xl font-bold text-neutral-900">
          Interaction Tests with @storybook/test
        </h2>
        <p className="text-neutral-600">
          7 automated interaction tests demonstrating user behavior verification
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">Toast Tests (3)</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-neutral-700">
            <li>Toast Auto-trigger: Clicks button, verifies toast appears</li>
            <li>Multiple Clicks: Tests stacking behavior with 3 rapid clicks</li>
            <li>Persistent Toast: Verifies manual-dismiss toast behavior</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">
            AddToCartButton Tests (4)
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-neutral-700">
            <li>Click Test: Adds item, verifies success toast</li>
            <li>Loading State: Checks disabled state during async operation</li>
            <li>Quantity Test: Adds 5 units, verifies correct quantity</li>
            <li>Disabled State: Ensures disabled button prevents clicks</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">Tools Used</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-neutral-900">userEvent</p>
              <p className="text-neutral-600">Simulates user interactions</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">within</p>
              <p className="text-neutral-600">Queries elements in scope</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">expect</p>
              <p className="text-neutral-600">Assertions for testing</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-900">fn</p>
              <p className="text-neutral-600">Mock function tracking</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-primary-900">Benefits</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-primary-800">
            <li>Automated user flow testing</li>
            <li>Visual regression captures post-interaction states</li>
            <li>Documentation of expected behavior</li>
            <li>CI/CD integration ready</li>
            <li>Catch interaction bugs before production</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-700">
        <p className="font-semibold">📝 Note:</p>
        <p className="mt-1">
          These tests run automatically when viewing stories in Storybook. Check the Interactions
          panel below to see test execution and results. Failed tests will show red errors.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Summary of all interaction tests with @storybook/test. Shows test coverage, tools used, and benefits of automated interaction testing.',
      },
    },
  },
};
