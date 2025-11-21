'use client';

import { useCart, useCartDrawer } from '@/store';

export function CartDrawer() {
  const { items, updateQuantity, removeItem, subtotal, isEmpty } = useCart();
  const { isOpen, closeCart } = useCartDrawer();
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="text-neutral-500 hover:text-neutral-700 transition"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <p className="text-center text-neutral-500 mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-neutral-200 pb-4">
                  {item.image && (
                    <img
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                    <p className="text-sm text-neutral-600">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-neutral-200 rounded hover:bg-neutral-300 transition"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-neutral-200 rounded hover:bg-neutral-300 transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-error-600 hover:text-error-700 font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-neutral-200 p-4 space-y-4">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded transition shadow-sm hover:shadow-md">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
