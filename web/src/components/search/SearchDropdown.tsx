'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';

interface SearchProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string | null;
  shortDescription: string | null;
  image: {
    sourceUrl: string;
    altText: string | null;
  } | null;
  productCategories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
}

interface SearchDropdownProps {
  results: SearchProduct[];
  isLoading: boolean;
  isOpen: boolean;
  query: string;
  onSelect: (slug: string) => void;
  onViewAll: () => void;
  onClose: () => void;
}

export function SearchDropdown({
  results,
  isLoading,
  isOpen,
  query,
  onSelect,
  onViewAll,
  onClose,
}: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex === results.length) {
            onViewAll();
          } else if (results[selectedIndex]) {
            onSelect(results[selectedIndex].slug);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, onSelect, onViewAll, onClose]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-neutral-200 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          <span className="ml-3 text-neutral-600">Searching...</span>
        </div>
      )}

      {!isLoading && results.length === 0 && query.length >= 2 && (
        <div className="py-8 text-center">
          <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 font-medium">No products found for "{query}"</p>
          <p className="text-sm text-neutral-500 mt-1">Try different keywords or browse categories</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <>
          <div className="py-2">
            {results.map((product, index) => {
              const category = product.productCategories?.nodes?.[0];
              
              return (
                <button
                  key={product.id}
                  onClick={() => {
                    setIsNavigating(true);
                    onSelect(product.slug);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  disabled={isNavigating}
                  className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-200 ${
                    isNavigating 
                      ? 'cursor-wait opacity-60'
                      : 'cursor-pointer'
                  } ${
                    selectedIndex === index
                      ? 'bg-primary-50 border-l-4 border-primary-500 shadow-sm'
                      : 'hover:bg-neutral-50 border-l-4 border-transparent'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  {product.image && (
                    <div className="relative w-12 h-12 flex-shrink-0 bg-neutral-100 rounded overflow-hidden group-hover:shadow-md transition-shadow">
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.image.altText || product.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <h4 className={`font-semibold truncate transition-colors ${
                      selectedIndex === index ? 'text-primary-700' : 'text-neutral-900'
                    }`}>
                      {product.name}
                    </h4>
                    {category && (
                      <p className="text-xs text-neutral-500 mt-0.5">{category.name}</p>
                    )}
                  </div>
                  {product.price && (
                    <div className={`font-bold text-sm whitespace-nowrap transition-colors ${
                      selectedIndex === index ? 'text-primary-600' : 'text-primary-500'
                    }`}>
                      {product.price}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setIsNavigating(true);
              onViewAll();
            }}
            onMouseEnter={() => setSelectedIndex(results.length)}
            disabled={isNavigating}
            className={`w-full flex items-center justify-center gap-2 px-4 py-4 border-t border-neutral-200 font-semibold text-sm transition-all duration-200 ${
              isNavigating 
                ? 'bg-primary-600 text-white cursor-wait'
                : selectedIndex === results.length
                  ? 'bg-primary-600 text-white shadow-md cursor-pointer'
                  : 'bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 cursor-pointer'
            }`}
            role="option"
            aria-selected={selectedIndex === results.length}
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading results...</span>
              </>
            ) : (
              <>
                <span>View all results for "{query}"</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${
                  selectedIndex === results.length ? 'translate-x-1' : ''
                }`} />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
