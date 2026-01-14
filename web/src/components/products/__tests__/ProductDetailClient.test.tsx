import '@testing-library/jest-dom';
import type { ProductForClient, Variation } from '../ProductPage/ProductDetailClient';
import type { useCart as useCartType, useCartDrawer as useCartDrawerType } from '@/store';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDetailClient } from '@/components/products';
import { ToastProvider } from '@/components/ui/Toast';

const baseProduct: ProductForClient = {
  id: 'prod-1',
  databaseId: 1,
  name: 'Test Product',
  slug: 'test-product',
  price: '$9.99',
  stockStatus: 'IN_STOCK',
  image: { sourceUrl: 'https://example.test/img.png', altText: 'Main' },
  gallery: [],
  variations: [
    {
      id: 'var-1',
      databaseId: 101,
      name: 'Variant A',
      price: '$9.99',
      stockStatus: 'IN_STOCK',
      stockQuantity: 10,
      attributes: { Size: 'M', Color: 'Red' },
      image: { sourceUrl: 'https://example.test/var-a.png', altText: 'Variant A' },
    },
    {
      id: 'var-2',
      databaseId: 102,
      name: 'Variant B',
      price: '$10.99',
      stockStatus: 'IN_STOCK',
      stockQuantity: 5,
      attributes: { Size: 'L', Color: 'Blue' },
      image: { sourceUrl: 'https://example.test/var-b.png', altText: 'Variant B' },
    },
    {
      id: 'var-3',
      databaseId: 103,
      name: 'Variant C',
      price: '$9.99',
      stockStatus: 'IN_STOCK',
      stockQuantity: 8,
      attributes: { Size: 'M', Color: 'Blue' },
      image: { sourceUrl: 'https://example.test/var-c.png', altText: 'Variant C' },
    },
    {
      id: 'var-4',
      databaseId: 104,
      name: 'Variant D',
      price: '$10.99',
      stockStatus: 'IN_STOCK',
      stockQuantity: 3,
      attributes: { Size: 'L', Color: 'Red' },
      image: { sourceUrl: 'https://example.test/var-d.png', altText: 'Variant D' },
    },
  ],
  attributes: [
    { name: 'Size', options: ['M', 'L'] },
    { name: 'Color', options: ['Red', 'Blue'] },
  ],
  shortDescription: 'Short desc',
  description: 'Full desc',
};

// Helpers
function renderProductDetail(
  product = baseProduct,
  opts: { useCart?: typeof useCartType; useCartDrawer?: typeof useCartDrawerType } = {}
) {
  const { useCart, useCartDrawer } = opts;
  return render(
    <ToastProvider>
      <ProductDetailClient
        product={product}
        useCart={useCart}
        useCartDrawer={useCartDrawer}
      />
    </ToastProvider>
  );
}

/**
 * Helper to select attributes with the new ProductVariationSelector (button-based UI)
 * ProductVariationSelector uses buttons with aria-label="Select AttributeName: Value"
 */
function selectAttributes({ size, color }: { size?: string; color?: string }) {
  if (size) {
    const sizeButton = screen.getByRole('button', { name: new RegExp(`Select Size: ${size}`, 'i') });
    fireEvent.click(sizeButton);
  }
  if (color) {
    const colorButton = screen.getByRole('button', { name: new RegExp(`Select Color: ${color}`, 'i') });
    fireEvent.click(colorButton);
  }
}

describe('ProductDetailClient', () => {
  describe('Attribute selection', () => {
    it('renders selectors and updates selection', () => {
      renderProductDetail();
      // ProductVariationSelector uses <label> elements with attribute names
      expect(screen.getByText(/Size/i)).toBeInTheDocument();
      expect(screen.getByText(/Color/i)).toBeInTheDocument();

      // Check initial selected buttons (M and Red are first options, selected by default)
      expect(screen.getByRole('button', { name: /Select Size: M/i })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: /Select Color: Red/i })).toHaveAttribute('aria-pressed', 'true');

      // Select different options
      selectAttributes({ size: 'L' });
      expect(screen.getByRole('button', { name: /Select Size: L/i })).toHaveAttribute('aria-pressed', 'true');

      selectAttributes({ color: 'Blue' });
      expect(screen.getByRole('button', { name: /Select Color: Blue/i })).toHaveAttribute('aria-pressed', 'true');
    });
    it('matches correct variation and prefers variation image', async () => {
      renderProductDetail();
      expect(screen.getByAltText('Variant A')).toBeInTheDocument();

      selectAttributes({ size: 'L', color: 'Blue' });
      await waitFor(() => {
        expect(screen.getByAltText('Variant B')).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('disables Add to Cart when out of stock', () => {
      const outOfStockProduct = { ...baseProduct, stockStatus: 'OUT_OF_STOCK' };
      renderProductDetail(outOfStockProduct);
      const addToCartBtn = screen.getByRole('button', { name: /out of stock/i });
      expect(addToCartBtn).toBeDisabled();
    });

    it('renders gracefully with no variations', () => {
      const noVarProduct = { ...baseProduct, variations: [] };
      renderProductDetail(noVarProduct);
      // Should not throw, and selectors should NOT render
      expect(screen.queryByLabelText(/Size/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Color/i)).not.toBeInTheDocument();
    });

    it('shows fallback UI for invalid attribute selection', () => {
      // Set all variation images to null to force fallback
      const productWithNoVarImages = {
        ...baseProduct,
        variations: (baseProduct.variations ?? []).map((v: Variation) => ({ ...v, image: null })),
      };
      renderProductDetail(productWithNoVarImages);
      // Select an invalid combination that does not match any variation
      selectAttributes({ size: 'M', color: 'Blue' }); // No such variation in baseProduct
      // Should show the product image (alt text 'Main' in baseProduct)
      expect(screen.getByAltText('Main')).toBeInTheDocument();
    });
  });

  describe('Cart interaction', () => {
    it('adds correct variation to cart on Add to Cart', async () => {
      const addItemMock = vi.fn();
      const openCartMock = vi.fn();
      const mockUseCart = () => ({
        items: [],
        addItem: addItemMock,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        totalItems: 0,
        subtotal: 0,
        isEmpty: false,
      });
      const mockUseCartDrawer = () => ({
        isOpen: false,
        toggleCart: vi.fn(),
        openCart: openCartMock,
        closeCart: vi.fn(),
      });
      renderProductDetail(baseProduct, {
        useCart: mockUseCart,
        useCartDrawer: mockUseCartDrawer,
      });
      selectAttributes({ size: 'L', color: 'Blue' });
      fireEvent.click(screen.getByRole('button', { name: /Add.*to cart/i }));
      
      // Wait for async operation in AddToCartButton (300ms delay + processing)
      await waitFor(() => {
        expect(addItemMock).toHaveBeenCalled();
      });
      
      const callArgs = addItemMock.mock.calls[0][0];
      expect(callArgs.variationId).toBe(102);
      expect(callArgs.variationName).toBe('Variant B');
    });
  });
});

describe('Keyboard navigation and robustness', () => {
  it('allows tabbing to all interactive elements', async () => {
    renderProductDetail();
    const userTabOrder = [
      screen.getByRole('button', { name: /Select Size: M/i }),
      screen.getByRole('button', { name: /Select Color: Red/i }),
      screen.getByRole('button', { name: /Add.*to cart/i }),
    ];
    userTabOrder.forEach((el) => {
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });

  it('does not crash with minimal/malformed product data', () => {
    const minimalProduct: ProductForClient = {
      id: 'x',
      databaseId: 1,
      name: '',
      slug: '',
      price: '',
      stockStatus: '',
      image: null,
      gallery: [],
      variations: [],
      attributes: [],
      shortDescription: '',
      description: '',
    };
    expect(() => renderProductDetail(minimalProduct)).not.toThrow();
  });
});

describe('Error states and UI feedback', () => {
  it('renders fallback UI when image is missing', () => {
    const noImageProduct: ProductForClient = { ...baseProduct, image: null, variations: [] };
    renderProductDetail(noImageProduct);
    expect(screen.getByText(/No image/i)).toBeInTheDocument();
  });

  it('renders gracefully when price is missing', () => {
    const noPriceProduct = { ...baseProduct, price: '' };
    renderProductDetail(noPriceProduct);
    // Should not throw, and price area should be empty
    const priceEl = screen.getByText((content, node) => !!node && node.tagName === 'P' && node.className.includes('text-primary-500'));
    expect(priceEl).toBeInTheDocument();
    expect(priceEl).toHaveTextContent('');
  });

  it('shows fallback description if missing', () => {
    const noDescProduct: ProductForClient = { ...baseProduct, description: '' };
    renderProductDetail(noDescProduct);
    expect(screen.getByText(/No description/i)).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  it('all selectors have associated labels', () => {
    renderProductDetail();
    // ProductVariationSelector uses <label> elements for attributes
    // Check that attribute names are present as labels
    (baseProduct.attributes ?? []).forEach((attr: { name: string }) => {
      expect(screen.getByText(attr.name)).toBeInTheDocument();
    });
    // Also check that buttons have proper aria-label
    expect(screen.getByRole('button', { name: /Select Size: M/i })).toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: /Select Color: Red/i })).toHaveAttribute('aria-label');
  });

  it('Add to Cart button is accessible', () => {
    renderProductDetail();
    const btn = screen.getByRole('button', { name: /Add.*to cart/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName(/Add.*to cart/i);
  });

  it('images have meaningful alt text', async () => {
    renderProductDetail();
    // Default image is the first variation's image
    expect(screen.getByAltText('Variant A')).toBeInTheDocument();
    // Variant image after selection
    selectAttributes({ size: 'L', color: 'Blue' });
    await waitFor(() => {
      expect(screen.getByAltText('Variant B')).toBeInTheDocument();
    });
  });
});
