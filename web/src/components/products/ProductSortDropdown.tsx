'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest';

interface SortConfig {
  value: SortOption;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortConfig[] = [
  { value: 'default', label: 'Default Order', icon: '⭐' },
  { value: 'price-asc', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-desc', label: 'Price: High to Low', icon: '💎' },
  { value: 'name-asc', label: 'Name: A to Z', icon: '🔤' },
  { value: 'name-desc', label: 'Name: Z to A', icon: '🔡' },
  { value: 'newest', label: 'Newest First', icon: '🆕' },
];

/**
 * Product Sort Dropdown Component
 *
 * Allows users to sort products by various criteria.
 * Updates URL search params to maintain sort state across navigation.
 */
export default function ProductSortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort = (searchParams?.get('sort') as SortOption) || 'default';
  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || 'Sort By';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSortChange = (sortValue: SortOption) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (sortValue === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname || ''}?${queryString}` : pathname || '';

    router.push(newUrl, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full min-w-[200px] items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>{currentLabel}</span>
        </span>
        <svg
          className={`ml-2 h-5 w-5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {SORT_OPTIONS.map((option) => {
              const isActive = currentSort === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-50 font-medium text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  } `}
                  role="menuitem"
                >
                  <span className="text-lg" aria-hidden="true">
                    {option.icon}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {isActive && (
                    <svg
                      className="h-5 w-5 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sort products based on the selected sort option
 * Call this function in your product list component
 */
export function sortProducts<
  T extends {
    name: string;
    price?: string | null;
    regularPrice?: string | null;
    date?: string | null;
  },
>(products: T[], sortOption: SortOption): T[] {
  const sorted = [...products];

  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price || a.regularPrice || '0');
        const priceB = parseFloat(b.price || b.regularPrice || '0');
        return priceA - priceB;
      });

    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price || a.regularPrice || '0');
        const priceB = parseFloat(b.price || b.regularPrice || '0');
        return priceB - priceA;
      });

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });

    case 'default':
    default:
      return sorted; // Return original order
  }
}
