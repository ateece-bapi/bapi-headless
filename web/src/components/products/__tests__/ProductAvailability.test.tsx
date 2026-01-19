import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductAvailability from '../ProductAvailability';

describe('ProductAvailability Component', () => {
  describe('In Stock Status', () => {
    it('renders in stock badge', () => {
      render(<ProductAvailability stockStatus="instock" />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('shows ready to ship message', () => {
      render(<ProductAvailability stockStatus="instock" />);
      expect(screen.getByText('Ready to ship')).toBeInTheDocument();
    });

    it('displays success icon for in stock', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const icon = container.querySelector('.lucide-circle-check-big');
      expect(icon).toBeInTheDocument();
    });

    it('shows quantity when available and detailed', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={50} detailed={true} />);
      expect(screen.getByText('50 available')).toBeInTheDocument();
    });

    it('shows ready to ship when quantity high but not detailed', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={50} detailed={false} />);
      expect(screen.getByText('Ready to ship')).toBeInTheDocument();
    });

    it('applies success styling colors', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.bg-success-50');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Low Stock Warning', () => {
    it('shows low stock warning when quantity is 10 or less', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={10} />);
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
    });

    it('shows exact quantity remaining for low stock', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={5} />);
      expect(screen.getByText('Only 5 left in stock')).toBeInTheDocument();
    });

    it('displays warning icon for low stock', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" stockQuantity={3} />);
      // AlertCircle is used for low stock warnings
      const icon = container.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('applies warning styling colors', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" stockQuantity={8} />);
      const badge = container.querySelector('.bg-warning-50');
      expect(badge).toBeInTheDocument();
    });

    it('triggers low stock at exactly 10 items', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={10} />);
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
      expect(screen.getByText('Only 10 left in stock')).toBeInTheDocument();
    });

    it('does not trigger low stock at 11 items', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={11} detailed={true} />);
      expect(screen.queryByText('Low Stock')).not.toBeInTheDocument();
      expect(screen.getByText('11 available')).toBeInTheDocument();
    });

    it('shows low stock for 1 item remaining', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={1} />);
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
      expect(screen.getByText('Only 1 left in stock')).toBeInTheDocument();
    });
  });

  describe('Out of Stock Status', () => {
    it('renders out of stock badge', () => {
      render(<ProductAvailability stockStatus="outofstock" />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('shows currently unavailable message', () => {
      render(<ProductAvailability stockStatus="outofstock" />);
      expect(screen.getByText('Currently unavailable')).toBeInTheDocument();
    });

    it('displays error icon for out of stock', () => {
      const { container } = render(<ProductAvailability stockStatus="outofstock" />);
      const icon = container.querySelector('.lucide-circle-x');
      expect(icon).toBeInTheDocument();
    });

    it('shows restock date when provided', () => {
      render(<ProductAvailability stockStatus="outofstock" restockDate="2025-02-15" />);
      expect(screen.getByText(/Expected back:/)).toBeInTheDocument();
    });

    it('formats restock date correctly', () => {
      render(<ProductAvailability stockStatus="outofstock" restockDate="2025-02-15" />);
      const dateText = screen.getByText(/Expected back:/);
      expect(dateText.textContent).toMatch(/Expected back: \d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('applies error styling colors', () => {
      const { container } = render(<ProductAvailability stockStatus="outofstock" />);
      const badge = container.querySelector('.bg-error-50');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('On Backorder Status', () => {
    it('renders on backorder badge', () => {
      render(<ProductAvailability stockStatus="onbackorder" />);
      expect(screen.getByText('On Backorder')).toBeInTheDocument();
    });

    it('shows available for pre-order message', () => {
      render(<ProductAvailability stockStatus="onbackorder" />);
      expect(screen.getByText('Available for pre-order')).toBeInTheDocument();
    });

    it('displays clock icon for backorder', () => {
      const { container } = render(<ProductAvailability stockStatus="onbackorder" />);
      const icon = container.querySelector('.lucide-clock');
      expect(icon).toBeInTheDocument();
    });

    it('shows ship date when provided', () => {
      render(<ProductAvailability stockStatus="onbackorder" restockDate="2025-03-20" />);
      expect(screen.getByText(/Ships on:/)).toBeInTheDocument();
    });

    it('formats ship date correctly', () => {
      render(<ProductAvailability stockStatus="onbackorder" restockDate="2025-03-20" />);
      const dateText = screen.getByText(/Ships on:/);
      expect(dateText.textContent).toMatch(/Ships on: \d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('applies info styling colors', () => {
      const { container } = render(<ProductAvailability stockStatus="onbackorder" />);
      const badge = container.querySelector('.bg-info-50');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Unknown/Null Status', () => {
    it('renders check availability message for null status', () => {
      render(<ProductAvailability stockStatus={null} />);
      expect(screen.getByText('Check Availability')).toBeInTheDocument();
    });

    it('shows contact us message', () => {
      render(<ProductAvailability stockStatus={null} />);
      expect(screen.getByText('Contact us for availability')).toBeInTheDocument();
    });

    it('displays alert icon for unknown status', () => {
      const { container } = render(<ProductAvailability stockStatus={null} />);
      // AlertCircle is used for unknown status
      const icon = container.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('applies neutral styling colors', () => {
      const { container } = render(<ProductAvailability stockStatus={null} />);
      const badge = container.querySelector('.bg-neutral-50');
      expect(badge).toBeInTheDocument();
    });

    it('defaults to in stock when stockStatus is undefined', () => {
      render(<ProductAvailability />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });
  });

  describe('Detailed Mode', () => {
    it('shows quantity in detailed mode when stock is high', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={100} detailed={true} />);
      expect(screen.getByText('100 available')).toBeInTheDocument();
    });

    it('hides quantity in non-detailed mode when stock is high', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={100} detailed={false} />);
      expect(screen.queryByText('100 available')).not.toBeInTheDocument();
      expect(screen.getByText('Ready to ship')).toBeInTheDocument();
    });

    it('shows low stock message in both detailed and non-detailed modes', () => {
      const { rerender } = render(
        <ProductAvailability stockStatus="instock" stockQuantity={5} detailed={true} />
      );
      expect(screen.getByText('Only 5 left in stock')).toBeInTheDocument();

      rerender(<ProductAvailability stockStatus="instock" stockQuantity={5} detailed={false} />);
      expect(screen.getByText('Only 5 left in stock')).toBeInTheDocument();
    });
  });

  describe('Stock Quantity Edge Cases', () => {
    it('handles null stock quantity', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={null} />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('Ready to ship')).toBeInTheDocument();
    });

    it('handles undefined stock quantity', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={undefined} />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('handles zero stock quantity', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={0} />);
      // Zero stock quantity still shows in stock (not low stock) based on component logic
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('Ready to ship')).toBeInTheDocument();
    });

    it('handles very large stock quantity', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={9999} detailed={true} />);
      expect(screen.getByText('9999 available')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('marks icon as decorative with aria-hidden', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const icon = container.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('uses semantic text elements', () => {
      render(<ProductAvailability stockStatus="instock" />);
      const spans = screen.getAllByText(/In Stock|Ready to ship/);
      spans.forEach((span) => {
        expect(span.tagName).toBe('SPAN');
      });
    });

    it('applies proper color contrast classes', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const textElement = screen.getByText('In Stock');
      expect(textElement.className).toContain('text-success-700');
    });
  });

  describe('Visual Styling', () => {
    it('applies border styling', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.border-2');
      expect(badge).toBeInTheDocument();
    });

    it('applies rounded corners', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.rounded-lg');
      expect(badge).toBeInTheDocument();
    });

    it('uses flex layout with gap', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.inline-flex.items-center.gap-2');
      expect(badge).toBeInTheDocument();
    });

    it('applies padding', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.px-4.py-2');
      expect(badge).toBeInTheDocument();
    });

    it('includes transition classes', () => {
      const { container } = render(<ProductAvailability stockStatus="instock" />);
      const badge = container.querySelector('.transition-all');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('displays all elements together correctly', () => {
      render(<ProductAvailability stockStatus="instock" stockQuantity={25} detailed={true} />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('25 available')).toBeInTheDocument();
    });

    it('updates display when props change', () => {
      const { rerender } = render(<ProductAvailability stockStatus="instock" stockQuantity={50} />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();

      rerender(<ProductAvailability stockStatus="outofstock" stockQuantity={0} />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('handles all status transitions', () => {
      const { rerender } = render(<ProductAvailability stockStatus="instock" />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();

      rerender(<ProductAvailability stockStatus="onbackorder" />);
      expect(screen.getByText('On Backorder')).toBeInTheDocument();

      rerender(<ProductAvailability stockStatus="outofstock" />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
  });
});
