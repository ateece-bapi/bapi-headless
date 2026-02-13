/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/i18n-test-utils';
import CheckoutSummary from '../CheckoutSummary';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

const mockCartWithItems = {
  subtotal: '$100.00',
  tax: '$8.00',
  totalTax: '$8.00',
  shipping: '$10.00',
  shippingTotal: '$10.00',
  discountTotal: '$0.00',
  total: '$118.00',
  contents: {
    itemCount: 2,
    nodes: [
      {
        key: 'item-1',
        quantity: 1,
        total: '$50.00',
        product: {
          node: {
            name: 'Test Product 1',
            image: {
              sourceUrl: '/test-image-1.jpg',
              altText: 'Test Product 1 Image',
            },
          },
        },
        variation: null,
      },
      {
        key: 'item-2',
        quantity: 2,
        total: '$100.00',
        product: {
          node: {
            name: 'Test Product 2',
            image: {
              sourceUrl: '/test-image-2.jpg',
              altText: 'Test Product 2 Image',
            },
          },
        },
        variation: null,
      },
    ],
  },
};

describe('CheckoutSummary', () => {
  describe('Component Rendering', () => {
    it('renders null when cart is not provided', () => {
      const { container } = render(<CheckoutSummary cart={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders null when cart is undefined', () => {
      const { container } = render(<CheckoutSummary cart={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders summary component with cart data', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    it('renders header with shopping cart icon', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      // Icon is rendered (lucide ShoppingCart)
      const icons = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('renders sticky container with proper classes', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const stickyContainer = container.querySelector('.sticky');
      expect(stickyContainer).toBeInTheDocument();
      expect(stickyContainer).toHaveClass('top-4');
    });
  });

  describe('Cart Items Display', () => {
    it('displays correct item count', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);
      expect(screen.getByText('Items (2)')).toBeInTheDocument();
    });

    it('displays item count as 0 when no items', () => {
      const emptyCart = {
        ...mockCartWithItems,
        contents: { itemCount: 0, nodes: [] },
      };
      render(<CheckoutSummary cart={emptyCart} />);
      expect(screen.getByText('Items (0)')).toBeInTheDocument();
    });

    it('renders all cart items', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('displays product images', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('alt', 'Test Product 1 Image');
      expect(images[1]).toHaveAttribute('alt', 'Test Product 2 Image');
    });

    it('displays fallback when image is missing', () => {
      const cartWithoutImages = {
        ...mockCartWithItems,
        contents: {
          itemCount: 1,
          nodes: [
            {
              key: 'item-3',
              quantity: 1,
              total: '$30.00',
              product: {
                node: {
                  name: 'Product Without Image',
                  image: null,
                },
              },
              variation: null,
            },
          ],
        },
      };

      render(<CheckoutSummary cart={cartWithoutImages} />);
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('displays product quantities', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Qty: 1')).toBeInTheDocument();
      expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    });

    it('displays item totals', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      // Prices appear in item list
      expect(screen.getByText('$50.00')).toBeInTheDocument();
      // $100.00 appears twice (item total + subtotal), use getAllByText
      const hundredDollar = screen.getAllByText(/\$100\.00/);
      expect(hundredDollar.length).toBeGreaterThan(0);
    });

    it('handles variation products', () => {
      const cartWithVariation = {
        ...mockCartWithItems,
        contents: {
          itemCount: 1,
          nodes: [
            {
              key: 'var-item',
              quantity: 1,
              total: '$75.00',
              product: {
                node: {
                  name: 'Variable Product',
                  image: null,
                },
              },
              variation: {
                node: {
                  name: 'Size: Large, Color: Blue',
                  image: {
                    sourceUrl: '/variation-image.jpg',
                    altText: 'Variation Image',
                  },
                },
              },
            },
          ],
        },
      };

      render(<CheckoutSummary cart={cartWithVariation} />);
      expect(screen.getByText('Variable Product')).toBeInTheDocument();
      expect(screen.getByText('Size: Large, Color: Blue')).toBeInTheDocument();
    });

    it('uses variation image when available', () => {
      const cartWithVariation = {
        ...mockCartWithItems,
        contents: {
          itemCount: 1,
          nodes: [
            {
              key: 'var-item',
              quantity: 1,
              total: '$75.00',
              product: {
                node: {
                  name: 'Variable Product',
                  image: {
                    sourceUrl: '/product-image.jpg',
                    altText: 'Product Image',
                  },
                },
              },
              variation: {
                node: {
                  name: 'Variation',
                  image: {
                    sourceUrl: '/variation-image.jpg',
                    altText: 'Variation Image',
                  },
                },
              },
            },
          ],
        },
      };

      render(<CheckoutSummary cart={cartWithVariation} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Variation Image');
    });

    it('applies scrollable container for many items', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const scrollContainer = container.querySelector('.max-h-64.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('Edit Cart Link', () => {
    it('renders edit cart link', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      const editLink = screen.getByText('← Edit Cart');
      expect(editLink).toBeInTheDocument();
      expect(editLink.closest('a')).toHaveAttribute('href', '/cart');
    });

    it('applies proper styling to edit link', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      const editLink = screen.getByText('← Edit Cart');
      expect(editLink).toHaveClass('text-primary-500');
      expect(editLink).toHaveClass('hover:text-primary-600');
    });
  });

  describe('Price Calculations', () => {
    it('displays subtotal correctly', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      // $100.00 appears twice (item + subtotal)
      const subtotalValue = screen.getAllByText(/\$100\.00/);
      expect(subtotalValue.length).toBeGreaterThanOrEqual(1);
    });

    it('displays shipping cost', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('$10.00')).toBeInTheDocument();
    });

    it('displays tax amount', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Tax')).toBeInTheDocument();
      expect(screen.getByText('$8.00')).toBeInTheDocument();
    });

    it('displays total correctly', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      // Total is $118.00 and appears multiple times (in items and total)
      const totalElements = screen.getAllByText('$118.00');
      expect(totalElements.length).toBeGreaterThan(0);
    });

    it('shows discount when applicable', () => {
      const cartWithDiscount = {
        ...mockCartWithItems,
        discountTotal: '$20.00',
      };

      render(<CheckoutSummary cart={cartWithDiscount} />);
      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('-$20.00')).toBeInTheDocument();
    });

    it('hides discount when zero', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);
      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('displays placeholder when shipping is zero', () => {
      const cartNoShipping = {
        ...mockCartWithItems,
        shipping: '$0.00',
      };

      render(<CheckoutSummary cart={cartNoShipping} />);
      expect(screen.getByText('Calculated at checkout')).toBeInTheDocument();
    });

    it('displays placeholder when tax is zero', () => {
      const cartNoTax = {
        ...mockCartWithItems,
        tax: '$0.00',
        totalTax: '$0.00',
      };

      render(<CheckoutSummary cart={cartNoTax} />);
      // Two instances: shipping and tax
      const placeholders = screen.getAllByText('Calculated at checkout');
      expect(placeholders.length).toBeGreaterThanOrEqual(1);
    });

    it('handles missing tax field (uses totalTax)', () => {
      const cartWithTotalTax = {
        ...mockCartWithItems,
        tax: undefined,
        totalTax: '$15.00',
      };

      render(<CheckoutSummary cart={cartWithTotalTax} />);
      expect(screen.getByText('$15.00')).toBeInTheDocument();
    });

    it('handles missing shipping field (uses shippingTotal)', () => {
      const cartWithShippingTotal = {
        ...mockCartWithItems,
        shipping: undefined,
        shippingTotal: '$25.00',
      };

      render(<CheckoutSummary cart={cartWithShippingTotal} />);
      expect(screen.getByText('$25.00')).toBeInTheDocument();
    });

    it('parses prices with currency symbols', () => {
      const cartWithSymbols = {
        ...mockCartWithItems,
        subtotal: '$99.99',
        total: '$117.99',
      };

      render(<CheckoutSummary cart={cartWithSymbols} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('handles prices without decimals', () => {
      const cartWithoutDecimals = {
        ...mockCartWithItems,
        subtotal: '$100',
        total: '$120',
      };

      render(<CheckoutSummary cart={cartWithoutDecimals} />);
      // $100.00 formatted from $100 (appears in item + subtotal)
      const formattedPrice = screen.getAllByText(/\$100\.00/);
      expect(formattedPrice.length).toBeGreaterThan(0);
    });

    it('formats decimal prices correctly', () => {
      const cartWithDecimals = {
        ...mockCartWithItems,
        subtotal: '$99.50',
        total: '$117.50',
      };

      render(<CheckoutSummary cart={cartWithDecimals} />);
      expect(screen.getByText('$99.50')).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('applies rounded corners to container', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const mainContainer = container.querySelector('.rounded-xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('applies border to container', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const borderedContainer = container.querySelector('.border-neutral-200');
      expect(borderedContainer).toBeInTheDocument();
    });

    it('applies background to header', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const header = container.querySelector('.bg-neutral-50');
      expect(header).toBeInTheDocument();
    });

    it('applies divider between sections', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const dividers = container.querySelectorAll('.border-t');
      expect(dividers.length).toBeGreaterThan(0);
    });

    it('applies font weight to total', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      const totalLabel = screen.getByText('Total');
      const totalParent = totalLabel.closest('div');
      expect(totalParent).toHaveClass('font-bold');
    });

    it('applies success color to discount', () => {
      const cartWithDiscount = {
        ...mockCartWithItems,
        discountTotal: '$10.00',
      };

      const { container } = render(<CheckoutSummary cart={cartWithDiscount} />);
      const discountElement = container.querySelector('.text-success-600');
      expect(discountElement).toBeInTheDocument();
    });
  });

  describe('Security Badge', () => {
    it('renders security badge', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);
      expect(screen.getByText('Secure Checkout')).toBeInTheDocument();
    });

    it('displays lock icon in security badge', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('applies border above security badge', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      // Security badge section has border-t
      const securitySection = screen.getByText('Secure Checkout').closest('div')?.parentElement;
      expect(securitySection).toHaveClass('border-t');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty cart contents', () => {
      const emptyCart = {
        subtotal: '$0.00',
        tax: '$0.00',
        shipping: '$0.00',
        total: '$0.00',
        contents: {
          itemCount: 0,
          nodes: [],
        },
      };

      render(<CheckoutSummary cart={emptyCart} />);
      expect(screen.getByText('Items (0)')).toBeInTheDocument();
      // $0.00 appears twice (subtotal and total)
      const zeroElements = screen.getAllByText(/\$0\.00/);
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('handles missing contents field', () => {
      const cartNoContents = {
        subtotal: '$100.00',
        total: '$100.00',
        contents: null,
      };

      render(<CheckoutSummary cart={cartNoContents} />);
      expect(screen.getByText('Items (0)')).toBeInTheDocument();
    });

    it('handles malformed price strings', () => {
      const cartBadPrices = {
        ...mockCartWithItems,
        subtotal: 'invalid',
        total: 'not-a-price',
      };

      render(<CheckoutSummary cart={cartBadPrices} />);
      // Should fallback to 0.00 (appears multiple times)
      const zeroElements = screen.getAllByText(/\$0\.00/);
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('handles undefined price strings', () => {
      const cartUndefinedPrices = {
        ...mockCartWithItems,
        subtotal: undefined,
        tax: undefined,
        shipping: undefined,
        total: undefined,
      };

      render(<CheckoutSummary cart={cartUndefinedPrices} />);
      // $0.00 appears multiple times (subtotal and total)
      const zeroElements = screen.getAllByText(/\$0\.00/);
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it('handles negative prices (refunds)', () => {
      const cartWithRefund = {
        ...mockCartWithItems,
        subtotal: '-$50.00',
        total: '-$50.00',
      };

      render(<CheckoutSummary cart={cartWithRefund} />);
      // parsePrice should handle negative values (formatted as $-50.00)
      // Appears twice (subtotal and total)
      const negativePrice = screen.getAllByText(/\$-50\.00/);
      expect(negativePrice.length).toBeGreaterThan(0);
    });

    it('handles very large prices', () => {
      const cartLargePrices = {
        ...mockCartWithItems,
        subtotal: '$99999.99',
        total: '$99999.99',
      };

      render(<CheckoutSummary cart={cartLargePrices} />);
      // Large price appears multiple times (subtotal and total)
      const largePrice = screen.getAllByText(/\$99999\.99/);
      expect(largePrice.length).toBeGreaterThan(0);
    });

    it('handles product without name', () => {
      const cartNoName = {
        ...mockCartWithItems,
        contents: {
          itemCount: 1,
          nodes: [
            {
              key: 'no-name',
              quantity: 1,
              total: '$10.00',
              product: {
                node: {
                  name: '',
                  image: null,
                },
              },
              variation: null,
            },
          ],
        },
      };

      const { container } = render(<CheckoutSummary cart={cartNoName} />);
      // Should render without crashing
      expect(container.querySelector('.line-clamp-2')).toBeInTheDocument();
    });

    it('truncates long product names', () => {
      const cartLongName = {
        ...mockCartWithItems,
        contents: {
          itemCount: 1,
          nodes: [
            {
              key: 'long-name',
              quantity: 1,
              total: '$25.00',
              product: {
                node: {
                  name: 'This is a very long product name that should be truncated to fit properly in the layout without breaking anything',
                  image: null,
                },
              },
              variation: null,
            },
          ],
        },
      };

      const { container } = render(<CheckoutSummary cart={cartLongName} />);
      const nameElement = container.querySelector('.line-clamp-2');
      expect(nameElement).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders images for cart items', () => {
      render(<CheckoutSummary cart={mockCartWithItems} />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBe(2);
      // Next.js Image component handles sizing via CSS, not attributes
      expect(images[0]).toHaveAttribute('alt', 'Test Product 1 Image');
    });

    it('applies flex layout to cart items', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const itemContainers = container.querySelectorAll('.flex.gap-3');
      expect(itemContainers.length).toBeGreaterThan(0);
    });

    it('applies proper spacing between sections', () => {
      const { container } = render(<CheckoutSummary cart={mockCartWithItems} />);

      const spacedSections = container.querySelectorAll('.space-y-6, .space-y-4, .space-y-3');
      expect(spacedSections.length).toBeGreaterThan(0);
    });
  });
});
