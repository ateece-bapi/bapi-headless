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
    <div className="sticky top-8 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Order Summary</h2>

      {/* Totals */}
      <div className="mb-6 space-y-3 border-b border-neutral-200 pb-6">
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
      <div className="mb-6 flex justify-between border-b border-neutral-200 pb-6">
        <span className="text-lg font-bold text-neutral-900">Total</span>
        <span className="text-2xl font-bold text-primary-500">{total}</span>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase text-neutral-700">
          Payment Information
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Payment Method</span>
            <span className="font-semibold text-neutral-900">{paymentMethod}</span>
          </div>

          {transactionId && (
            <div className="flex flex-col gap-1">
              <span className="text-neutral-600">Transaction ID</span>
              <span className="break-all font-mono text-xs text-neutral-900">{transactionId}</span>
            </div>
          )}

          <div className="mt-4 border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-2 text-green-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
