import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  partNumber?: string | null;
  price?: string | null;
  image?: {
    sourceUrl: string;
    altText?: string | null;
  } | null;
  shortDescription?: string | null;
  index?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  partNumber,
  price,
  image,
  shortDescription,
  index = 0,
}: ProductCardProps) {
  // Get locale from params
  const locale = 'en'; // Default to 'en' - component should receive this as prop if needed

  // Strip HTML from short description
  const cleanDescription = shortDescription
    ? shortDescription.replace(/<[^>]*>/g, '').slice(0, 120)
    : '';

  return (
    <Link
      href={`/${locale}/product/${slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:border-transparent hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Product Image */}
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6">
        {image?.sourceUrl ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || name}
            fill
            className="object-contain p-4 drop-shadow-md transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            quality={85}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-20 w-20 text-gray-300" />
          </div>
        )}

        {/* Part Number Badge */}
        {partNumber && (
          <div className="absolute right-4 top-4 rounded-lg border border-gray-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-primary-700">
              {partNumber}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6">
        <h3 className="relative mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
          {name}
          {/* BAPI Yellow underline on hover */}
          <span className="absolute -bottom-1 left-0 h-1 w-0 rounded bg-accent-500 transition-all duration-300 ease-in-out group-hover:w-full" />
        </h3>

        {cleanDescription && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {cleanDescription}
          </p>
        )}

        {/* Price */}
        {price && (
          <div className="mb-4">
            <span className="text-lg font-bold text-primary-700">{price}</span>
          </div>
        )}

        {/* View Details Link */}
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-all duration-300 group-hover:gap-3">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-gray-50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Link>
  );
}
