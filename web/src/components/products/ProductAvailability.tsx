'use client';

import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface ProductAvailabilityProps {
  /** WooCommerce stock status */
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder' | null;
  /** Available quantity (optional) */
  stockQuantity?: number | null;
  /** Estimated restock date (optional) */
  restockDate?: string | null;
  /** Show detailed stock information */
  detailed?: boolean;
}

/**
 * Product availability indicator with stock status and estimated restock
 *
 * Features:
 * - Visual indicators (colors and icons)
 * - Stock quantity display
 * - Estimated restock dates
 * - Low stock warnings
 * - Accessible labels
 *
 * @param stockStatus - Current stock status
 * @param stockQuantity - Available quantity
 * @param restockDate - Estimated restock date
 * @param detailed - Show detailed information
 */
export default function ProductAvailability({
  stockStatus = 'instock',
  stockQuantity,
  restockDate,
  detailed = false,
}: ProductAvailabilityProps) {
  // Determine status details
  const getStatusDetails = () => {
    const lowStockThreshold = 10;

    switch (stockStatus) {
      case 'instock':
        if (stockQuantity !== null && stockQuantity !== undefined) {
          if (stockQuantity <= lowStockThreshold && stockQuantity > 0) {
            return {
              icon: AlertCircle,
              label: 'Low Stock',
              color: 'warning',
              message: `Only ${stockQuantity} left in stock`,
              bgColor: 'bg-warning-50',
              textColor: 'text-warning-700',
              iconColor: 'text-warning-600',
            };
          }
          return {
            icon: CheckCircle,
            label: 'In Stock',
            color: 'success',
            message:
              detailed && stockQuantity > lowStockThreshold
                ? `${stockQuantity} available`
                : 'Ready to ship',
            bgColor: 'bg-success-50',
            textColor: 'text-success-700',
            iconColor: 'text-success-600',
          };
        }
        return {
          icon: CheckCircle,
          label: 'In Stock',
          color: 'success',
          message: 'Ready to ship',
          bgColor: 'bg-success-50',
          textColor: 'text-success-700',
          iconColor: 'text-success-600',
        };

      case 'outofstock':
        return {
          icon: XCircle,
          label: 'Out of Stock',
          color: 'error',
          message: restockDate
            ? `Expected back: ${new Date(restockDate).toLocaleDateString()}`
            : 'Currently unavailable',
          bgColor: 'bg-error-50',
          textColor: 'text-error-700',
          iconColor: 'text-error-600',
        };

      case 'onbackorder':
        return {
          icon: Clock,
          label: 'On Backorder',
          color: 'info',
          message: restockDate
            ? `Ships on: ${new Date(restockDate).toLocaleDateString()}`
            : 'Available for pre-order',
          bgColor: 'bg-info-50',
          textColor: 'text-info-700',
          iconColor: 'text-info-600',
        };

      default:
        return {
          icon: AlertCircle,
          label: 'Check Availability',
          color: 'neutral',
          message: 'Contact us for availability',
          bgColor: 'bg-neutral-50',
          textColor: 'text-neutral-700',
          iconColor: 'text-neutral-600',
        };
    }
  };

  const status = getStatusDetails();
  const Icon = status.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${status.bgColor} border-${status.color}-200 `}
    >
      <Icon className={`h-5 w-5 ${status.iconColor}`} aria-hidden="true" />
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${status.textColor}`}>{status.label}</span>
        {status.message && (
          <span className={`text-xs ${status.textColor} opacity-80`}>{status.message}</span>
        )}
      </div>
    </div>
  );
}
