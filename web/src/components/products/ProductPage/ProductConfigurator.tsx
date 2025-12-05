import React from 'react';

interface ProductConfiguratorProps {
  product: any;
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Configure Product</h2>
      {/* Placeholder for configuration UI */}
      <div className="bg-neutral-100 rounded p-4 text-neutral-500">Configuration options go here.</div>
    </section>
  );
}
