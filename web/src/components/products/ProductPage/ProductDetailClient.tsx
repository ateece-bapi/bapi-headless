"use client";

import React, { useState, useEffect } from "react";
import ProductHero from "@/components/products/ProductPage/ProductHero";
import ProductSummaryCard from "@/components/products/ProductPage/ProductSummaryCard";
import ProductTabs from "@/components/products/ProductPage/ProductTabs";
import RelatedProducts from "@/components/products/ProductPage/RelatedProducts";
import AppLinks from "@/components/products/ProductPage/AppLinks";
import ContactInfo from "@/components/products/ProductPage/ContactInfo";
import Breadcrumbs from "@/components/products/ProductPage/Breadcrumbs";
import TrustBadges from "@/components/products/ProductPage/TrustBadges";
import HelpCTA from "@/components/products/ProductPage/HelpCTA";
import { CartDrawer } from "@/components/cart";
import { ProductVariationSelector, ProductGallery, RecentlyViewed } from "@/components/products";
import { useRecentlyViewed } from "@/store";

interface ProductDetailClientProps {
  product: any;
  productId?: string;
  useCart?: any;
  useCartDrawer?: any;
}

export default function ProductDetailClient({ product, productId, useCart, useCartDrawer }: ProductDetailClientProps) {

  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const { addProduct } = useRecentlyViewed();

  // Track this product as recently viewed
  useEffect(() => {
    if (product?.id && product?.name && product?.databaseId) {
      addProduct({
        id: product.id,
        databaseId: product.databaseId,
        name: product.name,
        slug: product.slug || '',
        price: product.price || '',
        image: product.image ? {
          sourceUrl: product.image.sourceUrl,
          altText: product.image.altText || product.name,
        } : null,
      });
    }
  }, [product, addProduct]);

  // Build breadcrumb items from product categories
  const buildBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" }
    ];

    // Add only the first (primary) category if it exists
    if (product.productCategories && Array.isArray(product.productCategories) && product.productCategories.length > 0) {
      const primaryCategory = product.productCategories[0];
      breadcrumbs.push({
        label: primaryCategory.name,
        href: `/products/${primaryCategory.slug}`
      });
    }

    // Add the product name as the final item (no href)
    breadcrumbs.push({ label: product.name });

    return breadcrumbs;
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="py-12">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={buildBreadcrumbs()} />
            
            {/* Main Product Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column: Product Image */}
              <div className="lg:col-span-2">
                {product.gallery && product.gallery.length > 0 ? (
                  <ProductGallery
                    images={product.gallery.map((img: any) => ({
                      url: img.sourceUrl,
                      alt: img.altText || product.name,
                    }))}
                    productName={product.name}
                  />
                ) : (
                  <ProductHero product={product} variation={selectedVariation} />
                )}
              </div>
              
              {/* Right Column: Product Summary (Sticky) */}
              <div className="lg:col-span-1">
                <ProductSummaryCard
                  product={product}
                  variation={selectedVariation}
                  useCart={useCart}
                  useCartDrawer={useCartDrawer}
                />
              </div>
            </div>
            
            {/* Trust and credibility badges */}
            <TrustBadges className="mb-8" />
            
            {/* Enhanced Variation Selector */}
            <ProductVariationSelector
              product={product}
              onVariationChange={setSelectedVariation}
            />
            <ProductTabs product={product} />
            
            {/* Recently Viewed Products - shows below tabs */}
            <div className="my-8">
              <RecentlyViewed excludeProductId={product.id} maxDisplay={6} />
            </div>
            
            {/* Help CTA for customer support */}
            <HelpCTA className="mb-8" />
            
            <RelatedProducts related={product.relatedProducts} />
            <AppLinks product={{ iosAppUrl: product.iosAppUrl, androidAppUrl: product.androidAppUrl }} />
            <ContactInfo />
          </div>
        </main>
        <footer className="border-t border-neutral-200 py-8 bg-white">
          <div className="container mx-auto px-4 text-center text-neutral-600">
            <p>&copy; 2025 BAPI. All rights reserved.</p>
          </div>
        </footer>
      </div>
      <CartDrawer />
    </>
  );
}
