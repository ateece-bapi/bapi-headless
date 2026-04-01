'use client';

import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from '@/lib/icons';

interface ProductCategory {
  nameKey: string;
  slug: string;
  count: number;
  image: string;
  icon: string;
}

interface ProductCategoryGridProps {
  categories: ProductCategory[];
}

/**
 * Client component for animated product category grid
 * Separated from main page to enable server-side rendering of hero section for better LCP
 */
export function ProductCategoryGrid({ categories }: ProductCategoryGridProps) {
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
            href={`/products/${cat.slug}`}
            className={`group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:border-primary-200 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${showCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} `}
            style={{
              transitionDelay: showCards ? `${i * 75}ms` : '0ms',
            }}
            aria-label={t('productsPage.categories.viewCategoryLabel', {
              name: t(`productsPage.categories.${cat.nameKey}.name`),
            })}
          >
            {/* Product Image */}
            <div className="bg-linear-to-br relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden from-gray-50 to-white p-4">
              <Image
                src={cat.image}
                alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} product category`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-contain p-3 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Icon Badge - BAPI Brand Icons with optimal proportions */}
              <div className="bg-linear-to-br absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-xl from-primary-700 to-primary-600 shadow-lg transition-all duration-300 group-hover:shadow-xl md:h-16 md:w-16">
                <Image
                  src={cat.icon}
                  alt={`${t(`productsPage.categories.${cat.nameKey}.name`)} icon`}
                  width={32}
                  height={32}
                  className="object-contain md:h-10 md:w-10"
                />
              </div>
            </div>

            {/* Category Info */}
            <div className="relative border-t border-gray-100 bg-linear-to-b from-white to-gray-50 p-3">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="relative text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-primary-600">
                  {t(`productsPage.categories.${cat.nameKey}.name`)}
                  {/* BAPI Yellow underline on hover */}
                  <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
                </h3>
              </div>
              <p className="mb-6 text-sm leading-loose text-neutral-600">
                {t(`productsPage.categories.${cat.nameKey}.description`)}
              </p>
              {/* View Link - Enhanced CTA with animated border */}
              <div className="inline-flex items-center gap-2 border-b-2 border-transparent pb-1 text-base font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3 group-hover:border-primary-600">
                <span>{t('productsPage.categories.common.exploreButton')}</span>
                <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
