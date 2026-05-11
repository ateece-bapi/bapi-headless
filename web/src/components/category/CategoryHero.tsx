import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { ChevronRightIcon } from '@/lib/icons';
import Breadcrumbs from '@/components/products/ProductPage/Breadcrumbs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CategoryHeroProps {
  category: {
    name?: string | null;
    description?: string | null;
    image?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
    count?: number | null;
  };
  breadcrumbs: BreadcrumbItem[];
}

/**
 * CategoryHero displays the category header with breadcrumb navigation and category image.
 * Renders category name, product count, and optional category image.
 */
export default function CategoryHero({ category, breadcrumbs }: CategoryHeroProps) {
  return (
    <>
      {/* Breadcrumbs with Blue Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 border-b-4 border-accent-500">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} variant="gradient" />
          
          {/* Category Title */}
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">
              {category.name || 'Products'}
            </h1>
            {category.description && (
              <p className="mt-3 text-lg text-primary-100">{category.description}</p>
            )}
            {category.count !== null && category.count !== undefined && (
              <p className="mt-2 text-sm text-primary-200">
                {category.count} {category.count === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
