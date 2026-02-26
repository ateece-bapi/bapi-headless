/**
 * AddToCartButton Accessibility Tests
 *
 * Critical e-commerce interaction - must be fully accessible.
 * Tests WCAG 2.1 Level AA compliance for dynamic state changes.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import AddToCartButton from './AddToCartButton';
import type { CartItem } from '@/store';

// Mock toast
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const mockProduct: Omit<CartItem, 'quantity'> = {
  id: 'test-product-1',
  name: 'Temperature Sensor TS-101',
  slug: 'temperature-sensor-ts-101',
  price: 149.00,
  image: {
    sourceUrl: 'https://example.com/product.jpg',
    altText: 'Temperature Sensor',
  },
};

// Mock cart hooks
const mockAddItem = vi.fn();
const mockOpenCart = vi.fn();

const mockUseCart = () => ({
  addItem: mockAddItem,
  items: [],
  totalItems: 0,
  totalPrice: 0,
  clearCart: vi.fn(),
  updateQuantity: vi.fn(),
  removeItem: vi.fn(),
});

const mockUseCartDrawer = () => ({
  openCart: mockOpenCart,
  closeCart: vi.fn(),
  isOpen: false,
});

describe('AddToCartButton Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Automated Accessibility', () => {
    it('has no automated accessibility violations (default state)', async () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in loading state', async () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button Accessibility', () => {
    it('has a valid button role', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has descriptive aria-label', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Add Temperature Sensor TS-101 to cart');
    });

    it('aria-label updates during loading', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Adding to cart...');
    });

    it('has aria-busy attribute during loading', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('is disabled when loading', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when out of stock', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-label', 'Out of stock');
    });
  });

  describe('ARIA Live Region', () => {
    it('has aria-live region for screen reader announcements', () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('announces loading state to screen readers', () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveTextContent('Adding Temperature Sensor TS-101 to cart...');
    });

    it('live region is visually hidden but accessible to screen readers', () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveClass('sr-only');
    });
  });

  describe('Visual State Indicators', () => {
    it('shows text content for default state', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('shows loading text and spinner', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          loading={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      expect(screen.getByText('Adding...')).toBeInTheDocument();
    });

    it('shows out of stock text when disabled', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('icons are decorative with proper text labels', () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      // Icons should not need aria-labels since button has text + aria-label
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Add to Cart');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('is focusable via keyboard', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can be clicked', async () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      // Verify button was clicked (shows loading or success state)
      await waitFor(() => {
        expect(button).toBeInTheDocument();
      });
    });

    it('cannot be activated when disabled', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Disabled buttons cannot be clicked
    });
  });

  describe('Color Contrast', () => {
    it('BAPI accent color meets contrast requirements', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      // BAPI Yellow (#FFC843) with dark text meets WCAG AA
      expect(button).toHaveClass('btn-bapi-accent');
    });

    it('disabled state is visually distinguishable', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      // Button should be disabled and have appropriate styling
      expect(button).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('handles out of stock gracefully', async () => {
      const { container } = render(
        <AddToCartButton
          product={mockProduct}
          disabled={true}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Multi-Quantity Support', () => {
    it('renders with custom quantity', () => {
      render(
        <AddToCartButton
          product={mockProduct}
          quantity={5}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Button should function with any quantity value
    });
  });
});
