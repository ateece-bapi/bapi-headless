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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex items-center gap-2 pb-4 border-b">
        <span className="text-2xl">{region.flag}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {region.name}
          </h3>
          <p className="text-sm text-gray-500">
            Currency: {region.currency} • Language: {region.language.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">💰 Product Price</h4>
          <p className="text-2xl font-bold text-primary-600">
            {formatConvertedPrice(productPriceUSD, region.currency)}
          </p>
          <p className="text-xs text-gray-500">
            Original: ${productPriceUSD} USD
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">📊 Price Range</h4>
          <p className="text-lg font-semibold text-gray-800">
            {formatPriceRange(priceRangeMinUSD, priceRangeMaxUSD, region.currency)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">📅 Today's Date</h4>
          <p className="text-lg text-gray-800">
            {formatDate(new Date(), region.language)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">🌡️ Temperature Range</h4>
          <p className="text-lg text-gray-800">
            {formatMeasurement(20, 'celsius', region.language)} to{' '}
            {formatMeasurement(30, 'celsius', region.language)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">📏 Dimensions</h4>
          <p className="text-lg text-gray-800">
            {formatMeasurement(2.5, 'meters', region.language)} x{' '}
            {formatMeasurement(1.5, 'meters', region.language)}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">🔢 Large Numbers</h4>
          <p className="text-lg text-gray-800">
            {formatNumber(1234567.89, region.language)}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500">
          💡 Tip: Change the region selector in the header to see different formats
        </p>
      </div>
    </div>
  );
};

export default RegionDemoCard;
