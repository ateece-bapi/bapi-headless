import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartSummary from '../CartSummary';

// Mock Next.js navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Toast provider
const mockShowToast = vi.fn();
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe('CartSummary Component', () => {
  const mockCart = {
    subtotal: '$99.98',
    total: '$99.98',
    contentsTax: '$0.00',
    shippingTotal: '$0.00',
    shippingTax: '$0.00',
    totalTax: '$0.00',
    discountTotal: '$0.00',
    discountTax: '$0.00',
  };

  const defaultProps = {
    cart: mockCart,
    onApplyCoupon: vi.fn(),
    isUpdating: false,
  };

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders order summary header', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    it('renders coupon code input field', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByLabelText(/have a coupon code/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter code')).toBeInTheDocument();
    });

    it('renders apply coupon button', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
    });

    it('renders subtotal', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getAllByText(/\$99\.98/).length).toBeGreaterThan(0);
    });

    it('renders shipping label', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getAllByText('Calculated at checkout').length).toBeGreaterThan(0);
    });

    it('renders tax label', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Tax')).toBeInTheDocument();
    });

    it('renders total', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Total')).toBeInTheDocument();
      const totalElements = screen.getAllByText('$99.98');
      expect(totalElements.length).toBeGreaterThan(0);
    });

    it('renders proceed to checkout button', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
    });

    it('renders security badges', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
      expect(screen.getByText('256-bit SSL encrypted')).toBeInTheDocument();
    });

    it('renders shipping info', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.getByText(/free shipping on orders over \$500/i)).toBeInTheDocument();
      expect(screen.getByText(/standard shipping: 3-5 business days/i)).toBeInTheDocument();
    });
  });

  describe('Price Calculations', () => {
    it('displays correct subtotal', () => {
      render(<CartSummary {...defaultProps} cart={{ ...mockCart, subtotal: '$149.99' }} />);
      expect(screen.getByText('$149.99')).toBeInTheDocument();
    });

    it('displays discount when applied', () => {
      const cartWithDiscount = {
        ...mockCart,
        discountTotal: '$15.00',
        total: '$84.98',
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithDiscount} />);
      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('-$15.00')).toBeInTheDocument();
    });

    it('does not display discount when zero', () => {
      render(<CartSummary {...defaultProps} />);
      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('displays shipping cost when available', () => {
      const cartWithShipping = {
        ...mockCart,
        shippingTotal: '$12.50',
        total: '$112.48',
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithShipping} />);
      expect(screen.getByText('$12.50')).toBeInTheDocument();
    });

    it('displays tax when available', () => {
      const cartWithTax = {
        ...mockCart,
        totalTax: '$8.50',
        total: '$108.48',
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithTax} />);
      expect(screen.getByText('$8.50')).toBeInTheDocument();
    });

    it('calculates correct total with all fees', () => {
      const fullCart = {
        subtotal: '$100.00',
        total: '$103.50',
        contentsTax: '$5.00',
        shippingTotal: '$10.00',
        shippingTax: '$0.50',
        totalTax: '$5.50',
        discountTotal: '$15.00',
        discountTax: '$0.00',
      };
      
      render(<CartSummary {...defaultProps} cart={fullCart} />);
      expect(screen.getByText('$103.50')).toBeInTheDocument();
    });
  });

  describe('Coupon Application', () => {
    it('allows entering coupon code', () => {
      render(<CartSummary {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter code');
      
      fireEvent.change(input, { target: { value: 'SAVE20' } });
      expect(input).toHaveValue('SAVE20');
    });

    it('disables apply button when code is empty', () => {
      render(<CartSummary {...defaultProps} />);
      const applyButton = screen.getByRole('button', { name: /apply/i });
      expect(applyButton).toBeDisabled();
    });

    it('enables apply button when code is entered', () => {
      render(<CartSummary {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter code');
      const applyButton = screen.getByRole('button', { name: /apply/i });
      
      fireEvent.change(input, { target: { value: 'SAVE20' } });
      expect(applyButton).not.toBeDisabled();
    });

    it('shows warning when applying empty code', async () => {
      render(<CartSummary {...defaultProps} />);
      const form = screen.getByRole('button', { name: /apply/i }).closest('form');
      
      fireEvent.submit(form!);
      
      expect(mockShowToast).toHaveBeenCalledWith('warning', 'Enter Code', 'Please enter a coupon code');
    });

    it('applies coupon successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CartSummary {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter code');
      const applyButton = screen.getByRole('button', { name: /apply/i });
      
      fireEvent.change(input, { target: { value: 'SAVE20' } });
      fireEvent.click(applyButton);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'success',
          'Coupon Applied',
          'Coupon "SAVE20" applied successfully'
        );
      });
      
      expect(defaultProps.onApplyCoupon).toHaveBeenCalled();
    });

    it('handles coupon application error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid coupon code' }),
      });

      render(<CartSummary {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter code');
      const applyButton = screen.getByRole('button', { name: /apply/i });
      
      fireEvent.change(input, { target: { value: 'INVALID' } });
      fireEvent.click(applyButton);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'error',
          expect.any(String),
          expect.any(String)
        );
      });
    });

    it('clears input after successful application', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CartSummary {...defaultProps} />);
      const input = screen.getByPlaceholderText('Enter code') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'SAVE20' } });
      fireEvent.submit(input.closest('form')!);
      
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Applied Coupons', () => {
    it('displays applied coupons', () => {
      const cartWithCoupons = {
        ...mockCart,
        appliedCoupons: [
          { code: 'SAVE20', discountAmount: '$20.00' },
        ],
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithCoupons} />);
      expect(screen.getByText('Applied Coupons:')).toBeInTheDocument();
      expect(screen.getByText('SAVE20')).toBeInTheDocument();
      expect(screen.getByText('-$20.00')).toBeInTheDocument();
    });

    it('displays multiple applied coupons', () => {
      const cartWithCoupons = {
        ...mockCart,
        appliedCoupons: [
          { code: 'SAVE20', discountAmount: '$20.00' },
          { code: 'EXTRA10', discountAmount: '$10.00' },
        ],
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithCoupons} />);
      expect(screen.getByText('SAVE20')).toBeInTheDocument();
      expect(screen.getByText('EXTRA10')).toBeInTheDocument();
    });

    it('allows removing applied coupon', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const cartWithCoupons = {
        ...mockCart,
        appliedCoupons: [
          { code: 'SAVE20', discountAmount: '$20.00' },
        ],
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithCoupons} />);
      const removeButton = screen.getByLabelText('Remove coupon');
      
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          'success',
          'Coupon Removed',
          'Coupon "SAVE20" removed'
        );
      });
      
      expect(defaultProps.onApplyCoupon).toHaveBeenCalled();
    });
  });

  describe('Checkout Navigation', () => {
    it('navigates to checkout when button clicked', () => {
      render(<CartSummary {...defaultProps} />);
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      
      fireEvent.click(checkoutButton);
      
      expect(mockPush).toHaveBeenCalledWith('/checkout');
    });

    it('disables checkout button when updating', () => {
      render(<CartSummary {...defaultProps} isUpdating={true} />);
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      
      expect(checkoutButton).toBeDisabled();
    });
  });

  describe('Disabled States', () => {
    it('disables coupon input when updating', () => {
      render(<CartSummary {...defaultProps} isUpdating={true} />);
      const input = screen.getByPlaceholderText('Enter code');
      
      expect(input).toBeDisabled();
    });

    it('disables apply button when updating', () => {
      render(<CartSummary {...defaultProps} isUpdating={true} />);
      const applyButton = screen.getByRole('button', { name: /apply/i });
      
      expect(applyButton).toBeDisabled();
    });

    it('disables remove coupon button when updating', () => {
      const cartWithCoupons = {
        ...mockCart,
        appliedCoupons: [
          { code: 'SAVE20', discountAmount: '$20.00' },
        ],
      };
      
      render(<CartSummary {...defaultProps} cart={cartWithCoupons} isUpdating={true} />);
      const removeButton = screen.getByLabelText('Remove coupon');
      
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Sticky Positioning', () => {
    it('applies sticky positioning class', () => {
      const { container } = render(<CartSummary {...defaultProps} />);
      const summaryCard = container.querySelector('.sticky');
      
      expect(summaryCard).toBeTruthy();
      expect(summaryCard?.className).toContain('top-4');
    });
  });
});
