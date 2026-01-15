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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Items</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0 last:pb-0"
          >
            {/* Product Image */}
            <div className="flex-shrink-0 w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-neutral-600">
                Quantity: {item.quantity}
              </p>
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
