import React from 'react';

interface AppLinksProps {
  product?: { iosAppUrl?: string; androidAppUrl?: string };
}

export default function AppLinks({ product }: AppLinksProps) {
  if (!product?.iosAppUrl && !product?.androidAppUrl) return null;
  return (
    <div className="my-6 flex gap-4">
      {product.iosAppUrl && (
        <a
          href={product.iosAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
        >
          Download iOS App
        </a>
      )}
      {product.androidAppUrl && (
        <a
          href={product.androidAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Download Android App
        </a>
      )}
    </div>
  );
}
