import React from 'react';
import { REGIONS } from '../config';

const RegionSelector: React.FC = () => (
  <div className="relative">
    <label htmlFor="region-select" className="sr-only">
      Select your region
    </label>
    <select
      id="region-select"
      className="appearance-none px-4 lg:px-5 py-2 pr-9 lg:pr-10 border border-neutral-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:border-neutral-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0054b6] focus:border-transparent transition-all cursor-pointer"
      aria-label="Select region"
      defaultValue=""
    >
      <option value="" disabled>
        Region
      </option>
      {REGIONS.map((region) => (
        <option key={region.value} value={region.value}>
          {region.label}
        </option>
      ))}
    </select>
    <svg
      className="absolute right-2.5 lg:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

export default RegionSelector;