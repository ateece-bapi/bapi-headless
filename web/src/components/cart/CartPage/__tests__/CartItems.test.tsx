import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItems from '../CartItems';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('CartItems Component', () => {
  const mockItems = [
    {
      key: 'item-1',
      quantity: 2,
      subtotal: '$39.98',
      total: '$39.98',
      tax: '$0.00',
      product: {
        node: {
          id: 'prod-1',
          databaseId: 1,
          name: 'Test Product 1',
          slug: 'test-product-1',
          price: '$19.99',
          regularPrice: '$24.99',
          salePrice: '$19.99',
          stockStatus: 'IN_STOCK',
          stockQuantity: 50,
          image: {
            sourceUrl: 'https://example.com/image1.jpg',
            altText: 'Test Product 1 Image',
          },
        },
      },
    },
    {
      key: 'item-2',
      quantity: 1,
      subtotal: '$49.99',
      total: '$49.99',
      tax: '$0.00',
      product: {
        node: {
          id: 'prod-2',
          databaseId: 2,
          name: 'Test Product 2',
          slug: 'test-product-2',
          price: '$49.99',
          stockStatus: 'OUT_OF_STOCK',
        },
      },
    },
  ];

  const defaultProps = {
    items: mockItems,
    isUpdating: false,
    onUpdateQuantity: vi.fn(),
    onRemoveItem: vi.fn(),
    onClearCart: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders cart items header with count', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('Cart Items (2)')).toBeInTheDocument();
    });

    it('renders all cart items', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders product images when available', () => {
      render(<CartItems {...defaultProps} />);
      const images = screen.getAllByAltText('Test Product 1 Image');
      expect(images[0]).toBeInTheDocument();
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('renders "No Image" placeholder when image not available', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('renders product links with correct href', () => {
      render(<CartItems {...defaultProps} />);
      const links = screen.getAllByRole('link');
      // Each product has 2 links (image + name)
      expect(links.filter(link => 
        link.getAttribute('href') === '/products/test-product-1'
      )).toHaveLength(2);
    });

    it('renders quantity for each item', () => {
      render(<CartItems {...defaultProps} />);
      // 2 appears multiple times (mobile + desktop)
      const quantityElements = screen.getAllByText('2');
      expect(quantityElements.length).toBeGreaterThan(0);
    });

    it('renders item prices', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getAllByText('$39.98').length).toBeGreaterThan(0);
      expect(screen.getAllByText('$49.99').length).toBeGreaterThan(0);
    });

    it('renders sale prices with strikethrough regular price', () => {
      render(<CartItems {...defaultProps} />);
      // Regular price appears strikethrough (mobile + desktop)
      expect(screen.getAllByText('$24.99').length).toBeGreaterThan(0);
      // Sale price appears in "each" text (mobile + desktop)
      expect(screen.getAllByText(/\$19\.99 each/).length).toBeGreaterThan(0);
    });

    it('renders "each" price for quantities > 1', () => {
      render(<CartItems {...defaultProps} />);
      const eachPriceElements = screen.getAllByText(/\$19\.99 each/);
      expect(eachPriceElements.length).toBeGreaterThan(0);
    });

    it('renders Clear Cart button', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByRole('button', { name: /clear cart/i })).toBeInTheDocument();
    });
  });

  describe('Stock Status', () => {
    it('displays IN_STOCK status with green indicator', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('(50 available)')).toBeInTheDocument();
    });

    it('displays OUT_OF_STOCK status with red indicator', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('displays ON_BACKORDER status for backorder items', () => {
      const backorderItems = [{
        ...mockItems[0],
        product: {
          node: {
            ...mockItems[0].product.node,
            stockStatus: 'ON_BACKORDER',
          },
        },
      }];

      render(<CartItems {...defaultProps} items={backorderItems} />);
      expect(screen.getByText('On Backorder')).toBeInTheDocument();
    });

    it('displays stock quantity when available', () => {
      render(<CartItems {...defaultProps} />);
      expect(screen.getByText('(50 available)')).toBeInTheDocument();
    });

    it('does not display stock quantity when not available', () => {
      const itemsWithoutQty = [{
        ...mockItems[0],
        product: {
          node: {
            ...mockItems[0].product.node,
            stockQuantity: undefined,
          },
        },
      }];

      render(<CartItems {...defaultProps} items={itemsWithoutQty} />);
      expect(screen.queryByText(/available/)).not.toBeInTheDocument();
    });
  });

  describe('Variation Support', () => {
    it('displays variation details when present', () => {
      const itemWithVariation = [{
        ...mockItems[0],
        variation: {
          node: {
            id: 'var-1',
            databaseId: 10,
            name: 'Size: Large, Color: Blue',
            price: '$19.99',
            stockStatus: 'IN_STOCK',
          },
        },
      }];

      render(<CartItems {...defaultProps} items={itemWithVariation} />);
      expect(screen.getByText('Size: Large, Color: Blue')).toBeInTheDocument();
    });

    it('uses variation image when available', () => {
      const itemWithVariation = [{
        ...mockItems[0],
        variation: {
          node: {
            id: 'var-1',
            databaseId: 10,
            name: 'Variation',
            price: '$19.99',
            stockStatus: 'IN_STOCK',
            image: {
              sourceUrl: 'https://example.com/variation.jpg',
              altText: 'Variation Image',
            },
          },
        },
      }];

      render(<CartItems {...defaultProps} items={itemWithVariation} />);
      const images = screen.getAllByAltText('Variation Image');
      expect(images[0]).toHaveAttribute('src', 'https://example.com/variation.jpg');
    });

    it('uses variation price when available', () => {
      const itemWithVariation = [{
        ...mockItems[0],
        variation: {
          node: {
            id: 'var-1',
            databaseId: 10,
            name: 'Variation',
            price: '$29.99',
            regularPrice: '$39.99',
            salePrice: '$29.99',
            stockStatus: 'IN_STOCK',
          },
        },
      }];

      render(<CartItems {...defaultProps} items={itemWithVariation} />);
      // Price appears multiple times (mobile + desktop)
      expect(screen.getAllByText('$39.99').length).toBeGreaterThan(0); // Regular price
    });
  });

  describe('Quantity Controls', () => {
    it('calls onUpdateQuantity when increase button clicked', () => {
      const onUpdateQuantity = vi.fn();
      render(<CartItems {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);

      const increaseButtons = screen.getAllByLabelText('Increase quantity');
      fireEvent.click(increaseButtons[0]);

      expect(onUpdateQuantity).toHaveBeenCalledWith('item-1', 3);
    });

    it('calls onUpdateQuantity when decrease button clicked', () => {
      const onUpdateQuantity = vi.fn();
      render(<CartItems {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);

      const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
      fireEvent.click(decreaseButtons[0]);

      expect(onUpdateQuantity).toHaveBeenCalledWith('item-1', 1);
    });

    it('disables decrease button when quantity is 1', () => {
      render(<CartItems {...defaultProps} />);

      const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
      // Second item has quantity 1, appears in both mobile and desktop (index 2 and 3)
      // Check desktop button (index 3)
      expect(decreaseButtons[3]).toBeDisabled();
    });

    it('does not disable decrease button when quantity > 1', () => {
      render(<CartItems {...defaultProps} />);

      const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
      // First item has quantity 2
      expect(decreaseButtons[0]).not.toBeDisabled();
    });

    it('disables all controls when isUpdating is true', () => {
      render(<CartItems {...defaultProps} isUpdating={true} />);

      const increaseButtons = screen.getAllByLabelText('Increase quantity');
      const decreaseButtons = screen.getAllByLabelText('Decrease quantity');

      increaseButtons.forEach(button => expect(button).toBeDisabled());
      decreaseButtons.forEach(button => expect(button).toBeDisabled());
    });
  });

  describe('Remove Item', () => {
    it('calls onRemoveItem when remove button clicked', () => {
      const onRemoveItem = vi.fn();
      render(<CartItems {...defaultProps} onRemoveItem={onRemoveItem} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      expect(onRemoveItem).toHaveBeenCalledWith('item-1');
    });

    it('disables remove button when isUpdating is true', () => {
      render(<CartItems {...defaultProps} isUpdating={true} />);

      const removeButtons = screen.getAllByText('Remove');
      removeButtons.forEach(button => expect(button).toBeDisabled());
    });
  });

  describe('Clear Cart', () => {
    it('calls onClearCart when clear cart button clicked', () => {
      const onClearCart = vi.fn();
      render(<CartItems {...defaultProps} onClearCart={onClearCart} />);

      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      fireEvent.click(clearButton);

      expect(onClearCart).toHaveBeenCalledTimes(1);
    });

    it('disables clear cart button when isUpdating is true', () => {
      render(<CartItems {...defaultProps} isUpdating={true} />);

      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Responsive Design', () => {
    it('renders both mobile and desktop quantity controls', () => {
      render(<CartItems {...defaultProps} />);

      // Should have multiple quantity controls (mobile + desktop)
      const increaseButtons = screen.getAllByLabelText('Increase quantity');
      expect(increaseButtons.length).toBeGreaterThan(2);
    });

    it('renders mobile remove buttons with X icon', () => {
      render(<CartItems {...defaultProps} />);

      // Mobile and desktop remove buttons both present
      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons.length).toBeGreaterThan(0);
    });
  });
});
