'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import logger from '@/lib/logger';

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  productPrice?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  productId,
  productName,
  productSlug,
  productImage,
  productPrice,
  size = 'md',
  variant = 'icon',
  onToggle,
}: FavoriteButtonProps) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is already favorited on mount
  useEffect(() => {
    if (!user) return;

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          const favorited = data.favorites?.some(
            (fav: { productId: string }) => fav.productId === productId
          );
          setIsFavorited(favorited);
        }
      } catch (error) {
        logger.error('Error checking favorite status', error);
      }
    };

    checkFavoriteStatus();
  }, [user, productId]);

  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Redirect to sign-in if not authenticated
    if (!isLoaded || !user) {
      toast.info('Please sign in to save favorites');
      router.push(`/${locale}/sign-in`);
      return;
    }

    // Store previous state for rollback
    const previousState = isFavorited;

    // Optimistic update - update UI immediately
    setIsFavorited(!isFavorited);
    setIsLoading(true);

    // Show optimistic toast
    const toastId = toast.loading(
      previousState ? 'Removing from favorites...' : 'Adding to favorites...'
    );

    try {
      if (previousState) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?productId=${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove from favorites');
        }

        toast.success('Removed from favorites', { id: toastId });
        onToggle?.(false);
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            productName,
            productSlug,
            productImage,
            productPrice,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add to favorites');
        }

        toast.success('Added to favorites', { id: toastId });
        onToggle?.(true);
      }
    } catch (error) {
      logger.error('Error toggling favorite', error);

      // Rollback on error
      setIsFavorited(previousState);

      toast.error(
        previousState
          ? 'Failed to remove from favorites. Please try again.'
          : 'Failed to add to favorites. Please try again.',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={
          isFavorited ? `Remove ${productName} from favorites` : `Add ${productName} to favorites`
        }
        aria-pressed={isFavorited}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          isFavorited
            ? 'border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-2 border-neutral-300 bg-white text-neutral-600 hover:border-red-300 hover:text-red-600'
        }`}
      >
        <Heart
          className={iconSizes[size]}
          fill={isFavorited ? 'currentColor' : 'none'}
          strokeWidth={2.5}
        />
        {isFavorited ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={
        isFavorited ? `Remove ${productName} from favorites` : `Add ${productName} to favorites`
      }
      aria-pressed={isFavorited}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
        isFavorited
          ? 'border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-2 border-neutral-300 bg-white text-neutral-400 hover:border-red-300 hover:text-red-600'
      }`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={iconSizes[size]}
        fill={isFavorited ? 'currentColor' : 'none'}
        strokeWidth={2.5}
      />
    </button>
  );
}
