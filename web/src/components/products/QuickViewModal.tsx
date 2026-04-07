'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Link } from '@/lib/navigation';
import type { SimpleProduct, VariableProduct } from '@/lib/graphql/generated';
import {
  getProductPrice,
  isSimpleProduct,
  isVariableProduct,
  type Product,
} from '@/lib/graphql/types';
import { XIcon, ExternalLinkIcon, PackageIcon, DollarSignIcon } from '@/lib/icons';
import { useRegion } from '@/store/regionStore';
import { convertWooCommercePriceNumeric } from '@/lib/utils/currency';
import AddToCartButton from '@/components/cart/AddToCartButton';
import type { CartItem } from '@/store';
import VariationSelector from './VariationSelector';
import type { ProductVariation, ProductAttribute } from '@/types/variations';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  locale: string;
}

/**
 * Quick View Modal for product preview
 *
 * Features:
 * - Backdrop blur with BAPI gradient overlay
 * - Product image, name, price
 * - Short description
 * - Variation selector for variable products
 * - Add to cart button
 * - Link to full product page
 * - ESC key and click outside to close
 * - Smooth animations
 */
export default function QuickViewModal({ product, onClose, locale }: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const region = useRegion();

  // Check product type support - must be before any conditional returns
  const isSupported = isSimpleProduct(product) || isVariableProduct(product);
  const supportedProduct = isSupported ? (product as SimpleProduct | VariableProduct) : null;
  const isVariable = supportedProduct ? isVariableProduct(supportedProduct) : false;
  
  // Display values - safe to compute even if product not supported
  const displayPrice = supportedProduct
    ? selectedVariation
      ? getProductPrice({ ...supportedProduct, price: selectedVariation.price }, region.currency)
      : getProductPrice(supportedProduct, region.currency)
    : null;
  const displayImage = supportedProduct
    ? selectedVariation?.image || supportedProduct.image
    : null;
  const displaySku = supportedProduct
    ? selectedVariation?.sku || supportedProduct.sku || null
    : null;
  const displayPartNumber = supportedProduct
    ? selectedVariation?.partNumber || supportedProduct.partNumber || null
    : null;

  // Transform attributes and variations for VariationSelector (for variable products)
  // This hook MUST be called regardless of product type to maintain hook order
  const transformedAttributes: ProductAttribute[] = useMemo(() => {
    if (!isVariable || !supportedProduct) return [];
    const variableProduct = supportedProduct as VariableProduct;
    const attrs = variableProduct.attributes;
    if (!attrs?.nodes) return [];
    
    return attrs.nodes.map((attr, index) => {
      // Type assertion for ProductAttribute fields
      const productAttr = attr as unknown as {
        id: string;
        name?: string | null;
        label?: string | null;
        options?: (string | null)[] | null;
        variation?: boolean | null;
      };
      return {
        id: productAttr.id || `attr-${index}`,
        name: productAttr.name || '',
        label: productAttr.label || productAttr.name || '',
        options: (productAttr.options?.filter((opt): opt is string => opt !== null) || []),
        variation: productAttr.variation || false,
      };
    });
  }, [isVariable, supportedProduct]);

  const transformedVariations: ProductVariation[] = useMemo(() => {
    if (!isVariable || !supportedProduct) return [];
    const variableProduct = supportedProduct as VariableProduct;
    const vars = variableProduct.variations;
    if (!vars?.nodes) return [];
    
    return vars.nodes
      .filter((v) => {
        const variation = v as unknown as { databaseId?: number | null };
        // Skip variations without valid databaseId to prevent cart collisions
        return variation.databaseId != null && variation.databaseId !== 0;
      })
      .map((v) => {
        // Type assertion for SimpleProductVariation fields
        const variation = v as unknown as {
          id: string;
          databaseId: number;
          name?: string | null;
          price?: string | null;
          regularPrice?: string | null;
          partNumber?: string | null;
          sku?: string | null;
          image?: { sourceUrl?: string | null } | null;
          attributes?: {
            nodes?: Array<{
              name?: string | null;
              label?: string | null;
              value?: string | null;
            }> | null;
          } | null;
        };
        
        return {
          id: variation.id || '',
          databaseId: variation.databaseId,
          name: variation.name || '',
          price: variation.price || '',
          regularPrice: variation.regularPrice || '',
          partNumber: variation.partNumber || undefined,
          sku: variation.sku || '',
          image: variation.image || null,
          attributes: {
            nodes: variation.attributes?.nodes?.map((attr) => ({
              name: attr.name || '',
              label: attr.label || attr.name || '',
              value: attr.value || '',
            })) || [],
          },
        };
      });
  }, [isVariable, supportedProduct]);

  // Determine if Add to Cart is allowed
  // Only check variation attributes (variation: true) for validity
  const variationAttributes = transformedAttributes.filter(attr => attr.variation);
  const hasValidVariations = variationAttributes.length > 0 && transformedVariations.length > 0;
  const canAddToCart = supportedProduct
    ? !isVariable 
      ? !!displayPrice 
      : !!displayPrice && hasValidVariations && !!selectedVariation
    : false;

  // Handle variation selection
  // Note: partNumber parameter required by VariationSelector callback signature but not used here
  const handleVariationChange = (variation: ProductVariation | null, _partNumber: string | null) => {
    setSelectedVariation(variation);
    // Reset image loaded state to show shimmer for new variation image
    if (variation?.image) {
      setImageLoaded(false);
    }
  };

  // Portal mounting (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal for unsupported product types
  useEffect(() => {
    if (!isSupported) {
      console.warn(
        `QuickView does not support product type: ${product.__typename} (${product.name})`
      );
      onClose();
    }
  }, [isSupported, product, onClose]);

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus trap: Keep focus within modal
  useEffect(() => {
    if (!modalRef.current) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      // Get all focusable elements in modal
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: Moving backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Moving forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  // Get image URL (use variation image if selected)
  const imageUrl = displayImage?.sourceUrl || '/images/placeholder.png';
  const imageAlt = displayImage?.altText || supportedProduct?.name || 'Product image';

  // Prepare cart item data
  const cartItem: Omit<CartItem, 'quantity'> = useMemo(() => {
    if (!supportedProduct) {
      // Return dummy item for unsupported products (will never be used)
      return {
        id: '',
        databaseId: 0,
        name: '',
        slug: '',
        price: '',
        numericPrice: 0,
        image: null,
      };
    }

    // Use WooCommerce price utility for proper parsing (handles commas, ranges, etc.)
    const rawPrice = selectedVariation?.price || supportedProduct.price;
    const numericPrice = convertWooCommercePriceNumeric(rawPrice, region.currency);

    const baseCartItem: Omit<CartItem, 'quantity'> = {
      id: supportedProduct.id,
      databaseId: supportedProduct.databaseId || 0,
      name: supportedProduct.name || '',
      slug: supportedProduct.slug || '',
      price: displayPrice || '',
      numericPrice,
      image: displayImage?.sourceUrl
        ? {
            sourceUrl: displayImage.sourceUrl,
            altText: displayImage.altText || supportedProduct.name || '',
          }
        : null,
      partNumber: displayPartNumber || undefined,
    };

    // Add variation-specific fields if a variation is selected
    if (selectedVariation) {
      return {
        ...baseCartItem,
        variationId: selectedVariation.databaseId,
        variationName: selectedVariation.name || undefined,
        variationSku: selectedVariation.sku || undefined,
        selectedAttributes: selectedVariation.attributes?.nodes?.reduce((acc: Record<string, string>, attr) => {
          // Skip attributes with missing/empty names for safety
          if (attr.name && attr.value) {
            acc[attr.name] = attr.value;
          }
          return acc;
        }, {}) || undefined,
      };
    }

    return baseCartItem;
  }, [supportedProduct, displayPrice, displayImage, displayPartNumber, selectedVariation, isVariable, region.currency]);

  // Don't render on server (SSR safety for portal) or for unsupported products
  if (!mounted || !isSupported || !supportedProduct) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex animate-[fade-in_200ms_ease-out] items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop with BAPI gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-accent-900/20 backdrop-blur-sm" />

      {/* Modal Content - Full screen on mobile, centered modal on desktop */}
      <div
        ref={modalRef}
        className="relative h-full max-h-full w-full animate-[scale-in_300ms_ease-out] overflow-y-auto bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Larger touch target on mobile */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 z-10 min-h-[44px] min-w-[44px] rounded-full bg-white/90 p-2.5 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 sm:p-2"
          aria-label="Close quick view"
          title="Close quick view (or press ESC)"
        >
          <XIcon className="h-5 w-5 text-neutral-700" />
        </button>

        <div className="grid gap-6 p-6 sm:gap-8 sm:p-8 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100" />
            )}
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className={`object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Product Name */}
            <h2 id="quick-view-title" className="mb-3 text-2xl font-bold text-neutral-900">
              {supportedProduct.name}
            </h2>

            {/* SKU */}
            {displaySku && (
              <div className="mb-4 flex items-center gap-1.5 text-sm text-neutral-700">
                <PackageIcon className="h-4 w-4" />
                <span>SKU: {displaySku}</span>
              </div>
            )}

            {/* Price */}
            {displayPrice && (
              <div className="mb-6 flex items-baseline gap-2">
                <DollarSignIcon className="h-5 w-5 text-primary-500" />
                <span className="text-3xl font-bold text-primary-600">{displayPrice}</span>
              </div>
            )}

            {/* Short Description */}
            {supportedProduct.shortDescription && (
              <div
                className="mb-6 line-clamp-4 text-neutral-700"
                dangerouslySetInnerHTML={{ __html: supportedProduct.shortDescription }}
              />
            )}

            {/* Variation Selector for Variable Products */}
            {isVariable && transformedAttributes.length > 0 && transformedVariations.length > 0 && (
              <div className="mb-6">
                <VariationSelector
                  attributes={transformedAttributes}
                  variations={transformedVariations}
                  onVariationChange={handleVariationChange}
                  basePrice={(supportedProduct as VariableProduct).price || undefined}
                  className="compact"
                  syncUrl={false}
                />
                {!selectedVariation && (
                  <p className="mt-2 text-sm text-amber-600">
                    Please select all options to add to cart
                  </p>
                )}
              </div>
            )}

            {/* Variable Product without variations configured */}
            {isVariable && (transformedAttributes.length === 0 || transformedVariations.length === 0) && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Configuration Required:</strong> This product has variations that need to be configured.
                  Please view the full product page for more details or contact support.
                </p>
              </div>
            )}

            {/* Product Type Badge */}
            <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5">
              <span className="text-xs font-medium text-primary-700">
                {!isVariable ? 'Simple Product' : 'Variable Product'}
              </span>
            </div>

            {/* Actions - Larger touch targets on mobile */}
            <div className="space-y-3">
              {/* Add to Cart Button */}
              <AddToCartButton
                product={cartItem}
                quantity={1}
                disabled={!canAddToCart}
                className="min-h-[48px] w-full sm:min-h-[44px]"
                showCartOnAdd={true}
                ariaLabel={
                  !displayPrice
                    ? 'Price unavailable - cannot add to cart'
                    : isVariable && !selectedVariation
                        ? 'Select product options first'
                        : `Add ${supportedProduct.name} to cart`
                }
              />

              {/* View Full Details Link */}
              <Link
                href={`/product/${supportedProduct.slug}`}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary-50 px-6 py-3 font-semibold text-primary-600 transition-all duration-200 hover:bg-primary-100 sm:min-h-[44px]"
                onClick={onClose}
                title="View complete product details"
              >
                View Full Details
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in document.body portal to escape stacking context
  return createPortal(modalContent, document.body);
}
