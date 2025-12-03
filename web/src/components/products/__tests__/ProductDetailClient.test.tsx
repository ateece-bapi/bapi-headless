// Mock Zustand useCart store
import { vi } from 'vitest';
vi.mock('@/store', () => ({
  useCart: () => ({
    addItem: vi.fn(),
  }),
  useCartDrawer: () => ({
    openCart: vi.fn(),
  }),
}));

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailClient from '../ProductDetailClient';
import * as store from '@/store';

const mockProduct = {
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

describe('ProductDetailClient', () => {
  it('renders attribute selectors and updates selection', () => {
    render(<ProductDetailClient product={mockProduct} />);
    // Should render selectors for Size and Color
    expect(screen.getByLabelText(/Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();

    // Default selection should be first option for each
    expect(screen.getByDisplayValue('M')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Red')).toBeInTheDocument();

    // Change Size to L
    fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: 'L' } });
    expect(screen.getByDisplayValue('L')).toBeInTheDocument();

    // Change Color to Blue
    fireEvent.change(screen.getByLabelText(/Color/i), { target: { value: 'Blue' } });
    expect(screen.getByDisplayValue('Blue')).toBeInTheDocument();
  });

  it('matches correct variation and prefers variation image', () => {
    render(<ProductDetailClient product={mockProduct} />);
    // Default: Size M, Color Red => Variant A
    expect(screen.getByAltText('Variant A')).toBeInTheDocument();

    // Change to Size L, Color Blue => Variant B
    fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: 'L' } });
    fireEvent.change(screen.getByLabelText(/Color/i), { target: { value: 'Blue' } });
    expect(screen.getByAltText('Variant B')).toBeInTheDocument();
  });

  it('adds correct variation to cart on Add to Cart', () => {
    // Explicitly mock hooks for injection
    const addItemMock = vi.fn();
    const openCartMock = vi.fn();
    const mockUseCart = () => ({ addItem: addItemMock });
    const mockUseCartDrawer = () => ({ openCart: openCartMock });
    render(
      <ProductDetailClient
        product={mockProduct}
        useCart={mockUseCart}
        useCartDrawer={mockUseCartDrawer}
      />
    );
    // Change to Size L, Color Blue
    fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: 'L' } });
    fireEvent.change(screen.getByLabelText(/Color/i), { target: { value: 'Blue' } });
    // Click Add to Cart
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    // Should call addItem with correct variation
    expect(addItemMock).toHaveBeenCalled();
    const callArgs = addItemMock.mock.calls[0][0];
    expect(callArgs.variationId).toBe(102);
    expect(callArgs.variationName).toBe('Variant B');
  });
});
