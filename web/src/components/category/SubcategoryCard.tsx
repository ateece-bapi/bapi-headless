'use client';

import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { ArrowRightIcon } from '@/lib/icons';
import { getCategoryIcon, getCategoryIconName } from '@/lib/constants/category-icons';

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
      href={`/products/${categorySlug}/${slug}`}
      className="group relative block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all  duration-300 hover:border-primary-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {/* Image Section */}
      <div className="bg-linear-to-br relative aspect-[3/2] w-full overflow-hidden from-neutral-50 to-white">
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
          <div className="bg-linear-to-br flex h-full items-center justify-center from-primary-50 to-primary-100">
            <Image
              src={getCategoryIcon(categorySlug)}
              alt={`${getCategoryIconName(categorySlug)} icon`}
              width={96}
              height={96}
              className="object-contain opacity-40"
            />
          </div>
        )}

        {/* BAPI Category Icon Badge - Replaces product count */}
        <div className="bg-linear-to-br absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-xl from-primary-700 to-primary-600 shadow-lg transition-all duration-300 group-hover:shadow-xl">
          <Image
            src={getCategoryIcon(categorySlug)}
            alt={`${getCategoryIconName(categorySlug)} icon`}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
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
