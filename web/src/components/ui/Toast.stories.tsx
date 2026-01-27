import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';

/**
 * Toast Notification System
 * 
 * User feedback system for success, error, warning, and info messages.
 * Auto-dismisses after customizable duration. Features:
 * - 4 toast types with semantic colors
 * - Auto-dismiss with configurable duration
 * - Manual close button
 * - Stacks multiple toasts vertically
 * - Accessible with ARIA labels
 * - Slide-in animation
 */

const meta = {
  title: 'UI/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive demo component for triggering toasts
 */
function ToastDemo() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold mb-4">Click to trigger toasts:</h2>
      
      <button
        onClick={() => showToast('success', 'Success!', 'Your action completed successfully.', 5000)}
        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <span>Show Success Toast</span>
      </button>

      <button
        onClick={() => showToast('error', 'Error Occurred', 'Something went wrong. Please try again.', 6000)}
        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <span>Show Error Toast</span>
      </button>

      <button
        onClick={() => showToast('warning', 'Warning', 'This action cannot be undone.', 5000)}
        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        <span>Show Warning Toast</span>
      </button>

      <button
        onClick={() => showToast('info', 'Information', 'Here is some helpful information for you.', 4000)}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <span>Show Info Toast</span>
      </button>

      <button
        onClick={() => {
          showToast('success', 'First Toast', 'This is the first toast.', 10000);
          setTimeout(() => showToast('info', 'Second Toast', 'This is the second toast.', 10000), 200);
          setTimeout(() => showToast('warning', 'Third Toast', 'This is the third toast.', 10000), 400);
        }}
        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        Show Multiple Toasts (Stacking Test)
      </button>

      <button
        onClick={() => showToast('success', 'No Auto-Dismiss', 'This toast will not auto-dismiss.', 0)}
        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Show Persistent Toast (duration=0)
      </button>
    </div>
  );
}

/**
 * Interactive toast demonstration
 * 
 * Click buttons to trigger different toast types and test functionality.
 */
export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

/**
 * Success toast (5s auto-dismiss)
 */
export const Success: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast('success', 'Product Added', 'BA/10K-3-O-12 added to cart successfully.', 5000)}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Trigger Success Toast
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

/**
 * Error toast (6s auto-dismiss)
 */
export const Error: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast('error', 'Connection Failed', 'Unable to reach server. Check your internet connection.', 6000)}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Trigger Error Toast
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

/**
 * Warning toast (5s auto-dismiss)
 */
export const Warning: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast('warning', 'Low Stock', 'Only 3 units remaining for this product.', 5000)}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Trigger Warning Toast
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

/**
 * Info toast (4s auto-dismiss)
 */
export const InfoToast: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast('info', 'New Update Available', 'Version 2.0 is now available. Click to learn more.', 4000)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Trigger Info Toast
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

/**
 * Long message toast (tests text wrapping)
 */
export const LongMessage: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast(
            'info',
            'System Maintenance Scheduled',
            'Our systems will undergo scheduled maintenance on Saturday, February 1st from 2:00 AM to 6:00 AM EST. During this time, some features may be unavailable. We apologize for any inconvenience.',
            8000
          )}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Trigger Long Message Toast
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};

/**
 * Persistent toast (no auto-dismiss, must close manually)
 */
export const Persistent: Story = {
  render: () => {
    const Demo = () => {
      const { showToast } = useToast();
      
      return (
        <button
          onClick={() => showToast('warning', 'Important Notice', 'This notification requires manual dismissal.', 0)}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Trigger Persistent Toast (duration=0)
        </button>
      );
    };
    
    return (
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
  },
};
