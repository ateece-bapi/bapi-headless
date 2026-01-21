"use client";

import React from 'react';
import { Briefcase, Heart } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductSummaryCardProps {
  product: any;
  variation?: any;
  useCart?: any;
  useCartDrawer?: any;
  isLoadingVariation?: boolean; // New prop for loading state
}

export default function ProductSummaryCard({ 
  product, 
  variation, 
  useCart, 
  useCartDrawer,
  isLoadingVariation = false 
}: ProductSummaryCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [isFavorited, setIsFavorited] = React.useState(false);
  
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
      
      {/* Configuration Complete Indicator */}
      {isVariableProduct && variation && (
        <div className="flex items-center gap-2 text-green-600 mb-4 bg-green-50 px-3 py-2 rounded-lg">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold">Configuration Complete</span>
        </div>
      )}
      
      {/* Loading State Overlay */}
      {isLoadingVariation && (
        <div className="space-y-4 animate-pulse">
          {/* Stock Status Skeleton */}
          <div className="h-10 bg-neutral-200 rounded-lg w-32"></div>
          
          {/* Part Number Skeleton */}
          <div>
            <div className="h-3 bg-neutral-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-neutral-200 rounded-lg w-48"></div>
          </div>
          
          {/* Price Skeleton */}
          <div className="bg-neutral-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <div>
                <div className="h-3 bg-neutral-200 rounded w-16 mb-2"></div>
                <div className="h-10 bg-neutral-200 rounded w-32"></div>
              </div>
              <div>
                <div className="h-3 bg-neutral-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-neutral-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-3 bg-neutral-200 rounded w-full"></div>
          </div>
          
          {/* Quantity Skeleton */}
          <div>
            <div className="h-3 bg-neutral-200 rounded w-20 mb-2"></div>
            <div className="h-12 bg-neutral-200 rounded-lg"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="h-14 bg-neutral-200 rounded-xl"></div>
        </div>
      )}
      
      {/* Actual Content - Hidden when loading */}
      {!isLoadingVariation && (
        <>
      {/* Stock Status Badge - Prominent Position */}
      {displayStockStatus && (
        <div className={`mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm ${
          displayStockStatus === 'IN_STOCK' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : displayStockStatus === 'ON_BACKORDER'
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            displayStockStatus === 'IN_STOCK' 
              ? 'bg-green-600' 
              : displayStockStatus === 'ON_BACKORDER'
              ? 'bg-yellow-600'
              : 'bg-red-600'
          }`}></span>
          {displayStockStatus === 'IN_STOCK' ? '✓ In Stock' : 
           displayStockStatus === 'ON_BACKORDER' ? 'On Backorder' :
           'Out of Stock'}
        </div>
      )}
      
      {/* Part Number - Styled with monospace */}
      <div className="mb-4">
        <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Part Number</div>
        <code className="inline-block px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg font-mono text-sm font-semibold text-neutral-900">
          {displayPartNumber}
        </code>
      </div>
      
      {/* Price Hierarchy - Improved Visual Weight */}
      <div className="mb-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs text-primary-700 uppercase tracking-wide font-semibold mb-1">Your Price</div>
            <div className="text-4xl font-bold text-primary-600">${calculated}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-600 uppercase tracking-wide">Multiplier</div>
            <div className="text-xl font-bold text-neutral-700">{product.multiplier || '1.0'}</div>
          </div>
        </div>
        <div className="text-xs text-neutral-600 border-t border-primary-200 pt-2">
          List Price: <span className="font-semibold">{displayPrice}</span> × Qty: <span className="font-semibold">{quantity}</span> × Multiplier: <span className="font-semibold">{product.multiplier || '1.0'}</span>
        </div>
      </div>
      
      {/* Quantity Input - With Stepper Buttons */}
      <div className="mb-6">
        <label htmlFor="quantity" className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">Quantity</label>
        <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-5 py-4 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset min-w-[44px] min-h-[44px]"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            id="quantity"
            min={1}
            max={product.stockQuantity || 999}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="flex-1 text-center border-0 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white text-neutral-900 py-4 font-semibold text-lg min-h-[44px]"
          />
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(product.stockQuantity || 999, q + 1))}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-5 py-4 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset min-w-[44px] min-h-[44px]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {typeof product.stockQuantity === 'number' && (
          <div className="text-xs text-neutral-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {product.stockQuantity} units available
          </div>
        )}
      </div>
      
      {/* Add to Cart - Primary CTA Above Fold */}
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
        className="text-lg py-4 px-6 w-full mb-4 font-bold shadow-lg hover:shadow-xl transition-all"
        disabled={isOutOfStock}
        useCart={typeof useCart === 'function' ? useCart : undefined}
        useCartDrawer={typeof useCartDrawer === 'function' ? useCartDrawer : undefined}
      />
      
      {/* Secondary Actions */}
      <div className="flex gap-2">
        <button 
          className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition w-full text-sm min-h-[44px]"
          title="Add to Job Estimate"
        >
          <Briefcase className="w-4 h-4" />
          <span className="hidden sm:inline">Job Estimate</span>
        </button>
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-4 transition w-full text-sm min-h-[44px] ${
            isFavorited 
              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50' 
              : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-red-400 hover:text-red-500 focus:ring-neutral-300/50'
          }`}
          title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{isFavorited ? 'Favorited' : 'Favorite'}</span>
        </button>
      </div>
      </>
      )}
    </aside>
  );
}
