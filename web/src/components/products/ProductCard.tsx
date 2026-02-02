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
      href={`/${locale}/products/${slug}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent relative focus:outline-none focus:ring-2 focus:ring-primary-500"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6 overflow-hidden">
        {image?.sourceUrl ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            quality={85}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Package className="w-20 h-20 text-gray-300" />
          </div>
        )}
        
        {/* Part Number Badge */}
        {partNumber && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
              {partNumber}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6">
        <h3 className="relative text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors duration-300">
          {name}
          {/* BAPI Yellow underline on hover */}
          <span className="absolute left-0 -bottom-1 h-1 w-0 bg-accent-500 rounded transition-all duration-300 ease-in-out group-hover:w-full" />
        </h3>

        {cleanDescription && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {cleanDescription}
          </p>
        )}

        {/* Price */}
        {price && (
          <div className="mb-4">
            <span className="text-lg font-bold text-primary-700">
              {price}
            </span>
          </div>
        )}

        {/* View Details Link */}
        <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}
