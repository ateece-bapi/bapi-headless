'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import logger from '@/lib/logger';
import FavoriteButton from '@/components/FavoriteButton';
import { ProductCardSkeleton } from '@/components/skeletons';

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
  }, [user, isLoaded, router]);

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
      <main className="min-h-screen bg-neutral-50">
        {/* Header */}
        <section className="w-full border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
            <Link
              href="/account"
              className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">Saved Products</h1>
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
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">Saved Products</h1>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          {favorites.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-50">
                <Heart className="h-10 w-10 text-accent-500" strokeWidth={2} />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">No Saved Products Yet</h2>
              <p className="mx-auto mb-8 max-w-md text-neutral-600">
                Start saving your favorite products to quickly access them later. Click the heart
                icon on any product page to add it to your favorites.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent-600 hover:shadow-md"
                >
                  Browse Products
                </Link>
                <Link
                  href="/test-favorites"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-6 py-3 font-bold text-primary-600 transition-all duration-300 hover:bg-primary-50"
                >
                  Test Favorites
                </Link>
              </div>
            </div>
          ) : (
            /* Products Grid */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900">
                  {favorites.length} {favorites.length === 1 ? 'Product' : 'Products'} Saved
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Link href={`/en/product/${favorite.productSlug}`}>
                      {favorite.productImage ? (
                        <div className="aspect-square overflow-hidden bg-neutral-100">
                          <img
                            src={favorite.productImage}
                            alt={favorite.productName}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-square items-center justify-center bg-neutral-100">
                          <div className="text-sm text-neutral-400">No image</div>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/en/product/${favorite.productSlug}`}>
                        <h3 className="mb-2 font-bold text-neutral-900 transition-colors hover:text-primary-600">
                          {favorite.productName}
                        </h3>
                      </Link>
                      <p className="mb-3 text-sm text-neutral-600">ID: {favorite.productId}</p>
                      {favorite.productPrice && (
                        <p className="mb-4 text-lg font-bold text-primary-600">
                          {favorite.productPrice}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Link
                          href={`/en/product/${favorite.productSlug}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                        >
                          View Product
                        </Link>
                        <div className="flex-shrink-0">
                          <FavoriteButton
                            productId={favorite.productId}
                            productName={favorite.productName}
                            productSlug={favorite.productSlug}
                            productImage={favorite.productImage}
                            productPrice={favorite.productPrice}
                            size="md"
                            variant="icon"
                            onToggle={(isFavorited) =>
                              handleFavoriteToggle(isFavorited, favorite.productId)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
