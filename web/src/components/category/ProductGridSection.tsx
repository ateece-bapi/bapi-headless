'use client';

import { Grid3x3Icon, ListIcon } from '@/lib/icons';
import ProductCard from '@/components/products/ProductCard';

interface Product {
  id: string;
  databaseId?: number | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
}

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'newest';
type ViewMode = 'grid' | 'list';

interface ProductGridSectionProps {
  products: Product[];
  totalCount: number;
  filteredCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  locale: string;
}

/**
 * ProductGridSection displays a grid of products with sorting and view mode controls.
 * Shows product count, sort dropdown, and grid/list view toggle.
 */
export default function ProductGridSection({
  products,
  totalCount,
  filteredCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  locale,
}: ProductGridSectionProps) {
  return (
    <div>
      {/* Results Header */}
      <div className="mb-6 flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-neutral-700">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden items-center gap-1 rounded-lg border border-neutral-300 p-1 sm:flex">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid3x3Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`rounded p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      {products.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
          <p className="text-lg font-medium text-neutral-900">No products match your filters</p>
          <p className="mt-2 text-sm text-neutral-600">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
              : 'space-y-4'
          }
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
