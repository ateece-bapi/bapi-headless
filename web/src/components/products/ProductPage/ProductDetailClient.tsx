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

  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="py-12">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[
                { label: "Products", href: "/products" },
                { label: product.name }
              ]}
            />
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
