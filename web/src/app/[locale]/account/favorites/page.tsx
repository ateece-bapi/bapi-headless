'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { Link } from '@/lib/navigation';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, PackageIcon } from '@/lib/icons';
import logger from '@/lib/logger';
import FavoriteButton from '@/components/FavoriteButton';
import { ProductCardSkeleton } from '@/components/skeletons';
import { useTranslations } from 'next-intl';

interface Favorite {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  productPrice?: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const t = useTranslations('account.favorites');
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push(`/${locale}/sign-in`);
      return;
    }

    fetchFavorites();
  }, [user, isLoaded, router, locale]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      logger.error('Error fetching favorites', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = (isFavorited: boolean, productId: string) => {
    // Optimistically update UI by removing the item immediately
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((fav) => fav.productId !== productId));
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <section className="w-full border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
            <Link
              href="/account"
              className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('backToDashboard')}
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{t('title')}</h1>
          </div>
        </section>

        {/* Loading Skeletons */}
        <section className="w-full py-12">
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mb-6 h-7 w-40 animate-pulse rounded bg-neutral-200"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t('backToDashboard')}
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{t('title')}</h1>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          {favorites.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-50">
                <HeartIcon className="h-10 w-10 text-accent-500" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">{t('empty.title')}</h2>
              <p className="mx-auto mb-8 max-w-md text-neutral-700">
                {t('empty.description')}
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-md"
                >
                  {t('empty.browseProducts')}
                </Link>
              </div>
            </div>
          ) : (
            /* Products Grid */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900">
                  {favorites.length === 1
                    ? t('count.product', { count: favorites.length })
                    : t('count.products', { count: favorites.length })}
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:border-transparent hover:shadow-2xl"
                  >
                    {/* Gradient overlay on hover — matches ProductCard */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Favorite remove button — top-right overlay */}
                    <div className="absolute right-3 top-3 z-10">
                      <FavoriteButton
                        productId={favorite.productId}
                        productName={favorite.productName}
                        productSlug={favorite.productSlug}
                        productImage={favorite.productImage}
                        productPrice={favorite.productPrice}
                        size="sm"
                        variant="icon"
                        onToggle={(isFavorited) =>
                          handleFavoriteToggle(isFavorited, favorite.productId)
                        }
                      />
                    </div>

                    {/* Product image — matches ProductCard aspect ratio & contain */}
                    <Link href={`/product/${favorite.productSlug}`}>
                      <div className="relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white p-3">
                        {favorite.productImage ? (
                          <Image
                            src={favorite.productImage}
                            alt={favorite.productName}
                            fill
                            className="object-contain p-3 drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        ) : (
                          <PackageIcon className="h-20 w-20 text-gray-300" />
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="relative p-4">
                      <Link href={`/product/${favorite.productSlug}`}>
                        <h3 className="relative mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
                          {favorite.productName}
                          <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
                        </h3>
                      </Link>

                      {favorite.productPrice && (
                        <p className="mb-4 mt-3 text-lg font-bold text-primary-700">
                          {favorite.productPrice}
                        </p>
                      )}

                      <Link
                        href={`/product/${favorite.productSlug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3"
                      >
                        <span>{t('viewProduct')}</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
