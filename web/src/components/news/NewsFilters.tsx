'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, XIcon, SlidersHorizontalIcon } from '@/lib/icons';
import { useNewsStore } from '@/store/news';

interface NewsFiltersProps {
  categories: { name: string; slug: string; count: number }[];
  onFilterChange?: () => void;
}

export default function NewsFilters({ categories, onFilterChange }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { filters, setCategory, setSearchQuery, clearFilters } = useNewsStore();
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);

  // Sync URL params with store on mount
  useEffect(() => {
    if (!searchParams) return;
    
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('q');
    
    if (categoryParam && categoryParam !== filters.category) {
      setCategory(categoryParam);
    }
    if (searchParam && searchParam !== filters.searchQuery) {
      setSearchQuery(searchParam);
      setLocalSearch(searchParam);
    }
  }, [searchParams, filters.category, filters.searchQuery, setCategory, setSearchQuery]);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.searchQuery) {
        setSearchQuery(localSearch);
        updateURLParams({ q: localSearch || null });
        onFilterChange?.();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, filters.searchQuery, setSearchQuery, onFilterChange]);

  const updateURLParams = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';

    startTransition(() => {
      router.push(`${window.location.pathname}${query}`, { scroll: false });
    });
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setCategory(categorySlug);
    updateURLParams({ category: categorySlug });
    onFilterChange?.();
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalSearch('');
    updateURLParams({ category: null, q: null });
    onFilterChange?.();
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) + (filters.searchQuery ? 1 : 0);

  return (
    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-neutral-900">Filter News</h2>
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
            aria-label="Clear all filters"
          >
            <XIcon className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="news-search" className="mb-2 block text-sm font-medium text-neutral-700">
          Search
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            id="news-search"
            type="text"
            placeholder="Search news by keywords..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-12 pr-4 text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            aria-label="Search news articles"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                setSearchQuery('');
                updateURLParams({ q: null });
                onFilterChange?.();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Clear search"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="mb-3 block text-sm font-medium text-neutral-700">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {/* All Categories */}
          <button
            onClick={() => handleCategoryChange(null)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filters.category === null
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            aria-pressed={filters.category === null}
            aria-label="Show all categories"
          >
            All
          </button>

          {/* Individual Categories */}
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryChange(category.slug)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                filters.category === category.slug
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              aria-pressed={filters.category === category.slug}
              aria-label={`Filter by ${category.name}`}
            >
              {category.name}
              <span className="ml-1.5 text-xs opacity-75">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500" />
          Updating results...
        </div>
      )}
    </div>
  );
}
