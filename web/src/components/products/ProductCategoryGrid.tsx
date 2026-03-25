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
                className="object-contain p-8 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Icon Badge - BAPI Brand Icons */}
              <div className="bg-linear-to-br absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-2xl from-primary-700 to-primary-600 shadow-lg">
                <Image
                  src={cat.icon}
                  alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} icon`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              {/* Product Count Badge */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                <AwardIcon className="h-3.5 w-3.5" />
                {cat.count}
              </div>
            </div>

            {/* Category Info */}
            <div className="relative border-t border-gray-100 bg-linear-to-b from-white to-gray-50 p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="relative text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-primary-600">
                  {t(`productsPage.categories.${cat.nameKey}.name`)}
                  {/* BAPI Yellow underline on hover */}
                  <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
                </h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                {t(`productsPage.categories.${cat.nameKey}.description`)}
              </p>
              {/* View Link - Animated border on hover */}
              <div className="inline-flex items-center gap-2 border-b-2 border-transparent pb-0.5 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3 group-hover:border-primary-600">
                <span>{t('productsPage.categories.common.exploreButton')}</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
