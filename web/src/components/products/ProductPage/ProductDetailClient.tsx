'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PackageIcon } from '@/lib/icons';
import ProductSummaryCard from '@/components/products/ProductPage/ProductSummaryCard';
import RelatedProducts from '@/components/products/ProductPage/RelatedProducts';
import AppLinks from '@/components/products/ProductPage/AppLinks';
import TrustBadges from '@/components/products/ProductPage/TrustBadges';
import HelpCTA from '@/components/products/ProductPage/HelpCTA';
import { CartDrawer } from '@/components/cart';
import { ProductVariationSelector, RecentlyViewed } from '@/components/products';
import VariationComparisonTool from '@/components/products/VariationComparisonTool';
import { useRecentlyViewed } from '@/store';
import { ProductGallerySkeleton } from '@/components/products/ProductGallerySkeleton';

// Lazy load ProductGallery for better initial page load performance
const ProductGallery = dynamic(
  () => import('@/components/products').then((mod) => ({ default: mod.ProductGallery })),
  {
    loading: () => <ProductGallerySkeleton />,
    ssr: false, // Gallery requires client-side interaction (zoom, lightbox)
  }
);

// Lazy load ProductHero to avoid i18n SSR issues
const ProductHero = dynamic(
  () => import('@/components/products/ProductPage/ProductHero'),
  {
    loading: () => <div className="mb-8 h-96 animate-pulse rounded-xl bg-neutral-50" />,
    ssr: false, // Uses i18n which needs client context
  }
);

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
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isLoadingVariation, setIsLoadingVariation] = useState(false);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const { addProduct } = useRecentlyViewed();

  // Memoize image array construction to avoid recomputation on every render
  const galleryImages = React.useMemo(() => {
    const allImages = [];
    // Include main product image first if it exists and isn't in gallery
    if (product.image && product.image.sourceUrl) {
      const isInGallery = product.gallery?.some(
        (img: any) => img && img.sourceUrl === product.image.sourceUrl
      );
      if (!isInGallery) {
        allImages.push({
          sourceUrl: product.image.sourceUrl,
          altText: product.image.altText || product.name,
        });
      }
    }
    // Add all gallery images
    if (product.gallery && product.gallery.length > 0) {
      allImages.push(
        ...product.gallery
          .filter((img: any) => img && img.sourceUrl) // Filter out invalid images
          .map((img: any) => ({
            sourceUrl: img.sourceUrl,
            altText: img.altText || product.name,
          }))
      );
    }
    return allImages;
  }, [product.image, product.gallery, product.name]);

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

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="py-12">
          <div className="container mx-auto px-4">
            {/* Main Product Layout */}
            <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column: Product Image */}
              <div>
                <ProductGallery
                  images={galleryImages}
                  productName={product.name}
                  variation={selectedVariation}
                />
              </div>

              {/* Right Column: Product Summary (Sticky) */}
              <div>
                <ProductSummaryCard
                  product={product}
                  variation={selectedVariation}
                  useCart={useCart}
                  useCartDrawer={useCartDrawer}
                  isLoadingVariation={isLoadingVariation}
                />
              </div>
            </div>

            {/* Trust and credibility badges */}
            <TrustBadges className="mb-8" />

            {/* Product Name Header - Sticky on mobile for context */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="sticky top-0 z-10 -mx-4 mb-4 border-b-2 border-primary-500 bg-white px-4 py-4 shadow-md md:static md:mx-0 md:rounded-t-xl md:px-6 md:shadow-none">
                <h2 className="flex items-center gap-3 text-xl font-bold text-neutral-900 md:text-2xl">
                  <PackageIcon className="h-6 w-6 text-primary-600" />
                  <span>{product.name}</span>
                </h2>
                <p className="ml-9 mt-1 text-sm text-neutral-700">
                  Configure your specifications below
                </p>
              </div>
            )}

            {/* Enhanced Variation Selector */}
            <ProductVariationSelector
              product={product}
              onVariationChange={handleVariationChange}
              quantity={quantity}
              onQuantityChange={setQuantity}
              useCart={useCart}
              useCartDrawer={useCartDrawer}
            />

            {/* Variation Comparison Tool - Collapsible */}
            {product.variations && product.variations.length > 1 && (
              <VariationComparisonTool variations={product.variations} className="mb-8" />
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
