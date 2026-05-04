'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import RelatedProducts from '@/components/products/ProductPage/RelatedProducts';
import AppLinks from '@/components/products/ProductPage/AppLinks';
import HelpCTA from '@/components/products/ProductPage/HelpCTA';
import ProductHero from '@/components/products/ProductPage/ProductHero';
import TrustBadges from '@/components/products/ProductPage/TrustBadges';
import { CartDrawer, AddToCartButton } from '@/components/cart';
import { ProductVariationSelector, RecentlyViewed } from '@/components/products';
import { useRecentlyViewed, useCart as defaultUseCart, useCartDrawer as defaultUseCartDrawer } from '@/store';
import { useRegion } from '@/store/regionStore';
import { convertWooCommercePriceNumeric } from '@/lib/utils/currency';
import type { CartItem } from '@/store';
import { Link } from '@/lib/navigation';

// Lazy load ProductTabs to avoid i18n SSR issues
const ProductTabs = dynamic(
  () => import('@/components/products/ProductPage/ProductTabs'),
  {
    loading: () => <div className="mb-12 h-96 animate-pulse rounded-xl bg-neutral-50" />,
    ssr: false, // Tabs use i18n which needs client context
  }
);

interface ProductDetailClientProps {
  product: any;
  productId?: string;
  useCart?: any;
  useCartDrawer?: any;
}

export default function ProductDetailClient({
  product,
  productId,
  useCart = defaultUseCart,
  useCartDrawer = defaultUseCartDrawer,
}: ProductDetailClientProps) {
  const tSummary = useTranslations('productPage.summary');
  const tCommon = useTranslations('common');
  const region = useRegion();
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isLoadingVariation, setIsLoadingVariation] = useState(false);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const { addProduct } = useRecentlyViewed();

  // Determine if this is a simple product (no variations)
  const isSimpleProduct = !product?.variations || product.variations.length === 0;

  // Handle variation change with loading state
  const handleVariationChange = (variation: any) => {
    setIsLoadingVariation(true);
    // Simulate slight delay for loading state visibility
    setTimeout(() => {
      setSelectedVariation(variation);
      setIsLoadingVariation(false);
    }, 150); // Brief delay to show loading state
  };

  // Track this product as recently viewed
  useEffect(() => {
    if (product?.id && product?.name && product?.databaseId) {
      addProduct({
        id: product.id,
        databaseId: product.databaseId,
        name: product.name,
        slug: product.slug || '',
        price: product.price || '',
        image: product.image
          ? {
              sourceUrl: product.image.sourceUrl,
              altText: product.image.altText || product.name,
            }
          : null,
      });
    }
  }, [product, addProduct]);

  const scrollToConfigurator = () => {
    const configurator = document.querySelector('[data-product-configurator]');
    if (configurator) {
      const elementPosition = configurator.getBoundingClientRect().top + window.scrollY;
      const offset = 100;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Updated Product Hero with blue banner, description, and action buttons */}
        <ProductHero 
          product={product} 
          variation={selectedVariation}
          onConfigureClick={scrollToConfigurator}
        />

        {/* Trust badges full width */}
        <div className="container mx-auto px-4 pb-8">
          <TrustBadges />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Configure section - Full width to match Matt's mockup */}
          <ProductVariationSelector
            product={product}
            onVariationChange={handleVariationChange}
            quantity={quantity}
            onQuantityChange={setQuantity}
            useCart={useCart}
            useCartDrawer={useCartDrawer}
          />

          {/* Add to Cart for simple products (no variations) */}
          {isSimpleProduct && (
            <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8" data-product-configurator tabIndex={-1}>
              <div className="mb-4 rounded-t-lg bg-primary-500 -mx-8 -mt-8 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{tSummary('productInformation')}</h2>
                <p className="text-sm text-white/90">{tSummary('readyToAddToCart')}</p>
              </div>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="font-medium text-neutral-700">
                    {tSummary('quantity')}:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-center focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                
                {product.price ? (
                  <AddToCartButton
                    product={{
                      id: product.id,
                      databaseId: product.databaseId,
                      name: product.name,
                      slug: product.slug,
                      price: product.price || '',
                      numericPrice: convertWooCommercePriceNumeric(product.price || '', region.currency),
                      image: product.image,
                    }}
                    quantity={quantity}
                    useCart={useCart}
                    useCartDrawer={useCartDrawer}
                    disabled={product?.stockStatus !== 'IN_STOCK'}
                    className="flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-neutral-700">{tSummary('contactForPricing')}</p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center gap-2 mt-3 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      {tCommon('contactUs')}
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
              
              {product.stockStatus !== 'IN_STOCK' && (
                <p className="mt-4 text-sm text-red-600">{tSummary('outOfStockMessage')}</p>
              )}
            </div>
          )}

          <ProductTabs product={product} />

          {/* Recently Viewed Products - shows below tabs */}
          <div className="my-8">
            <RecentlyViewed excludeProductId={product.id} maxDisplay={6} />
          </div>

          {/* Help CTA for customer support */}
          <HelpCTA className="mb-8" />

          <RelatedProducts related={product.relatedProducts} />
          <AppLinks
            product={{ iosAppUrl: product.iosAppUrl, androidAppUrl: product.androidAppUrl }}
          />
        </div>
        <footer className="border-t border-neutral-200 bg-white py-8">
          <div className="container mx-auto px-4 text-center text-neutral-700">
            <p>&copy; 2025 BAPI. All rights reserved.</p>
          </div>
        </footer>
      </div>
      <CartDrawer />
    </>
  );
}
