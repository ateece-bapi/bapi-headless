'use client';

import { useCartDrawer } from '@/store';
import { CartIcon, CartDrawer, AddToCartButton } from '@/components/cart';
import type { CartItem } from '@/store';

interface CartTestClientProps {
  products: Omit<CartItem, 'quantity'>[];
}

export default function CartTestClient({ products }: CartTestClientProps) {
  const { openCart } = useCartDrawer();
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Cart Icon */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Cart Test Page</h1>
          <button
            onClick={openCart}
            className="hover:text-blue-600 transition"
          >
            <CartIcon />
          </button>
        </div>
        
        <p className="text-gray-600 mb-8">
          Click &quot;Add to Cart&quot; on any product to test the cart functionality with real WooCommerce products.
          The cart state persists in localStorage.
        </p>
        
        {/* Product Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {product.image && (
                <img
                  src={product.image.sourceUrl}
                  alt={product.image.altText}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg font-bold text-green-600 mb-4">
                {product.price}
              </p>
              <AddToCartButton product={product} className="w-full" />
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No products found</p>
        )}
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
