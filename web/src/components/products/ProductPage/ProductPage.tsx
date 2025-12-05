import React from 'react';
import ProductHero from './ProductHero';
import ProductConfigurator from './ProductConfigurator';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import AppLinks from './AppLinks';
import ContactInfo from './ContactInfo';

interface ProductPageProps {
  product: any;
  relatedProducts?: any[];
  appLinks?: { iosUrl?: string; androidUrl?: string };
}

// Main orchestrator for product detail page
export default function ProductPage({ product, relatedProducts = [], appLinks }: ProductPageProps) {
  return (
    <div className="bg-white min-h-screen">
      <ProductHero product={product} />
      <ProductConfigurator product={product} />
      <ProductTabs product={product} />
      {appLinks && (appLinks.iosUrl || appLinks.androidUrl) && <AppLinks {...appLinks} />}
      <RelatedProducts related={relatedProducts} />
      <ContactInfo />
    </div>
  );
}
