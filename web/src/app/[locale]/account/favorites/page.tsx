'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
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
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
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
      setFavorites(prev => prev.filter(fav => fav.productId !== productId));
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        {/* Header */}
        <section className="w-full bg-white border-b border-neutral-200">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
              Saved Products
            </h1>
          </div>
        </section>

        {/* Loading Skeletons */}
        <section className="w-full py-12">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="h-7 bg-neutral-200 rounded w-40 mb-6 animate-pulse"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
            Saved Products
          </h1>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {favorites.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-accent-500" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                No Saved Products Yet
              </h2>
              <p className="text-neutral-600 max-w-md mx-auto mb-8">
                Start saving your favorite products to quickly access them later. 
                Click the heart icon on any product page to add it to your favorites.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                >
                  Browse Products
                </Link>
                <Link
                  href="/test-favorites"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold rounded-lg transition-all duration-300"
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link href={`/en/product/${favorite.productSlug}`}>
                      {favorite.productImage ? (
                        <div className="aspect-square bg-neutral-100 overflow-hidden">
                          <img
                            src={favorite.productImage}
                            alt={favorite.productName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                          <div className="text-neutral-400 text-sm">No image</div>
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/en/product/${favorite.productSlug}`}>
                        <h3 className="font-bold text-neutral-900 mb-2 hover:text-primary-600 transition-colors">
                          {favorite.productName}
                        </h3>
                      </Link>
                      <p className="text-sm text-neutral-600 mb-3">
                        ID: {favorite.productId}
                      </p>
                      {favorite.productPrice && (
                        <p className="text-lg font-bold text-primary-600 mb-4">
                          {favorite.productPrice}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Link
                          href={`/en/product/${favorite.productSlug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-colors"
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
                            onToggle={(isFavorited) => handleFavoriteToggle(isFavorited, favorite.productId)}
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
