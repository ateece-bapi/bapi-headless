import '@testing-library/jest-dom';
import type { ProductForClient, Variation } from '../ProductPage/ProductDetailClient';
import type { useCart as useCartType, useCartDrawer as useCartDrawerType } from '@/store';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
      attributes: { Size: 'M', Color: 'Red' },
      image: { sourceUrl: 'https://example.test/var-a.png', altText: 'Variant A' },
    },
    {
      id: 'var-2',
      databaseId: 102,
      name: 'Variant B',
      price: '$10.99',
      attributes: { Size: 'L', Color: 'Blue' },
      image: { sourceUrl: 'https://example.test/var-b.png', altText: 'Variant B' },
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

function selectAttributes({ size, color }: { size?: string; color?: string }) {
  if (size) fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: size } });
  if (color) fireEvent.change(screen.getByLabelText(/Color/i), { target: { value: color } });
}

describe('ProductDetailClient', () => {
  describe('Attribute selection', () => {
    it('renders selectors and updates selection', () => {
      renderProductDetail();
      expect(screen.getByLabelText(/Size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();

      expect(screen.getByDisplayValue('M')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Red')).toBeInTheDocument();

      selectAttributes({ size: 'L' });
      expect(screen.getByDisplayValue('L')).toBeInTheDocument();

      selectAttributes({ color: 'Blue' });
      expect(screen.getByDisplayValue('Blue')).toBeInTheDocument();
    });
    it('matches correct variation and prefers variation image', () => {
      renderProductDetail();
      expect(screen.getByAltText('Variant A')).toBeInTheDocument();

      selectAttributes({ size: 'L', color: 'Blue' });
      expect(screen.getByAltText('Variant B')).toBeInTheDocument();
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
    it('adds correct variation to cart on Add to Cart', () => {
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
      expect(addItemMock).toHaveBeenCalled();
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
      screen.getByLabelText(/Size/i),
      screen.getByLabelText(/Color/i),
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
    // Each attribute should have a label and a select
    (baseProduct.attributes ?? []).forEach((attr: { name: string }) => {
      const label = screen.getByLabelText(attr.name);
      expect(label).toBeInTheDocument();
    });
  });

  it('Add to Cart button is accessible', () => {
    renderProductDetail();
    const btn = screen.getByRole('button', { name: /Add.*to cart/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAccessibleName(/Add.*to cart/i);
  });

  it('images have meaningful alt text', () => {
    renderProductDetail();
    // Default image is the first variation's image
    expect(screen.getByAltText('Variant A')).toBeInTheDocument();
    // Variant image after selection
    selectAttributes({ size: 'L', color: 'Blue' });
    expect(screen.getByAltText('Variant B')).toBeInTheDocument();
  });
});
