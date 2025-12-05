import React from 'react';

interface ProductSummaryCardProps {
  product: {
    partNumber?: string | null;
    price?: string | null;
    multiplier?: string | null;
    stockStatus?: string | null;
  };
}

export default function ProductSummaryCard({ product }: ProductSummaryCardProps) {
  return (
    <aside className="bg-white rounded-xl shadow p-6 w-full md:w-80 mb-8 md:mb-0">
      <div className="mb-4">
        <div className="text-xs text-neutral-500">Part Number</div>
        <div className="font-medium text-neutral-900">{product.partNumber || 'N/A'}</div>
      </div>
      <div className="mb-4">
        <div className="text-xs text-neutral-500">List Price</div>
        <div className="font-bold text-primary-700">{product.price || 'N/A'}</div>
      </div>
      <div className="mb-4">
        <div className="text-xs text-neutral-500">Multiplier</div>
        <div className="font-medium text-neutral-900">{product.multiplier || 'N/A'}</div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="bg-primary-700 text-white px-4 py-2 rounded font-semibold hover:bg-primary-800 transition w-full">Add to Job Estimate</button>
        <button className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded font-semibold hover:bg-neutral-200 transition w-full">Add to Favorites</button>
      </div>
      {product.stockStatus && (
        <div className="mt-4 text-xs text-green-700 font-semibold">{product.stockStatus}</div>
      )}
    </aside>
  );
}
