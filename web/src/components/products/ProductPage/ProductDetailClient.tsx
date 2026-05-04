'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import RelatedProducts from '@/components/products/ProductPage/RelatedProducts';
import AppLinks from '@/components/products/ProductPage/AppLinks';
import HelpCTA from '@/components/products/ProductPage/HelpCTA';
import ProductHero from '@/components/products/ProductPage/ProductHero';
import TrustBadges from '@/components/products/ProductPage/TrustBadges';
import { CartDrawer } from '@/components/cart';
import { ProductVariationSelector, RecentlyViewed } from '@/components/products';
import { useRecentlyViewed } from '@/store';

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
  useCart,
  useCartDrawer,
}: ProductDetailClientProps) {
  const t = useTranslations('productPage.detail');
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isLoadingVariation, setIsLoadingVariation] = useState(false);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const { addProduct } = useRecentlyViewed();

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
