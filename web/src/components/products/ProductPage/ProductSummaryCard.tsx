"use client";

import React from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductSummaryCardProps {
  product: any;
  variation?: any;
  useCart?: any;
  useCartDrawer?: any;
}

export default function ProductSummaryCard({ product, variation, useCart, useCartDrawer }: ProductSummaryCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const price = parseFloat(product.price || '0');
  const multiplier = parseFloat(product.multiplier || '1');
  const calculated = isNaN(price * multiplier * quantity) ? '0.00' : (price * multiplier * quantity).toFixed(2);
  const isOutOfStock = product.stockStatus !== 'IN_STOCK' || (typeof product.stockQuantity === 'number' && product.stockQuantity < 1);

  // If product price is empty, always show fallback UI, regardless of variation
  const summaryId = variation?.id || product.id || product.partNumber || product.sku || '';
  const summaryName = variation?.name || product.name || product.partNumber || product.sku || 'Product';
  const summarySlug = product.slug || product.partNumber || product.sku || '';
  const summaryPrice = (product.price && product.price.trim() !== '')
    ? (variation && variation.price && variation.price.trim() !== '' ? variation.price : product.price)
    : '';
  const summaryImage = variation?.image || product.image || null;
  const variationId = variation?.databaseId || undefined;
  const variationName = variation?.name || undefined;

  if (!summaryPrice || summaryPrice.trim() === '') {
    return (
      <aside className="bg-white border border-neutral-200 rounded-xl shadow p-6 w-full md:w-80 mb-8 md:mb-0">
        {/* Only fallback <p> for missing price, no other children */}
        <p className="text-primary-500 mb-4"> </p>
      </aside>
    );
  }

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
          <div className="font-bold text-primary-700 text-lg">{summaryPrice}</div>
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
      <AddToCartButton
        product={{
          ...product,
          variationId,
          variationName,
        }}
        quantity={quantity}
        className="text-lg py-3 px-6 w-full mb-4"
        disabled={isOutOfStock}
        useCart={typeof useCart === 'function' ? useCart : undefined}
        useCartDrawer={typeof useCartDrawer === 'function' ? useCartDrawer : undefined}
      />
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
