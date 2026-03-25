'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon, AwardIcon } from '@/lib/icons';

interface ProductCategory {
  nameKey: string;
  slug: string;
  count: number;
  image: string;
  icon: string;
}

interface ProductCategoryGridProps {
  categories: ProductCategory[];
  locale: string;
}

/**
 * Client component for animated product category grid
 * Separated from main page to enable server-side rendering of hero section for better LCP
 */
export function ProductCategoryGrid({ categories, locale }: ProductCategoryGridProps) {
  const t = useTranslations();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Staggered card animation
    const timeout = setTimeout(() => setShowCards(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((cat, i) => {
        return (
          <Link
            key={cat.slug}
            href={`/${locale}/categories/${cat.slug}`}
            className={`group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:border-primary-200 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} `}
            style={{
              transitionDelay: showCards ? `${i * 75}ms` : '0ms',
            }}
            aria-label={t('productsPage.categories.viewCategoryLabel', {
              name: t(`productsPage.categories.${cat.nameKey}.name`),
              count: cat.count,
            })}
          >
            {/* Product Image */}
            <div className="bg-linear-to-br relative flex aspect-square w-full items-center justify-center overflow-hidden from-gray-50 to-white p-10">
              <Image
                src={cat.image}
                alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} product category`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Product Count Badge */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                <AwardIcon className="h-3.5 w-3.5" />
                {cat.count}
              </div>
            </div>

            {/* Category Info */}
            <div className="border-t border-gray-100 bg-linear-to-b from-white to-gray-50 p-6">
              <h3 className="mb-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
                {t(`productsPage.categories.${cat.nameKey}.name`)}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                {t(`productsPage.categories.${cat.nameKey}.description`)}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 transition-all group-hover:gap-3">
                {t('productsPage.categories.common.exploreButton')}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
