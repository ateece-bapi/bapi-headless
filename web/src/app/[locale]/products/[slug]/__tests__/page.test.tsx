import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetailClient } from '@/components/products';
import { useCartStore } from '@/store';
import { ToastProvider } from '@/components/ui/Toast';
type ProductForClient = React.ComponentProps<typeof ProductDetailClient>['product'];

import { mockProductForClient, makeProductForClient } from '../../../../../../test/msw/fixtures';

// Mock the cart hooks
const mockUseCart = () => ({
  items: [],
  totalItems: 0,
  addItem: (product: any, quantity: number) => {
    useCartStore.getState().addItem(product, quantity);
  },
});

const mockUseCartDrawer = () => ({
  isOpen: false,
  open: () => {},
  close: () => {},
});

const productShape: ProductForClient = makeProductForClient();

describe('ProductDetailClient', () => {
  beforeEach(() => {
    // clear cart without replacing the entire store (preserve actions)
    useCartStore.setState({ items: [] });
  });

  it('renders and adds product to cart', async () => {
    render(
      <ToastProvider>
        <ProductDetailClient 
          product={productShape}
          useCart={mockUseCart}
          useCartDrawer={mockUseCartDrawer}
        />
      </ToastProvider>
    );

    const addBtn = screen.getByRole('button', { name: /add.*to cart/i });
    expect(addBtn).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(addBtn);

    // Wait for async operation in AddToCartButton (300ms delay + processing)
    await waitFor(() => {
      const items = useCartStore.getState().items;
      expect(items.length).toBe(1);
    });
    
    const items = useCartStore.getState().items;
    expect(items[0].slug).toBe(productShape.slug);
  });
});
