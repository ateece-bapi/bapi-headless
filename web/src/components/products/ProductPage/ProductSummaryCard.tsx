"use client";

import React from 'react';

interface ProductSummaryCardProps {
  product: {
    partNumber?: string | null;
    price?: string | null;
    regularPrice?: string | null;
    multiplier?: string | null;
    multiplierGroups?: Array<{ id: string; name: string; slug: string }>;
    stockStatus?: string | null;
    stockQuantity?: number | null;
  };
}

export default function ProductSummaryCard({ product }: ProductSummaryCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const price = parseFloat(product.price || '0');
  const multiplier = parseFloat(product.multiplier || '1');
  const calculated = isNaN(price * multiplier * quantity) ? '0.00' : (price * multiplier * quantity).toFixed(2);
  return (
    <aside className="bg-white border border-neutral-200 rounded-xl shadow p-6 w-full md:w-80 mb-8 md:mb-0">
      <h2 className="text-neutral-900 text-xl font-bold mb-4">Product Summary</h2>
      <div className="mb-4">
        <div className="text-xs text-neutral-500">Part Number</div>
        <div className="font-medium text-neutral-900 text-lg">{product.partNumber || product.sku || 'N/A'}</div>
      </div>
      <div className="mb-4 flex justify-between items-center gap-4">
        <div>
          <div className="text-xs text-neutral-500">List Price</div>
          <div className="font-bold text-primary-700 text-lg">{product.price || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Multiplier</div>
          <div className="font-medium text-neutral-700 text-lg">{product.multiplier || 'N/A'}</div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="quantity" className="text-xs text-neutral-500">Quantity</label>
        <input
          type="number"
          id="quantity"
          min={1}
          max={product.stockQuantity || 999}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
          className="border border-neutral-200 focus:border-primary-500 bg-white text-neutral-900 rounded-lg px-3 py-2 w-20 shadow-sm transition"
        />
        {typeof product.stockQuantity === 'number' && (
          <span className="text-xs text-neutral-500">In stock: {product.stockQuantity}</span>
        )}
      </div>
      <div className="mb-6">
        <div className="text-xs text-neutral-500">Total</div>
        <div className="text-2xl font-bold text-primary-700">${calculated}</div>
      </div>
      <button className="bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold text-lg py-3 px-6 rounded-lg shadow focus:outline-primary-500 transition w-full mb-4">Add to Cart</button>
      {product.stockStatus && (
        <div className="mt-2 text-xs text-success-700 font-semibold">{product.stockStatus}</div>
      )}
      <div className="flex gap-2 mt-6">
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow focus:outline-primary-500 transition w-full">Add to Job Estimate</button>
        <button className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-semibold py-2 px-4 rounded-lg shadow focus:outline-primary-500 transition w-full">Add to Favorites</button>
      </div>
    </aside>
  );
}
