'use client';
import React from 'react';
import { DownloadIcon } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import TrustBadges from './TrustBadges';
import ProductGallery from '../ProductGallery';

interface GalleryImage {
  sourceUrl: string;
  altText?: string | null;
}

interface ProductVariation {
  id: string;
  image?: GalleryImage | null;
  name?: string;
  [key: string]: unknown;
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
    variations?: ProductVariation[];
    videos?: Array<{ url?: string; title?: string }>;
  };
  variation?: {
    id?: string;
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
 * **Multi-Variation Images**: Shows all variation-specific images in gallery, auto-selecting based on configuration
 *
 * @param {ProductHeroProps} props - Product and variation data
 * @returns {JSX.Element} Product hero section with advanced image gallery
 */
export default function ProductHero({ product, variation, onConfigureClick }: ProductHeroProps) {
  const t = useTranslations('productPage.summary');
  
  // Determine if product has variations (for conditional Configure card)
  const hasVariations = product.variations && product.variations.length > 0;

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

  // Build images array: featured image first, then gallery images
  const galleryImages = React.useMemo(() => {
    const images = [];
    // Add featured image first
    if (product.image) {
      images.push(product.image);
    }
    // Add gallery images (filter out duplicates)
    if (product.gallery) {
      const featuredUrl = product.image?.sourceUrl;
      product.gallery.forEach(img => {
        if (img.sourceUrl !== featuredUrl) {
          images.push(img);
        }
      });
    }
    return images;
  }, [product.image, product.gallery]);

  const scrollToConfigurator = () => {
    if (onConfigureClick) {
      onConfigureClick();
    } else {
      const configurator = document.querySelector('[data-product-configurator]');
      if (configurator) {
        // Check user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const elementPosition = configurator.getBoundingClientRect().top + window.scrollY;
        const offset = 100;
        
        window.scrollTo({ 
          top: elementPosition - offset, 
          behavior: prefersReducedMotion ? 'auto' : 'smooth' 
        });
        
        // Focus management for accessibility
        setTimeout(() => {
          if (configurator instanceof HTMLElement) {
            configurator.focus({ preventScroll: true });
          }
        }, prefersReducedMotion ? 0 : 300);
      }
    }
  };

  const scrollToDocuments = () => {
    const tabsSection = document.querySelector('#product-tabs');
    if (tabsSection) {
      // Check user's motion preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const elementPosition = tabsSection.getBoundingClientRect().top + window.scrollY;
      const offset = 120;
      
      window.scrollTo({ 
        top: elementPosition - offset, 
        behavior: prefersReducedMotion ? 'auto' : 'smooth' 
      });
      
      // Click the Documents tab to activate it
      setTimeout(() => {
        const documentsButton = document.querySelector('[data-tab-id="documents"]');
        if (documentsButton instanceof HTMLElement) {
          documentsButton.click();
          documentsButton.focus({ preventScroll: true });
        }
      }, prefersReducedMotion ? 0 : 300);
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
            <ProductGallery
              images={galleryImages}
              productName={product.name}
              variation={variation}
              variations={product.variations}
              hasVideos={!!(product.videos && product.videos.length > 0)}
            />
          </div>
          {/* Right column: Description (7 columns) */}
          <div className="order-2 lg:order-2 lg:col-span-7">
            {descriptionText && (
              <div className="mb-10">
                <p className="mb-4 text-base leading-relaxed text-neutral-700">
                  {mainDescription}
                </p>
                
                {bulletPoints.length > 0 && (
                  <ul className="space-y-3 pl-10">
                    {bulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3.5 text-neutral-700">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"></span>
                        <span className="text-base leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Configure Product Card - only show for variable products */}
            {hasVariations && (
              <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary-50 p-4">
                    <svg className="h-12 w-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">{t('configureProduct')}</h2>
                <p className="mb-6 text-sm text-neutral-600">
                  {t('selectSpecifications')}
                </p>
                
                {/* Action buttons inside card */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={scrollToConfigurator}
                    className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-semibold text-neutral-900 shadow-md transition-all hover:bg-accent-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-accent-500/50"
                    aria-label={t('scrollToCtaAriaLabel')}
                  >
                    {t('scrollToCta')}
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollToDocuments}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/50"
                  >
                    <DownloadIcon className="h-5 w-5" />
                    {t('downloadDocuments')}
                  </button>
                </div>
              </div>
            )}
          </div>        </div>
      </section>
    </>
  );
}
