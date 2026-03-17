import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
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
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-neutral-400" aria-hidden="true" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-neutral-900" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-neutral-700 transition-colors hover:text-primary-500"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-50 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Content */}
            <div className="lg:col-span-8">
              <h1 className="mb-4 text-4xl font-bold text-neutral-900 lg:text-5xl">
                {category.name || 'Products'}
              </h1>
              {category.description && (
                <p className="mb-4 text-lg text-neutral-700">{category.description}</p>
              )}
              {category.count !== null && category.count !== undefined && (
                <div className="mt-4 text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-900">{category.count}</span>{' '}
                  {category.count === 1 ? 'product' : 'products'} available
                </div>
              )}
            </div>

            {/* Image */}
            {category.image?.sourceUrl && (
              <div className="lg:col-span-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={category.image.sourceUrl}
                    alt={category.image.altText || category.name || 'Product category'}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
