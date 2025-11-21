'use client';

import { useCartDrawer } from '@/store';
import { CartIcon, CartDrawer, AddToCartButton } from '@/components/cart';

// Mock products for testing
const mockProducts = [
  {
    id: 'product-1',
    databaseId: 1,
    name: 'Digital Output Module - BACnet IP',
    slug: 'bacnet-ip-module',
    price: '$285.00',
    image: {
      sourceUrl: 'https://via.placeholder.com/300',
      altText: 'Digital Output Module',
    },
  },
  {
    id: 'product-2',
    databaseId: 2,
    name: 'Water Leak Detector',
    slug: 'water-leak-detector',
    price: '$386.00',
    image: {
      sourceUrl: 'https://via.placeholder.com/300',
      altText: 'Water Leak Detector',
    },
  },
  {
    id: 'product-3',
    databaseId: 3,
    name: 'Temperature Sensor',
    slug: 'temperature-sensor',
    price: '$715.00',
    image: {
      sourceUrl: 'https://via.placeholder.com/300',
      altText: 'Temperature Sensor',
    },
  },
];

export default function CartTestPage() {
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
          Click "Add to Cart" on any product to test the cart functionality.
          The cart state persists in localStorage.
        </p>
        
        {/* Product Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={product.image.sourceUrl}
                alt={product.image.altText}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg font-bold text-green-600 mb-4">
                {product.price}
              </p>
              <AddToCartButton product={product} className="w-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
