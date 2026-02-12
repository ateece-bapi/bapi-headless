'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, useCartDrawer } from '@/store';

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, subtotal, isEmpty } = useCart();
  const { isOpen, closeCart } = useCartDrawer();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Semi-transparent neutral with subtle blue tint for brand cohesion */}
      <div
        className="fixed inset-0 z-40 bg-gradient-to-br from-neutral-900/60 via-neutral-800/50 to-primary-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="text-neutral-500 transition hover:text-neutral-700"
            aria-label="Close cart"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <p className="mt-8 text-center text-neutral-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variationId || ''}`}
                  className="flex gap-4 border-b border-neutral-200 pb-4"
                >
                  {item.image && (
                    <Image
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{item.name}</h3>

                    {/* Show variation details if present */}
                    {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                      <div className="mt-1 space-y-0.5 text-xs text-neutral-600">
                        {Object.entries(item.selectedAttributes).map(([attr, value]) => (
                          <div key={attr}>
                            <span className="font-medium capitalize">
                              {attr.replace(/-/g, ' ')}:
                            </span>{' '}
                            {value}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show part number or variation SKU if available */}
                    {(item.partNumber || item.variationSku) && (
                      <p className="mt-1 font-mono text-xs text-neutral-500">
                        {item.partNumber || item.variationSku}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-neutral-600">{item.price}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variationId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-base font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variationId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id, item.variationId)}
                        className="ml-auto font-medium text-error-600 transition-colors hover:text-error-700"
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
          <div className="space-y-3 border-t border-neutral-200 bg-neutral-50 p-4">
            <div className="flex justify-between text-lg font-bold text-neutral-900">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-bapi-primary block w-full rounded-xl py-3 text-center active:scale-[0.98]"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-bapi-accent block w-full rounded-xl py-3 text-center active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
