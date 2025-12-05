import React from 'react';

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <section className="mb-8">
      <div className="border-b border-neutral-200 mb-4">
        <nav className="flex gap-4">
          <button className="text-primary-700 font-semibold border-b-2 border-primary-700 pb-2">Description</button>
          <button className="text-neutral-500 font-semibold pb-2">Documents</button>
          <button className="text-neutral-500 font-semibold pb-2">Videos</button>
        </nav>
      </div>
      <div className="text-neutral-700">
        {/* Placeholder for tab content */}
        {product.description || 'No description available.'}
      </div>
    </section>
  );
}
