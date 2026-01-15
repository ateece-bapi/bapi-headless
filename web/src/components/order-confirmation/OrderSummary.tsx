/**
 * Order Summary Component
 * 
 * Displays order totals and payment information
 */

interface OrderSummaryProps {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  paymentMethod: string;
  transactionId?: string;
}

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  paymentMethod,
  transactionId,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-8">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

      {/* Totals */}
      <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span className="font-semibold text-neutral-900">{subtotal}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Shipping</span>
          <span className="font-semibold text-neutral-900">{shipping}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <span className="font-semibold text-neutral-900">{tax}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between mb-6 pb-6 border-b border-neutral-200">
        <span className="text-lg font-bold text-neutral-900">Total</span>
        <span className="text-2xl font-bold text-primary-500">{total}</span>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-700 uppercase mb-3">
          Payment Information
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Payment Method</span>
            <span className="font-semibold text-neutral-900">{paymentMethod}</span>
          </div>
          
          {transactionId && (
            <div className="flex justify-between">
              <span className="text-neutral-600">Transaction ID</span>
              <span className="font-mono text-xs text-neutral-900">
                {transactionId}
              </span>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-green-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Payment Confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
