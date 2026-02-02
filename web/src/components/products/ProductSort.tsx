'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

interface ProductSortProps {
  totalProducts: number;
}

type SortOption = {
  value: string;
  label: string;
  icon: ReactNode;
};

const sortOptions: SortOption[] = [
  {
    value: 'default',
    label: 'Default',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    ),
  },
  {
    value: 'name-asc',
    label: 'Name: A-Z',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
    ),
  },
  {
    value: 'name-desc',
    label: 'Name: Z-A',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
        />
      </svg>
    ),
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function ProductSort({ totalProducts }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'default';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    // Reset to page 1 when sorting changes
    params.delete('page');
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
      {/* Product Count */}
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <svg
          className="w-5 h-5 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <span className="font-medium">
          Showing <span className="text-primary-600 font-bold">{totalProducts}</span>{' '}
          {totalProducts === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="text-sm font-medium text-neutral-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 pr-10 bg-white border-2 border-neutral-200 hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg text-sm font-medium text-neutral-900 cursor-pointer transition-all duration-200"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
