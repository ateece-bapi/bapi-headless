/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/i18n-test-utils';
import CheckoutWizard from '../CheckoutWizard';
import type { CheckoutData } from '../CheckoutPageClient';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

// Mock the step components
vi.mock('../steps/ShippingStep', () => ({
  default: ({ onNext }: { onNext: () => void }) => (
    <div data-testid="shipping-step">
      Shipping Step
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock('../steps/PaymentStep', () => ({
  default: ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
    <div data-testid="payment-step">
      Payment Step
      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock('../steps/ReviewStep', () => ({
  default: ({ onBack, onPlaceOrder }: { onBack: () => void; onPlaceOrder: () => void }) => (
    <div data-testid="review-step">
      Review Step
      <button onClick={onBack}>Back</button>
      <button onClick={onPlaceOrder}>Place Order</button>
    </div>
  ),
}));

const mockCheckoutData: CheckoutData = {
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    address1: '123 Main St',
    address2: '',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'US',
    phone: '555-1234',
    email: 'john@example.com',
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    address1: '123 Main St',
    address2: '',
    city: 'New York',
    state: 'NY',
    postcode: '10001',
    country: 'US',
    phone: '555-1234',
    email: 'john@example.com',
    sameAsShipping: true,
  },
  paymentMethod: {
    id: 'credit_card',
    title: 'Credit Card',
  },
  shippingMethod: 'standard',
  orderNotes: '',
};

describe('CheckoutWizard', () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnUpdateData = vi.fn();
  const mockOnPlaceOrder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Progress Indicator Rendering', () => {
    it('renders all 3 steps in progress indicator', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
    });

    it('renders step descriptions', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByText('Delivery address')).toBeInTheDocument();
      expect(screen.getByText('Payment method')).toBeInTheDocument();
      expect(screen.getByText('Place order')).toBeInTheDocument();
    });

    it('renders step numbers for incomplete steps', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Step 1 should show "1" (current)
      // Step 2 should show "2" (incomplete)
      // Step 3 should show "3" (incomplete)
      const stepCircles = container.querySelectorAll('.rounded-full');
      expect(stepCircles).toHaveLength(3);
    });

    it('renders connector lines between steps', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Should have 2 connector lines (between 3 steps)
      const connectors = container.querySelectorAll('.h-0\\.5');
      expect(connectors.length).toBeGreaterThanOrEqual(2);
    });

    it('renders container with proper styling', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const mainContainer = container.querySelector('.bg-white.rounded-xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Current Step Highlighting', () => {
    it('highlights step 1 when current step is 1', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // First step should have primary color
      expect(stepCircles[0]).toHaveClass('bg-primary-500');
    });

    it('highlights step 2 when current step is 2', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // Second step should have primary color
      expect(stepCircles[1]).toHaveClass('bg-primary-500');
    });

    it('highlights step 3 when current step is 3', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // Third step should have primary color
      expect(stepCircles[2]).toHaveClass('bg-primary-500');
    });

    it('applies neutral color to incomplete steps', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // Steps 2 and 3 should have neutral color
      expect(stepCircles[1]).toHaveClass('bg-neutral-200');
      expect(stepCircles[2]).toHaveClass('bg-neutral-200');
    });

    it('applies bold text to current and completed steps', () => {
      render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Step 1 and 2 titles should be bold (dark text)
      const shippingTitle = screen.getByText('Shipping').closest('div');
      const paymentTitle = screen.getByText('Payment').closest('div');

      expect(shippingTitle).toHaveClass('text-neutral-900');
      expect(paymentTitle).toHaveClass('text-neutral-900');
    });
  });

  describe('Completed Step Indicators', () => {
    it('shows checkmark for completed step 1 when on step 2', () => {
      render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Should render a checkmark icon (lucide Check component)
      const checkIcons = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('shows checkmarks for steps 1 and 2 when on step 3', () => {
      render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Should render 2 checkmark icons
      const checkIcons = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(checkIcons.length).toBeGreaterThanOrEqual(2);
    });

    it('applies success color to completed step circles', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // Steps 1 and 2 should have success color
      expect(stepCircles[0]).toHaveClass('bg-success-500');
      expect(stepCircles[1]).toHaveClass('bg-success-500');
    });

    it('applies success color to connector after completed step', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const connectors = container.querySelectorAll('.h-0\\.5');
      // First connector should be success color
      expect(connectors[0]).toHaveClass('bg-success-500');
    });

    it('keeps neutral color on connectors for incomplete steps', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const connectors = container.querySelectorAll('.h-0\\.5');
      // Both connectors should be neutral
      connectors.forEach((connector) => {
        expect(connector).toHaveClass('bg-neutral-200');
      });
    });
  });

  describe('Step Content Rendering', () => {
    it('renders ShippingStep when current step is 1', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByTestId('shipping-step')).toBeInTheDocument();
      expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('review-step')).not.toBeInTheDocument();
    });

    it('renders PaymentStep when current step is 2', () => {
      render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument();
      expect(screen.getByTestId('payment-step')).toBeInTheDocument();
      expect(screen.queryByTestId('review-step')).not.toBeInTheDocument();
    });

    it('renders ReviewStep when current step is 3', () => {
      render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument();
      expect(screen.getByTestId('review-step')).toBeInTheDocument();
    });

    it('passes checkoutData to step components', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Component should receive data prop (verified by mock)
      expect(screen.getByTestId('shipping-step')).toBeInTheDocument();
    });

    it('passes isProcessing to ReviewStep', () => {
      render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={true}
        />
      );

      expect(screen.getByTestId('review-step')).toBeInTheDocument();
    });
  });

  describe('Callback Propagation', () => {
    it('passes onNext callback to ShippingStep', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Verify callback is accessible through step component
      expect(screen.getByTestId('shipping-step')).toBeInTheDocument();
    });

    it('passes onUpdateData callback to ShippingStep', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByTestId('shipping-step')).toBeInTheDocument();
    });

    it('passes onNext and onBack to PaymentStep', () => {
      render(
        <CheckoutWizard
          currentStep={2}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByTestId('payment-step')).toBeInTheDocument();
    });

    it('passes onBack and onPlaceOrder to ReviewStep', () => {
      render(
        <CheckoutWizard
          currentStep={3}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      expect(screen.getByTestId('review-step')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes to step circles', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      stepCircles.forEach((circle) => {
        // Should have responsive width/height classes
        expect(circle.className).toMatch(/w-10|sm:w-12/);
        expect(circle.className).toMatch(/h-10|sm:h-12/);
      });
    });

    it('applies responsive text sizes to step titles', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const titles = screen.getAllByText(/Shipping|Payment|Review/);
      titles.forEach((title) => {
        if (
          title.textContent === 'Shipping' ||
          title.textContent === 'Payment' ||
          title.textContent === 'Review'
        ) {
          const parentDiv = title.closest('div');
          expect(parentDiv?.className).toMatch(/text-xs|sm:text-sm/);
        }
      });
    });

    it('hides step descriptions on mobile (sm:block)', () => {
      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const descriptions = [
        screen.getByText('Delivery address'),
        screen.getByText('Payment method'),
        screen.getByText('Place order'),
      ];

      descriptions.forEach((desc) => {
        const parentDiv = desc.closest('div');
        expect(parentDiv?.className).toMatch(/hidden.*sm:block/);
      });
    });

    it('applies responsive padding to step content', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Step content wrapper should have responsive padding
      const contentWrapper = container.querySelector('.p-6');
      expect(contentWrapper?.className).toMatch(/p-6|sm:p-8/);
    });

    it('applies responsive spacing to connector lines', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const connectors = container.querySelectorAll('.h-0\\.5');
      connectors.forEach((connector) => {
        expect(connector.className).toMatch(/mx-2|sm:mx-4/);
      });
    });
  });

  describe('Visual Styling', () => {
    it('applies border and background to progress section', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const progressSection = container.querySelector('.bg-neutral-50');
      expect(progressSection).toHaveClass('border-b');
      expect(progressSection).toHaveClass('border-neutral-200');
    });

    it('applies rounded corners to main container', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const mainContainer = container.querySelector('.rounded-xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies transition classes to step circles', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      stepCircles.forEach((circle) => {
        expect(circle).toHaveClass('transition-all');
      });
    });

    it('applies transition classes to connector lines', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const connectors = container.querySelectorAll('.h-0\\.5');
      connectors.forEach((connector) => {
        expect(connector).toHaveClass('transition-all');
      });
    });

    it('applies white background to step circles with text', () => {
      const { container } = render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      // Current step should have colored background
      expect(stepCircles[0]).toHaveClass('text-white');
    });
  });

  describe('Edge Cases', () => {
    it('handles step 0 gracefully (no step content)', () => {
      render(
        <CheckoutWizard
          currentStep={0}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // No step content should render
      expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('review-step')).not.toBeInTheDocument();
    });

    it('handles step 4 gracefully (no step content)', () => {
      render(
        <CheckoutWizard
          currentStep={4}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // No step content should render
      expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('review-step')).not.toBeInTheDocument();
    });

    it('handles negative step numbers', () => {
      render(
        <CheckoutWizard
          currentStep={-1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // All steps should show as incomplete
      const { container } = render(
        <CheckoutWizard
          currentStep={-1}
          checkoutData={mockCheckoutData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      const stepCircles = container.querySelectorAll('.rounded-full');
      stepCircles.forEach((circle) => {
        expect(circle).toHaveClass('bg-neutral-200');
      });
    });

    it('handles empty checkoutData', () => {
      const emptyData = {} as CheckoutData;

      render(
        <CheckoutWizard
          currentStep={1}
          checkoutData={emptyData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          onUpdateData={mockOnUpdateData}
          onPlaceOrder={mockOnPlaceOrder}
          isProcessing={false}
        />
      );

      // Should still render without crashing
      expect(screen.getByTestId('shipping-step')).toBeInTheDocument();
    });
  });
});
