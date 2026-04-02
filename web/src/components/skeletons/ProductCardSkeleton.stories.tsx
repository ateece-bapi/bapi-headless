/**
 * ProductCardSkeleton Storybook Stories
 *
 * Loading skeleton for product cards during data fetch or lazy loading.
 *
 * **Component Features:**
 * - Pulse animation effect
 * - Matches ProductCard aspect ratio (3:2 image + content)
 * - Accessible loading state with sr-only text
 * - Light gray placeholders for image, title, description, price, button
 * - Neutral color scheme (neutral-200 backgrounds)
 *
 * **Usage Context:**
 * - Product grid initial load
 * - Infinite scroll pagination
 * - Search result updates
 * - Filter application
 *
 * **Story Coverage:**
 * - Default: Single skeleton
 * - Grid: 4-skeleton grid matching product layout
 * - GridLarge: 8-skeleton grid for initial page load
 * - Mobile: Single column mobile view
 * - Tablet: 2-column tablet layout
 * - Desktop: 4-column desktop layout
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProductCardSkeleton from './ProductCardSkeleton';

const meta: Meta<typeof ProductCardSkeleton> = {
  title: 'Components/Skeletons/ProductCardSkeleton',
  component: ProductCardSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading skeleton for product cards. Displays during data fetching to provide visual feedback. Uses pulse animation with accessible loading announcement.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Skeleton
// ============================================================================

/**
 * Default loading skeleton - single card
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Single product card skeleton with pulse animation. Accessible via sr-only "Loading..." text for screen readers.',
      },
    },
  },
};

// ============================================================================
// Grid Layouts
// ============================================================================

/**
 * 4-card grid - typical pagination skeleton
 */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Grid of 4 loading skeletons. Used when loading next page of results or after filter changes.',
      },
    },
  },
};

/**
 * 8-card grid - initial page load
 */
export const GridLarge: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Grid of 8 skeletons matching initial product page load. Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop.',
      },
    },
  },
};

/**
 * 12-card grid - full page skeleton
 */
export const GridFullPage: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Full product grid skeleton (12 cards). Matches ProductGrid responsive breakpoints: 1 col mobile → 2 col tablet → 3/4/5 col desktop.',
      },
    },
  },
};

// ============================================================================
// Responsive Layouts
// ============================================================================

/**
 * Mobile view - single column
 */
export const Mobile: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-mobile-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'padded',
    docs: {
      description: {
        story:
          'Mobile viewport (375px). Skeletons stack vertically with full width. Used during mobile product browsing.',
      },
    },
  },
};

/**
 * Tablet view - 2 columns
 */
export const Tablet: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-tablet-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    layout: 'padded',
    docs: {
      description: {
        story: 'Tablet viewport (768px). 2-column grid layout matching sm: breakpoint.',
      },
    },
  },
};

/**
 * Desktop view - 4 columns
 */
export const Desktop: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-desktop-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout: 'padded',
    docs: {
      description: {
        story: 'Desktop viewport (1200px). 4-column grid matching lg: breakpoint.',
      },
    },
  },
};

/**
 * Wide desktop view - 5 columns
 */
export const WideDesktop: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <ProductCardSkeleton key={`skeleton-wide-${i}`} />
      ))}
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Wide desktop viewport (1536px+). 5-column grid matching 2xl: breakpoint. Used on ultra-wide displays.',
      },
    },
  },
};

// ============================================================================
// Mixed Content Scenarios
// ============================================================================

/**
 * Loading next page - mix of products and skeletons
 */
export const LoadingMoreProducts: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Existing products (represented by filled cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`product-${i}`}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            <div className="aspect-[3/2] bg-gradient-to-br from-primary-100 to-accent-100"></div>
            <div className="p-3">
              <div className="mb-2 text-sm font-semibold text-neutral-900">
                Product {i + 1}
              </div>
              <div className="mb-4 text-xs text-neutral-600">Loaded product</div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-primary-600">$199.00</div>
                <div className="rounded bg-primary-600 px-3 py-1 text-xs text-white">
                  View
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Infinite scroll scenario: Existing products above, loading skeletons below. Demonstrates pagination UX pattern.',
      },
    },
  },
};

/**
 * Search filter update - replacing content
 */
export const FilterUpdate: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Filter bar mockup */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200"></div>
          <div className="h-8 w-24 animate-pulse rounded bg-neutral-200"></div>
          <div className="h-8 w-28 animate-pulse rounded bg-neutral-200"></div>
        </div>
      </div>

      {/* Loading results */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Filter change scenario: Filter bar above with loading skeletons replacing previous results. Full grid replacement UX.',
      },
    },
  },
};
