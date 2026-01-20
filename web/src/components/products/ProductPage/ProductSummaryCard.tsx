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
  
  // Check if this is a variable product
  const isVariableProduct = product.attributes && product.attributes.length > 0;
  
  // Use variation data if available, fallback to product data
  const displayPrice = variation?.price || product.price || '0';
  const displayPartNumber = variation?.partNumber || variation?.sku || product.partNumber || product.sku || 'N/A';
  const displayStockStatus = variation?.stockStatus || product.stockStatus;
  
  const price = parseFloat(displayPrice.replace(/[^0-9.-]+/g, '') || '0');
  const multiplier = parseFloat(product.multiplier || '1');
  const calculated = isNaN(price * multiplier * quantity) ? '0.00' : (price * multiplier * quantity).toFixed(2);
  const isOutOfStock = displayStockStatus !== 'IN_STOCK' || (typeof product.stockQuantity === 'number' && product.stockQuantity < 1);

  const summaryId = variation?.id || product.id || product.partNumber || product.sku || '';
  const summaryName = variation?.name || product.name || product.partNumber || product.sku || 'Product';
  const summarySlug = product.slug || product.partNumber || product.sku || '';
  const summaryImage = variation?.image || product.image || null;
  const variationId = variation?.databaseId || undefined;
  const variationName = variation?.name || undefined;
  const variationSku = variation?.sku || undefined;
  const partNumber = variation?.partNumber || product.partNumber || undefined;
  
  // Build selectedAttributes from variation.attributes if available
  const selectedAttributes = variation?.attributes?.nodes?.reduce((acc: Record<string, string>, attr: any) => {
    acc[attr.name] = attr.value;
    return acc;
  }, {}) || undefined;
  
  // For variable products, require a variation selection
  if (isVariableProduct && !variation) {
    return (
      <aside className="bg-white border border-neutral-200 rounded-xl shadow p-6 w-full mb-8 md:mb-0 md:sticky md:top-4">
        <h2 className="text-neutral-900 text-xl font-bold mb-4">Product Summary</h2>
        <div className="py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-neutral-600 font-medium mb-2">Configure Product</p>
          <p className="text-sm text-neutral-500">
            Select your specifications below to see pricing and part number
          </p>
        </div>
      </aside>
    );
  }

  if (!displayPrice || displayPrice.trim() === '' || displayPrice === '0') {
    return (
      <aside className="bg-white border border-neutral-200 rounded-xl shadow p-6 w-full md:w-80 mb-8 md:mb-0">
        {/* Only fallback <p> for missing price, no other children */}
        <p className="text-primary-500 mb-4"> </p>
      </aside>
    );
  }

  return (
    <aside className="bg-white border border-neutral-200 rounded-xl shadow p-6 w-full mb-8 md:mb-0 md:sticky md:top-4">
      <h2 className="text-neutral-900 text-xl font-bold mb-4">Product Summary</h2>
      <div className="mb-4">
        <div className="text-xs text-neutral-500 uppercase tracking-wide">Part Number</div>
        <div className="font-semibold text-neutral-900 text-lg">{displayPartNumber}</div>
      </div>
      <div className="mb-4 flex justify-between items-center gap-4">
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wide">List Price</div>
          <div className="font-bold text-primary-600 text-2xl">{displayPrice}</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500 uppercase tracking-wide">Multiplier</div>
          <div className="font-semibold text-neutral-700 text-xl">{product.multiplier || 'N/A'}</div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="quantity" className="text-xs text-neutral-500 uppercase tracking-wide">Quantity</label>
        <input
          type="number"
          id="quantity"
          min={1}
          max={product.stockQuantity || 999}
          value={quantity}
          onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
          className="border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white text-neutral-900 rounded-lg px-4 py-2 w-24 shadow-sm transition font-medium"
        />
        {typeof product.stockQuantity === 'number' && (
          <span className="text-xs text-neutral-600 font-medium">In stock: {product.stockQuantity}</span>
        )}
      </div>
      <div className="mb-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Total</div>
        <div className="text-3xl font-bold text-primary-700">${calculated}</div>
      </div>
      <AddToCartButton
        product={{
          ...product,
          id: summaryId,
          name: summaryName,
          slug: summarySlug,
          price: displayPrice,
          image: summaryImage,
          variationId,
          variationName,
          variationSku,
          partNumber,
          selectedAttributes,
        }}
        quantity={quantity}
        className="text-lg py-3 px-6 w-full mb-4"
        disabled={isOutOfStock}
        useCart={typeof useCart === 'function' ? useCart : undefined}
        useCartDrawer={typeof useCartDrawer === 'function' ? useCartDrawer : undefined}
      />
      {displayStockStatus && (
        <div className={`mt-2 text-sm font-semibold inline-flex items-center gap-2 px-3 py-1 rounded-full ${displayStockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className={`w-2 h-2 rounded-full ${displayStockStatus === 'IN_STOCK' ? 'bg-green-600' : 'bg-red-600'}`}></span>
          {displayStockStatus.replace('_', ' ')}
        </div>
      )}
      <div className="flex gap-2 mt-6">
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition w-full">Add to Job Estimate</button>
        <button className="bg-white border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 font-semibold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-neutral-300/50 transition w-full">Add to Favorites</button>
      </div>
    </aside>
  );
}
