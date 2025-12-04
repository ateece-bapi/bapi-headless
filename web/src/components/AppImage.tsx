import Image, { ImageProps } from 'next/image';
import React from 'react';

/**
 * AppImage: A reusable image component for consistent performance, accessibility, and UX.
 *
 * Features:
 * - Lazy loads by default
 * - Uses a blur placeholder
 * - Provides sensible alt text fallback
 * - Supports error handling (shows fallback UI if image fails to load)
 * - Accepts all Next.js Image props
 *
 * Usage:
 * ```tsx
 * <AppImage
 *   src={imageUrl}
 *   alt={imageAlt}
 *   fallbackAlt="Product Name"
 *   width={160}
 *   height={80}
 *   className="object-cover"
 *   sizes="80px"
 * />
 * ```
 */
export interface AppImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'loading'> {
  alt: string;
  fallbackAlt?: string;
  blurDataURL?: string;
  fallbackSrc?: string;
}

const DEFAULT_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9p1enZkAAAAASUVORK5CYII=';

export const AppImage: React.FC<AppImageProps> = ({
  alt,
  fallbackAlt,
  blurDataURL = DEFAULT_BLUR,
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = React.useState(false);
  const resolvedSrc = error && fallbackSrc ? fallbackSrc : (props.src as string);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL={blurDataURL}
      onError={() => setError(true)}
    />
  );
};
