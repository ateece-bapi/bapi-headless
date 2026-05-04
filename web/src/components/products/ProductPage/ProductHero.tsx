'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ZoomInIcon, DownloadIcon } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import TrustBadges from './TrustBadges';

// Lazy load ImageModal for better initial page load performance
const ImageModal = dynamic(() => import('@/components/ui/ImageModal'), {
  ssr: false, // Modal only renders client-side
});

interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductHeroProps {
  product: {
    name: string;
    image?: GalleryImage | null;
    gallery?: GalleryImage[];
    partNumber?: string | null;
    sku?: string | null;
    shortDescription?: string | null;
    description?: string | null;
  };
  variation?: {
    image?: GalleryImage | null;
    name?: string;
  } | null;
  onConfigureClick?: () => void;
}

/**
 * Product hero section with full-width blue banner, description bullets, and action buttons.
 * Matches UI/UX design with image gallery, product description, and prominent CTAs.
 *
 * **Phase 1 Priority**: Product Navigation (breadcrumbs, categories, mega-menu integration)
 *
 * @param {ProductHeroProps} props - Product and variation data
 * @returns {JSX.Element} Product hero section with image modal
 */
export default function ProductHero({ product, variation, onConfigureClick }: ProductHeroProps) {
  const t = useTranslations();

  // Prefer variation image if present, else product image
  const initialImage = variation?.image || product.image || null;
  const [mainImage, setMainImage] = useState<GalleryImage | null>(initialImage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gallery = product.gallery || [];

  // If variation changes, update mainImage to variation image
  React.useEffect(() => {
    setMainImage(variation?.image || product.image || null);
  }, [variation, product.image]);

  // Parse description for bullet points
  const description = product.description || product.shortDescription || '';
  const getBulletPoints = (html: string): string[] => {
    if (!html) return [];
    
    // First try to extract from <li> tags
    const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (liMatches && liMatches.length > 0) {
      return liMatches.map(li => li.replace(/<[^>]+>/g, '').trim()).slice(0, 4);
    }
    
    // Fallback: split by periods or line breaks and create bullets from sentences
    const textContent = html.replace(/<[^>]+>/g, '').trim();
    const sentences = textContent
      .split(/\.\s+/)
      .filter(s => s.trim().length > 20 && s.trim().length < 150)
      .slice(0, 4);
    
    return sentences.length > 0 ? sentences.map(s => s.trim() + '.') : [];
  };
  
  const bulletPoints = getBulletPoints(description);
  const descriptionText = description.replace(/<[^>]+>/g, '').trim();
  const mainDescription = descriptionText.split('\n')[0].split('.').slice(0, 2).join('.') + (descriptionText.includes('.') ? '.' : '');

  const scrollToConfigurator = () => {
    if (onConfigureClick) {
      onConfigureClick();
    } else {
      const configurator = document.querySelector('[data-product-configurator]');
      if (configurator) {
        const elementPosition = configurator.getBoundingClientRect().top + window.scrollY;
        const offset = 100;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    }
  };

  const scrollToDocuments = () => {
    const documentsTab = document.querySelector('#documents');
    if (documentsTab) {
      const elementPosition = documentsTab.getBoundingClientRect().top + window.scrollY;
      const offset = 120; // Adjust offset to not scroll too far
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      
      // Click the Documents tab to activate it
      setTimeout(() => {
        const documentsButton = document.querySelector('[data-tab-id="documents"]');
        if (documentsButton instanceof HTMLElement) {
          documentsButton.click();
        }
      }, 300);
    }
  };

  return (
    <>
      {/* Full-width blue hero banner */}
      <section className="bg-primary-500 py-6 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Product details section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column: Image gallery (5 columns) */}
          <div className="order-1 lg:order-1 lg:col-span-5">
            <div className="flex flex-col items-center">
              {/* Main product image */}
              {mainImage ? (
                <div className="group relative mb-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative block h-64 w-64 cursor-zoom-in overflow-hidden rounded-lg bg-neutral-50 shadow-md transition-shadow hover:shadow-lg md:h-80 md:w-80"
                    aria-label="Click to enlarge product image"
                  >
                    <Image
                      src={mainImage.sourceUrl}
                      alt={mainImage.altText || variation?.name || product.name}
                      fill
                      sizes="(max-width: 768px) 256px, 320px"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                      <div className="rounded-full bg-white/90 p-2.5 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomInIcon className="h-5 w-5 text-primary-500" />
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="mb-4 flex h-64 w-64 items-center justify-center rounded-lg bg-neutral-100 text-lg font-semibold text-neutral-400 shadow-md md:h-80 md:w-80">
                  No image
                </div>
              )}

              {/* Gallery thumbnails */}
              {gallery.length > 1 && (
                <div className="flex justify-center gap-2">
                  {gallery.slice(0, 4).map((img, idx) => (
                    <button
                      key={img.sourceUrl + idx}
                      onClick={() => setMainImage(img)}
                      className={`relative h-16 w-16 overflow-hidden rounded border-2 bg-white p-1 transition-all ${
                        mainImage?.sourceUrl === img.sourceUrl
                          ? 'border-primary-500 shadow-md'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                      aria-label={`View thumbnail ${idx + 1}`}
                    >
                      <Image
                        src={img.sourceUrl}
                        alt="Product thumbnail"
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Right column: Description (7 columns) */}
          <div className="order-2 lg:order-2 lg:col-span-7">
            {descriptionText && (
              <div className="mb-6">
                <p className="mb-4 text-base leading-relaxed text-neutral-700">
                  {mainDescription}
                </p>
                
                {bulletPoints.length > 0 && (
                  <ul className="space-y-3">
                    {bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-neutral-700">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></span>
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Configure Product Card with buttons inside */}
            <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary-50 p-4">
                  <svg className="h-12 w-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold text-neutral-900">Configure Product</h2>
              <p className="mb-6 text-sm text-neutral-600">
                Select your specifications below to see pricing and part number
              </p>
              
              {/* Action buttons inside card */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={scrollToConfigurator}
                  className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-semibold text-neutral-900 shadow-md transition-all hover:bg-accent-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                >
                  Start Configuring
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={scrollToDocuments}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                >
                  <DownloadIcon className="h-5 w-5" />
                  Download Documents
                </button>
              </div>
            </div>
          </div>        </div>
      </section>

      {/* Image Modal */}
      {mainImage && isModalOpen && (
        <ImageModal
          onClose={() => setIsModalOpen(false)}
          src={mainImage.sourceUrl}
          alt={mainImage.altText || variation?.name || product.name}
        />
      )}
    </>
  );
}
