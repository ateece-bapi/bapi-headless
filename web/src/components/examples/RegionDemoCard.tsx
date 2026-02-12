'use client';

import React from 'react';
import { useRegion } from '@/store/regionStore';
import { formatConvertedPrice, formatPriceRange } from '@/lib/utils/currency';
import { formatDate, formatMeasurement, formatNumber } from '@/lib/utils/locale';

/**
 * Example component demonstrating region-aware pricing and formatting
 */
export const RegionDemoCard: React.FC = () => {
  const region = useRegion();

  // Example product price in USD (base currency)
  const productPriceUSD = 149.99;
  const priceRangeMinUSD = 99.99;
  const priceRangeMaxUSD = 299.99;

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="text-2xl">{region.flag}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
          <p className="text-sm text-gray-500">
            Currency: {region.currency} • Language: {region.language.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">💰 Product Price</h4>
          <p className="text-2xl font-bold text-primary-600">
            {formatConvertedPrice(productPriceUSD, region.currency)}
          </p>
          <p className="text-xs text-gray-500">Original: ${productPriceUSD} USD</p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">📊 Price Range</h4>
          <p className="text-lg font-semibold text-gray-800">
            {formatPriceRange(priceRangeMinUSD, priceRangeMaxUSD, region.currency)}
          </p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">📅 Today's Date</h4>
          <p className="text-lg text-gray-800">{formatDate(new Date(), region.language)}</p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">🌡️ Temperature Range</h4>
          <p className="text-lg text-gray-800">
            {formatMeasurement(20, 'celsius', region.language)} to{' '}
            {formatMeasurement(30, 'celsius', region.language)}
          </p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">📏 Dimensions</h4>
          <p className="text-lg text-gray-800">
            {formatMeasurement(2.5, 'meters', region.language)} x{' '}
            {formatMeasurement(1.5, 'meters', region.language)}
          </p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">🔢 Large Numbers</h4>
          <p className="text-lg text-gray-800">{formatNumber(1234567.89, region.language)}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-gray-500">
          💡 Tip: Change the region selector in the header to see different formats
        </p>
      </div>
    </div>
  );
};

export default RegionDemoCard;
