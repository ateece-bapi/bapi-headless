'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { PackageIcon, RotateCcwIcon, Share2Icon, CheckIcon, HeartIcon, BriefcaseIcon } from '@/lib/icons';
import logger from '@/lib/logger';
import { getAttributeTranslationKey, hasAttributeTranslation } from '@/lib/productAttributeTranslations';
import type { ProductAttribute, ProductVariation, SelectedAttributes } from '@/types/variations';
import {
  findMatchingVariation,
  areAllAttributesSelected,
  getAvailableOptions,
  normalizeAttributeSlug,
} from '@/lib/variations';
import { detectAttributeType } from '@/lib/attributeDetection';
import ColorSwatchSelector from './variation-selectors/ColorSwatchSelector';
import RadioGroupSelector from './variation-selectors/RadioGroupSelector';
import BinaryToggleSelector from './variation-selectors/BinaryToggleSelector';
import DropdownSelector from './variation-selectors/DropdownSelector';
import { useRegion } from '@/store/regionStore';
import { formatPrice, convertWooCommercePrice, convertWooCommercePriceNumeric } from '@/lib/utils/currency';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useCart as defaultUseCart, useCartDrawer as defaultUseCartDrawer } from '@/store';
import { useToast } from '@/components/ui/Toast';

interface VariationSelectorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  onVariationChange: (variation: ProductVariation | null, partNumber: string | null) => void;
  className?: string;
  basePrice?: string;
  /**
   * Whether to sync selected attributes to URL query params.
   * Set to false in modal contexts (e.g., QuickView) to avoid polluting page URL.
   * @default true
   */
  syncUrl?: boolean;
  // Add to Cart integration
  product?: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    image?: { sourceUrl: string; altText?: string | null } | null;
  };
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  useCart?: typeof defaultUseCart;
  useCartDrawer?: typeof defaultUseCartDrawer;
}

/**
 * Enterprise B2B Variation Selector
 *
 * Intelligently renders optimal UI for each attribute type:
 * - Color swatches for colors
 * - Toggle switches for binary choices
 * - Radio groups for 2-4 options
 * - Dropdowns for complex selections
 *
 * Features:
 * - Real-time price updates
 * - Part number preview
 * - Stock status indicators
 * - Professional B2B design
 */
export default function VariationSelector({
  attributes,
  variations,
  onVariationChange,
  className = '',
  basePrice,
  syncUrl = true,
  product,
  quantity = 1,
  onQuantityChange,
  useCart,
  useCartDrawer,
}: VariationSelectorProps) {
  const t = useTranslations('productPage.configurator');
  const tAttr = useTranslations('productPage.productAttributes');
  const locale = useLocale();
  const { showToast } = useToast();
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>({});
  const [matchedVariation, setMatchedVariation] = useState<ProductVariation | null>(null);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritedVariationId, setFavoritedVariationId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const region = useRegion();

  // Filter to only attributes used for variations (memoized to prevent breaking availableOptionsMap memo)
  const variationAttributes = useMemo(
    () => attributes.filter((attr) => attr.variation),
    [attributes]
  );

  /**
   * Decode HTML entities in a string
   * Handles common entities: &amp;, &lt;, &gt;, &quot;, &#039;
   */
  const decodeHtmlEntities = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  };

  // Get translated attribute label with HTML entity decoding
  const getTranslatedLabel = (attribute: ProductAttribute): string => {
    const originalLabel = attribute.label;
    const key = getAttributeTranslationKey(originalLabel);

    if (key !== originalLabel) {
      // Translation found - decode HTML entities in translated text
      return decodeHtmlEntities(tAttr(key));
    }
    // Fallback to original label - decode HTML entities
    return decodeHtmlEntities(originalLabel);
  };

  // Handle attribute selection
  // attributeName is the display label, need to convert to slug for matching
  const handleAttributeChange = (attributeName: string, value: string) => {
    // Convert display name to slug (e.g., "Pressure Range" → "pressure-range")
    const attributeSlug = normalizeAttributeSlug(attributeName);

    const newSelections = {
      ...selectedAttributes,
      [attributeSlug]: value,
    };

    setSelectedAttributes(newSelections);

    // Check if all attributes are selected (use newSelections, not state)
    // Use slugified names to match what's in newSelections
    const attributeSlugs = variationAttributes.map((a) => normalizeAttributeSlug(a.name));
    const allSelected = areAllAttributesSelected(attributeSlugs, newSelections);

    if (allSelected) {
      // Find matching variation
      const variation = findMatchingVariation(variations, newSelections);
      setMatchedVariation(variation);
      onVariationChange(variation, variation?.partNumber || variation?.sku || null);
    } else {
      // Not all attributes selected yet
      setMatchedVariation(null);
      onVariationChange(null, null);
    }
  };

  // Handle clear/reset
  const handleClear = () => {
    setSelectedAttributes({});
    setMatchedVariation(null);
    onVariationChange(null, null);
  };

  // Reset when attributes or variations data change (but not callback)
  useEffect(() => {
    setSelectedAttributes({});
    setMatchedVariation(null);
    onVariationChange(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, variations]);

  // Sync selected attributes to URL on mount and when selections change
  useEffect(() => {
    // On mount, read URL params and restore selection
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSelections: SelectedAttributes = {};
      let hasUrlParams = false;

      variationAttributes.forEach((attr) => {
        const slug = normalizeAttributeSlug(attr.name);
        const value = params.get(slug);
        if (value) {
          urlSelections[slug] = value;
          hasUrlParams = true;
        }
      });

      if (hasUrlParams && Object.keys(selectedAttributes).length === 0) {
        setSelectedAttributes(urlSelections);

        // Check if we can find a matching variation
        const attributeSlugs = variationAttributes.map((a) => normalizeAttributeSlug(a.name));
        const allSelected = areAllAttributesSelected(attributeSlugs, urlSelections);
        if (allSelected) {
          const variation = findMatchingVariation(variations, urlSelections);
          if (variation) {
            setMatchedVariation(variation);
            onVariationChange(variation, variation.partNumber || variation.sku || null);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when selections change
  useEffect(() => {
    if (typeof window !== 'undefined' && syncUrl && Object.keys(selectedAttributes).length > 0) {
      const params = new URLSearchParams(window.location.search);

      // Add/update selected attributes
      Object.entries(selectedAttributes).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Update URL without page reload
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedAttributes, syncUrl]);

  // Handle share configuration
  const handleShare = async () => {
    if (typeof window !== 'undefined' && Object.keys(selectedAttributes).length > 0) {
      const url = window.location.href;

      try {
        // Try using Web Share API (mobile)
        if (navigator.share) {
          await navigator.share({
            title: `${matchedVariation?.name || 'Product Configuration'}`,
            text: `Check out this configuration: ${matchedVariation?.partNumber || matchedVariation?.sku || ''}`,
            url: url,
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(url);
          setShowShareConfirmation(true);
          setTimeout(() => setShowShareConfirmation(false), 3000);
        }
      } catch (error) {
        // Silent fail - user might have cancelled
        logger.debug('Share cancelled or failed');
      }
    }
  };

  // FIX #3 (Performance): Memoize available options to avoid recomputing 3000+ operations per render
  // Only show options that have actual product variations to prevent "Invalid Configuration" errors
  const availableOptionsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    variationAttributes.forEach((attr) => {
      const slug = normalizeAttributeSlug(attr.name);
      map[slug] = getAvailableOptions(slug, variations, selectedAttributes);
    });
    return map;
  }, [variations, selectedAttributes, variationAttributes]);

  // FIX #2 (Stale Selection): Clear selections that are no longer in available options
  // This prevents UI inconsistency when a selection gets filtered out by smart filtering
  useEffect(() => {
    let needsUpdate = false;
    const updatedSelections = { ...selectedAttributes };

    Object.entries(selectedAttributes).forEach(([slug, value]) => {
      if (value && availableOptionsMap[slug] && !availableOptionsMap[slug].includes(value)) {
        // Current selection is no longer available - clear it
        delete updatedSelections[slug];
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setSelectedAttributes(updatedSelections);
    }
  }, [availableOptionsMap, selectedAttributes]);

  // Reset favorite state when matched variation changes
  useEffect(() => {
    if (matchedVariation) {
      setIsFavorited(favoritedVariationId === matchedVariation.id);
    } else {
      setIsFavorited(false);
    }
  }, [matchedVariation, favoritedVariationId]);

  if (variationAttributes.length === 0) {
    return null;
  }

  // Calculate progress
  const selectedCount = Object.keys(selectedAttributes).filter((k) => selectedAttributes[k]).length;
  const totalCount = variationAttributes.length;
  const progressPercent = (selectedCount / totalCount) * 100;

  return (
    <section className={`mb-12 ${className}`} data-product-configurator>
      {/* Enterprise Configuration Header */}
      <div className="rounded-t-2xl bg-linear-to-r from-primary-700 via-primary-500 to-primary-700 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold">{t('heading')}</h2>
            <p className="text-sm text-primary-100">
              {t('subheading', { selectedCount, totalCount })}
            </p>
          </div>
          <div className="flex gap-2">
            {selectedCount > 0 && (
              <>
                <button
                  onClick={handleShare}
                  className="relative flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 font-semibold text-neutral-900 shadow-md transition-colors hover:bg-accent-600"
                  disabled={!matchedVariation}
                  title={
                    matchedVariation
                      ? t('shareConfigTitle')
                      : t('shareConfigDisabledTitle')
                  }
                >
                  {showShareConfirmation ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span className="font-medium">{t('shareCopied')}</span>
                    </>
                  ) : (
                    <>
                      <Share2Icon className="h-4 w-4" />
                      <span className="hidden font-medium sm:inline">{t('shareButton')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  <span className="hidden font-medium sm:inline">{t('resetButton')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="rounded-b-2xl border-2 border-neutral-200 bg-white shadow-lg">
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Configuration Options */}
            {variationAttributes.map((attribute) => {
              const uiType = detectAttributeType(attribute);
              const attributeSlug = normalizeAttributeSlug(attribute.name);
              const value = selectedAttributes[attributeSlug] || '';

              // Use memoized available options from map (Performance fix #3)
              const availableOptions = availableOptionsMap[attributeSlug] || [];

              const commonProps = {
                label: getTranslatedLabel(attribute),
                attributeSlug, // Stable identifier for DOM ids (accessibility)
                options: availableOptions,
                value,
                onChange: (val: string) => handleAttributeChange(attribute.label, val),
              };

              switch (uiType) {
                case 'color-swatch':
                  return <ColorSwatchSelector key={attribute.id} {...commonProps} />;

                case 'binary-toggle':
                  // FIX #1 (Binary Toggle): Only use BinaryToggleSelector when exactly 2 options
                  // If filtered down to 0, 1, or 3+ options, fall back to DropdownSelector
                  if (availableOptions.length === 2) {
                    return (
                      <BinaryToggleSelector
                        key={attribute.id}
                        {...commonProps}
                        options={availableOptions as [string, string]}
                      />
                    );
                  }
                  // Fall through to dropdown if not exactly 2 options
                  return <DropdownSelector key={attribute.id} {...commonProps} />;

                case 'radio-group':
                  return <RadioGroupSelector key={attribute.id} {...commonProps} />;

                case 'dropdown':
                default:
                  return <DropdownSelector key={attribute.id} {...commonProps} />;
              }
            })}
          </div>

          {/* Configuration Summary - Compact 2-column layout with image and action controls */}
          {matchedVariation && (
            <div className="from-primary-25 -m-8 mb-0 mt-8 rounded-b-2xl border-t-2 border-primary-200 bg-linear-to-br to-primary-50 p-6 pt-6">
              <div className="rounded-xl border-2 border-accent-500 bg-linear-to-br from-accent-50 via-accent-100 to-white p-4 shadow-xl">
                {/* Header with Favorite Button */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500">
                      <PackageIcon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent-800">
                      {t('selectedConfig')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-neutral-500">
                      {t('attributesSelected', { selected: selectedCount, total: totalCount })}
                    </p>
                    {/* Inline Favorite Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const newState = !isFavorited;
                        setIsFavorited(newState);
                        setFavoritedVariationId(newState ? matchedVariation.id : null);
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 ${
                        isFavorited
                          ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50'
                          : 'border border-neutral-300 bg-white text-neutral-700 hover:border-red-400 hover:text-red-500 focus:ring-neutral-300/50'
                      }`}
                      aria-pressed={isFavorited}
                      aria-label={isFavorited ? t('removeFromFavorites') : t('addToFavorites')}
                    >
                      <HeartIcon className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{t('favorite')}</span>
                    </button>
                  </div>
                </div>

                {/* Layout: Image Left, Details Right */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Left: Product Image with Zoom */}
                  {((matchedVariation.image?.sourceUrl || product?.image?.sourceUrl)) && (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          // Simple image zoom - opens in new tab for now
                          const imgSrc = matchedVariation.image?.sourceUrl || product?.image?.sourceUrl;
                          if (imgSrc) window.open(imgSrc, '_blank', 'noopener,noreferrer');
                        }}
                        className="group relative h-80 w-80 overflow-hidden rounded-lg border-2 border-neutral-200 bg-white p-2 shadow-sm transition-all hover:border-primary-400 hover:shadow-lg"
                        aria-label={t('clickToViewLargerImage')}
                      >
                        <Image
                          src={(matchedVariation.image?.sourceUrl || product?.image?.sourceUrl)!}
                          alt={(matchedVariation.image?.altText || product?.image?.altText || matchedVariation.name || t('productVariation'))}
                          fill
                          className="object-contain transition-transform group-hover:scale-105"
                          sizes="320px"
                        />
                        {/* Zoom indicator */}
                        <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {t('clickToZoom')}
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Right: Details Stacked */}
                  <div className="flex min-w-0 flex-col justify-center">
                    {/* Part Number with Copy */}
                    <div className="mb-3">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600">{t('partNumber')}</p>
                      <div className="group flex items-center gap-2">
                        <code className="flex-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-sm font-bold text-neutral-900 shadow-sm">
                          {matchedVariation.partNumber || matchedVariation.sku}
                        </code>
                        <button
                          type="button"
                          onClick={async () => {
                            const partNumber = matchedVariation.partNumber || matchedVariation.sku;
                            try {
                              await navigator.clipboard.writeText(partNumber);
                              setCopySuccess(true);
                              showToast('success', 'Copied!', `Part number ${partNumber} copied to clipboard.`, 2500);
                              setTimeout(() => setCopySuccess(false), 1500);
                            } catch (err) {
                              logger.error('Failed to copy part number', { error: err });
                              showToast('error', 'Copy Failed', 'Unable to copy to clipboard. Please copy manually.', 4000);
                            }
                          }}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                            copySuccess
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-neutral-300 bg-white text-neutral-600 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600'
                          }`}
                          aria-label={t('copyPartNumber')}
                          title={t('copyToClipboard')}
                        >
                          {copySuccess ? (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Selected Configuration Details - Better Contrast */}
                    {matchedVariation.attributes.nodes.length > 0 && (
                      <div className="mb-4 rounded-lg border border-accent-300 bg-accent-50/70 p-3 shadow-sm">
                        <div className="space-y-2">
                          {matchedVariation.attributes.nodes.map((attr) => (
                            <div key={attr.name} className="flex items-start gap-2 text-xs leading-relaxed">
                              <span className="font-bold capitalize text-neutral-900">
                                {attr.name.replace(/-/g, ' ')}:
                              </span>
                              <span className="text-neutral-800">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price with Breakdown Tooltip */}
                    <div className="mb-3">
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-semibold text-neutral-700">{t('totalPrice')}</p>
                        <div className="group relative">
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(
                              convertWooCommercePriceNumeric(matchedVariation.price, region.currency) * quantity,
                              region.currency
                            )}
                          </p>
                          {/* Price Breakdown Tooltip */}
                          {quantity > 1 && (
                            <div className="absolute right-0 top-full z-10 mt-1 hidden w-48 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg group-hover:block">
                              <p className="mb-1 text-xs font-semibold text-neutral-700">{t('priceBreakdown')}:</p>
                              <div className="space-y-0.5 text-xs text-neutral-600">
                                <div className="flex justify-between">
                                  <span>{t('unitPrice')}:</span>
                                  <span className="font-mono">{formatPrice(convertWooCommercePriceNumeric(matchedVariation.price, region.currency), region.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t('quantity')}:</span>
                                  <span className="font-mono">× {quantity}</span>
                                </div>
                                <div className="mt-1 flex justify-between border-t border-neutral-200 pt-1 font-semibold text-neutral-900">
                                  <span>{t('total')}:</span>
                                  <span className="font-mono">{formatPrice(convertWooCommercePriceNumeric(matchedVariation.price, region.currency) * quantity, region.currency)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector - Larger Touch Targets (44px) */}
                    {onQuantityChange && (
                      <div className="mb-3 flex items-center gap-3">
                        <label htmlFor="qty-input" className="text-sm font-semibold text-neutral-700">
                          {t('quantity')}:
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-lg font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-primary-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label={t('decreaseQtyAriaLabel')}
                          >
                            −
                          </button>
                          <input
                            id="qty-input"
                            type="number"
                            min={1}
                            max={999}
                            value={quantity}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onQuantityChange(isNaN(val) ? 1 : Math.max(1, Math.min(999, val)));
                            }}
                            className="h-11 w-16 rounded-lg border-2 border-neutral-300 text-center text-base font-bold text-neutral-900 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            aria-label={t('qtyLabel')}
                          />
                          <button
                            type="button"
                            onClick={() => onQuantityChange(Math.min(999, quantity + 1))}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-lg font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-primary-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            aria-label={t('increaseQtyAriaLabel')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button - Full Width with Micro-interaction */}
                    {product && (
                      <div className="mb-2">
                        <AddToCartButton
                          product={{
                            id: matchedVariation.id,
                            databaseId: matchedVariation.databaseId,
                            name: matchedVariation.name,
                            slug: product.slug,
                            price: convertWooCommercePrice(matchedVariation.price, region.currency),
                            numericPrice: convertWooCommercePriceNumeric(
                              matchedVariation.price,
                              region.currency
                            ),
                            image: (() => {
                              const img = matchedVariation.image || product.image;
                              return img?.sourceUrl && typeof img.sourceUrl === 'string'
                                ? { sourceUrl: img.sourceUrl, altText: img.altText || undefined }
                                : null;
                            })(),
                            variationId: matchedVariation.databaseId,
                            variationName: matchedVariation.name,
                            partNumber: matchedVariation.partNumber,
                            selectedAttributes: matchedVariation.attributes.nodes.reduce(
                              (acc, attr) => {
                                acc[attr.name] = attr.value;
                                return acc;
                              },
                              {} as Record<string, string>
                            ),
                          }}
                          quantity={quantity}
                          className="w-full px-6 py-3.5 text-base font-bold shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                          disabled={matchedVariation.stockStatus !== 'IN_STOCK'}
                          useCart={useCart}
                          useCartDrawer={useCartDrawer}
                          ariaLabel={`Add ${matchedVariation.name} to cart`}
                        />
                      </div>
                    )}

                    {/* Add to Estimate Button - Outline Style (Secondary Action) */}
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-400 transition-all cursor-not-allowed"
                      aria-label={t('addToEstimate')}
                      title={t('comingSoon')}
                    >
                      <BriefcaseIcon className="h-4 w-4" />
                      {t('addToEstimate')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invalid combination message - show when all selected but no match */}
          {!matchedVariation && selectedCount === totalCount && (
            <div className="mt-6 rounded-lg border-2 border-red-400 bg-red-50 p-4">
              <p className="mb-1 text-sm font-bold text-red-900">{t('invalidConfig')}</p>
              <p className="text-sm text-red-700">
                {t('invalidConfigMessage')}
              </p>
            </div>
          )}

          {/* Selection prompt - only show when partially complete */}
          {!matchedVariation && selectedCount > 0 && selectedCount < totalCount && (
            <div className="mt-6 rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                {t('partialSelectionMessage', {
                  count: totalCount - selectedCount,
                  plural: totalCount - selectedCount > 1 ? t('optionPlural') : t('optionSingular')
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
