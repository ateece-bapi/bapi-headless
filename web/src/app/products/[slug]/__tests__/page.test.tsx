import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { useCartStore } from '@/store';
type ProductForClient = React.ComponentProps<typeof ProductDetailClient>['product'];

const productShape: ProductForClient = {
  id: 'cHJvZHVjdDox',
  databaseId: 101,
  name: 'Test Sensor 101',
  slug: 'test-sensor-101',
  price: '$49.00',
  image: { sourceUrl: 'https://example.com/test-101.jpg', altText: 'Test Sensor 101' },
  gallery: [],
  variations: [],
};

describe('ProductDetailClient', () => {
  beforeEach(() => {
    // clear cart without replacing the entire store (preserve actions)
    useCartStore.setState({ items: [] });
  });

  it('renders and adds product to cart', async () => {
    render(<ProductDetailClient product={productShape} />);

    const addBtn = screen.getByRole('button', { name: /add to cart/i });
    expect(addBtn).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(addBtn);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].slug).toBe(productShape.slug);
  });
});
