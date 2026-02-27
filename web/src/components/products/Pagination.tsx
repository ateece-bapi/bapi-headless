'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

export function Pagination({ currentPage, totalPages, totalProducts }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');

    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    router.push(`?${params.toString()}`, { scroll: true });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      {/* Skip Link for Keyboard Users */}
      <a
        href="#product-results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-2xl focus:ring-4 focus:ring-primary-500/50 focus:outline-none"
      >
        Skip to product results
      </a>

      {/* Page Info */}
      <div className="text-sm text-neutral-600">
        Page <span className="font-bold text-primary-600">{currentPage}</span> of{' '}
        <span className="font-bold text-neutral-900">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-2" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-200 disabled:hover:text-neutral-700"
          aria-label="Previous page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-neutral-400">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`min-w-[2.5rem] rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-bapi-primary-gradient border-transparent text-white shadow-md'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-500 hover:text-primary-600'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-200 disabled:hover:text-neutral-700"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Jump to Page (for large page counts) */}
      {totalPages > 10 && (
        <div className="flex items-center gap-3 text-sm">
          <label htmlFor="jump-to-page" className="font-medium text-neutral-600">
            Jump to page:
          </label>
          <input
            id="jump-to-page"
            type="number"
            min={1}
            max={totalPages}
            placeholder={currentPage.toString()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.currentTarget.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-20 rounded-lg border-2 border-neutral-200 px-3 py-1.5 text-center transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      )}
    </div>
  );
}
