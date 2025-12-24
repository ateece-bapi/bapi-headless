"use client";

import React, { useState, useEffect } from "react";
import ProductHero from "@/components/products/ProductPage/ProductHero";
import ProductSummaryCard from "@/components/products/ProductPage/ProductSummaryCard";
import ProductConfigurator from "@/components/products/ProductPage/ProductConfigurator";
import ProductTabs from "@/components/products/ProductPage/ProductTabs";
import RelatedProducts from "@/components/products/ProductPage/RelatedProducts";
import AppLinks from "@/components/products/ProductPage/AppLinks";
import ContactInfo from "@/components/products/ProductPage/ContactInfo";
import Breadcrumbs from "@/components/products/ProductPage/Breadcrumbs";
import { CartDrawer } from "@/components/cart";

interface ProductDetailClientProps {
  product: any;
  useCart?: any;
  useCartDrawer?: any;
}

export default function ProductDetailClient({ product, useCart, useCartDrawer }: ProductDetailClientProps) {

  const [selectedVariation, setSelectedVariation] = useState<any>(null);

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
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
              <div className="flex-1">
                <ProductHero product={product} variation={selectedVariation} />
              </div>
              <ProductSummaryCard
                product={product}
                variation={selectedVariation}
                useCart={useCart}
                useCartDrawer={useCartDrawer}
              />
            </div>
            <ProductConfigurator
              product={product}
              onVariationChange={setSelectedVariation}
            />
            <ProductTabs product={product} />
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
