'use client';

import { useState } from 'react';
import { GitCompare, X } from 'lucide-react';
import { useProductComparison } from '@/hooks/useProductComparison';
import ProductComparison from './ProductComparison';

interface ComparisonButtonProps {
  locale: string;
}

/**
 * Floating Comparison Button
 *
 * Shows when 2+ products are selected for comparison
 * Opens comparison modal
 * Displays count of selected products
 * Sticky positioning at bottom-right
 */
export default function ComparisonButton({ locale }: ComparisonButtonProps) {
  const [showComparison, setShowComparison] = useState(false);
  const { comparisonProducts, count, clearComparison, removeFromComparison } =
    useProductComparison();

  if (count === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="z-dropdown fixed bottom-6 right-6 animate-[scale-in_300ms_ease-out]">
        <div className="relative">
          {/* Clear All Badge */}
          <button
            onClick={clearComparison}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-error-500 p-1 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-error-600"
            aria-label="Clear comparison"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Compare Button */}
          <button
            onClick={() => setShowComparison(true)}
            className="bg-bapi-primary-gradient hover:shadow-3xl group flex items-center gap-3 rounded-2xl px-6 py-4 text-white shadow-2xl transition-all duration-300 hover:scale-105"
            aria-label={`Compare ${count} products`}
          >
            <GitCompare className="h-6 w-6 transition-transform duration-500 group-hover:rotate-180" />
            <div className="text-left">
              <div className="text-xs font-medium opacity-90">Compare</div>
              <div className="text-lg font-bold">
                {count} Product{count > 1 ? 's' : ''}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparison
          products={comparisonProducts as any}
          onRemove={removeFromComparison}
          onClose={() => setShowComparison(false)}
          locale={locale}
        />
      )}
    </>
  );
}
