'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@/lib/icons';

interface SubcategoryCardProps {
  name: string;
  slug: string;
  count: number | null | undefined;
  description?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  categorySlug: string;
  locale: string;
}

/**
 * Subcategory card component that links to dedicated subcategory pages.
 * Displays subcategory image, name, product count, and description.
 */
export default function SubcategoryCard({
  name,
  slug,
  count,
  description,
  image,
  categorySlug,
  locale,
}: SubcategoryCardProps) {
  const productCount = count ?? 0;
  const imageUrl = image?.sourceUrl;
  const imageAlt = image?.altText || `${name} category`;

  return (
    <Link
      href={`/${locale}/products/${categorySlug}/${slug}`}
      className="group relative block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all  duration-300 hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {/* Image Section */}
      <div className="bg-linear-to-br relative aspect-4/3 w-full overflow-hidden from-neutral-50 to-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            quality={75}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-100">
            <svg
              className="h-16 w-16 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        )}

        {/* Product Count Badge */}
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-sm font-semibold text-neutral-700">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="relative mb-2 text-lg font-bold text-neutral-900 transition-colors">
          {name}
          {/* BAPI Yellow underline on hover */}
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
        </h3>

        {description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        )}

        {/* View Link */}
        <div className="inline-flex items-center gap-2 border-b-2 border-transparent pb-0.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3 group-hover:border-primary-600">
          <span>View Products</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
