/**
 * Order Items Component
 *
 * Displays list of items in the order
 */

import Image from 'next/image';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Order Items</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border-b border-neutral-200 pb-4 last:border-0 last:pb-0"
          >
            {/* Product Image */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 line-clamp-2 font-semibold text-neutral-900">{item.name}</h3>
              <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold text-neutral-900">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
