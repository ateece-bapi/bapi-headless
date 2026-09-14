'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  PackageIcon,
} from '@/lib/icons';
import { Link } from '@/lib/navigation';
import { useCart, useCartDrawer } from '@/store';
import { useRegion } from '@/store/regionStore';
import { useToast } from '@/components/ui/Toast';
import { convertWooCommercePrice, convertWooCommercePriceNumeric, formatPrice } from '@/lib/utils/currency';
import { logError } from '@/lib/errors';
import type { EasyOrderLookupResult } from '@/app/api/easy-order/lookup/route';

interface OrderRow {
  key: string;
  sku: string;
  quantity: number;
  status: 'idle' | 'found' | 'not-found';
  result?: EasyOrderLookupResult['product'];
}

interface CuratedProduct {
  id: string;
  databaseId: number;
  variationId: number | null;
  name: string;
  slug: string;
  sku: string | null;
  partNumber: string | null;
  price: string | null;
  stockStatus: string | null;
  image: { sourceUrl: string; altText?: string } | null;
}

/** Whether an item has both a price and in-stock status, and can therefore be added to cart. */
function isOrderable(price: string | null | undefined, stockStatus: string | null | undefined): boolean {
  if (!price) return false;
  if (!stockStatus) return true; // unknown stock status — don't block, matches existing lookup behavior
  return stockStatus.toUpperCase() === 'IN_STOCK' || stockStatus.toUpperCase() === 'INSTOCK';
}

/** Parses pasted "SKU, Qty" text (newline-separated; comma/tab/space-delimited per line). */
function parseOrderText(text: string): { sku: string; quantity: number }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[\t,]+/).map((p) => p.trim()).filter(Boolean);
      const sku = parts[0] ?? '';
      const qtyPart = parts[1] ? parseInt(parts[1], 10) : 1;
      const quantity = Number.isFinite(qtyPart) && qtyPart > 0 ? qtyPart : 1;
      return { sku, quantity };
    })
    .filter((row) => row.sku.length > 0);
}

/** Small product thumbnail with a consistent fallback when no image is available. */
function ProductThumbnail({
  image,
  name,
  noImageLabel,
}: {
  image: { sourceUrl?: string | null; altText?: string | null } | null | undefined;
  name: string;
  noImageLabel: string;
}) {
  return (
    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
      {image?.sourceUrl ? (
        <Image
          src={image.sourceUrl}
          alt={image.altText || name}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      ) : (
        <PackageIcon className="h-6 w-6 text-neutral-300" role="img" aria-hidden={false} aria-label={noImageLabel} />
      )}
    </div>
  );
}

/** Brand-consistent +/- quantity stepper, matching the cart page's control pattern. */
function QuantityStepper({
  value,
  min,
  disabled,
  decreaseAriaLabel,
  increaseAriaLabel,
  onChange,
}: {
  value: number;
  min: number;
  disabled?: boolean;
  decreaseAriaLabel: string;
  increaseAriaLabel: string;
  onChange: (next: number) => void;
}) {
  const stepperButtonClass =
    'flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100 font-semibold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:bg-neutral-100';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className={stepperButtonClass}
        aria-label={decreaseAriaLabel}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-base font-bold text-neutral-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled}
        className={stepperButtonClass}
        aria-label={increaseAriaLabel}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function EasyOrderForm() {
  const t = useTranslations('account.easyOrder');
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const region = useRegion();
  const { showToast } = useToast();

  const [pasteText, setPasteText] = useState('');
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [curatedProducts, setCuratedProducts] = useState<CuratedProduct[]>([]);
  const [curatedQuantities, setCuratedQuantities] = useState<Record<string, number>>({});
  const [isLoadingCurated, setIsLoadingCurated] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCuratedList() {
      try {
        const response = await fetch('/api/easy-order/order-list');
        if (!response.ok) {
          throw new Error(`Curated list load failed with status ${response.status}`);
        }
        const data: { products: CuratedProduct[] } = await response.json();
        if (isMounted) setCuratedProducts(data.products ?? []);
      } catch (error) {
        logError('easy_order.curated_list_load_failed', error);
        if (isMounted) {
          showToast('error', t('toasts.curatedListFailedTitle'), t('toasts.curatedListFailedMessage'), 5000);
        }
      } finally {
        if (isMounted) setIsLoadingCurated(false);
      }
    }

    loadCuratedList();
    return () => {
      isMounted = false;
    };
  }, [showToast, t]);

  const handleCuratedQuantityChange = (id: string, quantity: number) => {
    setCuratedQuantities((prev) => ({ ...prev, [id]: Math.max(0, quantity) }));
  };

  const handleCheckAvailability = async () => {
    const parsedRows = parseOrderText(pasteText);

    if (parsedRows.length === 0) {
      showToast('warning', t('toasts.nothingToCheckTitle'), t('toasts.nothingToCheckMessage'), 4000);
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch('/api/easy-order/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus: parsedRows.map((r) => r.sku) }),
      });

      if (!response.ok) {
        throw new Error(`Lookup failed with status ${response.status}`);
      }

      const data: { results: EasyOrderLookupResult[] } = await response.json();
      const resultBySku = new Map(data.results.map((r) => [r.sku, r]));

      const nextRows: OrderRow[] = parsedRows.map(({ sku, quantity }, index) => {
        const match = resultBySku.get(sku);
        return {
          key: `${sku}-${index}`,
          sku,
          quantity,
          status: match?.found ? 'found' : 'not-found',
          result: match?.product,
        };
      });

      setRows(nextRows);

      const foundCount = nextRows.filter((r) => r.status === 'found').length;
      showToast(
        foundCount === nextRows.length ? 'success' : 'warning',
        t('toasts.availabilityCheckedTitle'),
        t('toasts.availabilityCheckedMessage', { found: foundCount, total: nextRows.length }),
        4000
      );
    } catch (error) {
      logError('easy_order.check_availability_failed', error);
      showToast('error', t('toasts.checkFailedTitle'), t('toasts.checkFailedMessage'), 5000);
    } finally {
      setIsChecking(false);
    }
  };

  const handleQuantityChange = (key: string, quantity: number) => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, quantity: Math.max(1, quantity) } : row))
    );
  };

  const handleRemoveRow = (key: string) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleAddAllToCart = async () => {
    const foundRows = rows.filter(
      (row) => row.status === 'found' && row.result && isOrderable(row.result.price, row.result.stockStatus)
    );
    const curatedSelections = curatedProducts.filter(
      (p) => (curatedQuantities[p.id] ?? 0) > 0 && isOrderable(p.price, p.stockStatus)
    );

    if (foundRows.length === 0 && curatedSelections.length === 0) {
      showToast('warning', t('toasts.nothingToAddTitle'), t('toasts.nothingToAddMessage'), 4000);
      return;
    }

    setIsAdding(true);

    try {
      curatedSelections.forEach((product) => {
        addItem(
          {
            id: product.id,
            databaseId: product.databaseId,
            variationId: product.variationId ?? undefined,
            name: product.name,
            slug: product.slug,
            price: convertWooCommercePrice(product.price, region.currency),
            numericPrice: convertWooCommercePriceNumeric(product.price, region.currency),
            image: product.image,
            partNumber: product.partNumber ?? product.sku ?? undefined,
          },
          curatedQuantities[product.id]
        );
      });

      foundRows.forEach((row) => {
        const product = row.result!;
        addItem(
          {
            id: product.id,
            databaseId: product.databaseId,
            variationId: product.variationId ?? undefined,
            name: product.name,
            slug: product.slug,
            price: convertWooCommercePrice(product.price, region.currency),
            numericPrice: convertWooCommercePriceNumeric(product.price, region.currency),
            image: product.image?.sourceUrl
              ? { sourceUrl: product.image.sourceUrl, altText: product.image.altText ?? undefined }
              : null,
            partNumber: product.partNumber ?? product.sku ?? undefined,
          },
          row.quantity
        );
      });

      const totalAdded = foundRows.length + curatedSelections.length;
      showToast('success', t('toasts.addedToCartTitle'), t('toasts.addedToCartMessage', { count: totalAdded }), 3000);
      setCuratedQuantities({});
      setTimeout(() => openCart(), 300);
    } finally {
      setIsAdding(false);
    }
  };

  const foundCount = rows.filter((r) => r.status === 'found').length;
  const notFoundCount = rows.filter((r) => r.status === 'not-found').length;
  const curatedSelectedCount = curatedProducts.filter((p) => (curatedQuantities[p.id] ?? 0) > 0).length;

  const selectionSummary = useMemo(() => {
    let itemCount = 0;
    let subtotal = 0;

    curatedProducts.forEach((product) => {
      const qty = curatedQuantities[product.id] ?? 0;
      if (qty > 0 && isOrderable(product.price, product.stockStatus)) {
        itemCount += qty;
        subtotal += convertWooCommercePriceNumeric(product.price, region.currency) * qty;
      }
    });

    rows.forEach((row) => {
      if (row.status === 'found' && row.result && isOrderable(row.result.price, row.result.stockStatus)) {
        itemCount += row.quantity;
        subtotal += convertWooCommercePriceNumeric(row.result.price, region.currency) * row.quantity;
      }
    });

    return { itemCount, subtotal };
  }, [curatedProducts, curatedQuantities, rows, region.currency]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t('backToDashboard')}
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 lg:text-4xl">{t('title')}</h1>
          <p className="mt-2 max-w-2xl text-neutral-700">
            {t.rich('description', {
              code: (chunks) => (
                <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">{chunks}</code>
              ),
            })}
          </p>
        </div>
      </section>

      <section className={`w-full py-8 ${selectionSummary.itemCount > 0 ? 'pb-44 sm:pb-28' : ''}`}>
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          {isLoadingCurated ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-neutral-700">
                <Loader2Icon className="h-5 w-5 animate-spin" />
                <span>{t('loadingCuratedList')}</span>
              </div>
            </div>
          ) : (
            curatedProducts.length > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <PackageIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">{t('standardOrderList.title')}</h2>
                      <p className="text-sm text-neutral-700">{t('standardOrderList.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddAllToCart}
                    disabled={isAdding || (foundCount === 0 && curatedSelectedCount === 0)}
                    className="flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 shadow-sm transition-all hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    {t('addAllToCart')}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-sm text-neutral-700">
                        <th className="px-6 py-3 font-medium">{t('table.product')}</th>
                        <th className="px-6 py-3 font-medium">{t('table.partNumber')}</th>
                        <th className="px-6 py-3 font-medium">{t('table.price')}</th>
                        <th className="px-6 py-3 font-medium">{t('table.qty')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {curatedProducts.map((product) => {
                        const selected = (curatedQuantities[product.id] ?? 0) > 0;
                        return (
                          <tr
                            key={product.id}
                            className={`transition-colors ${selected ? 'bg-primary-50/60' : 'hover:bg-neutral-50'}`}
                          >
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <ProductThumbnail image={product.image} name={product.name} noImageLabel={t('noImage')} />
                                <span className="text-sm font-medium text-neutral-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 font-mono text-sm text-neutral-700">
                              {product.partNumber ?? product.sku ?? '—'}
                            </td>
                            <td className="px-6 py-3 text-sm text-neutral-900">
                              {product.price
                                ? convertWooCommercePrice(product.price, region.currency)
                                : t('contactForPricing')}
                              {product.price && !isOrderable(product.price, product.stockStatus) && (
                                <span className="ml-2 inline-block rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700">
                                  {t('outOfStock')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3">
                              <QuantityStepper
                                value={curatedQuantities[product.id] ?? 0}
                                min={0}
                                disabled={!isOrderable(product.price, product.stockStatus)}
                                decreaseAriaLabel={t('quantityDecreaseAriaLabel', { name: product.name })}
                                increaseAriaLabel={t('quantityIncreaseAriaLabel', { name: product.name })}
                                onChange={(next) => handleCuratedQuantityChange(product.id, next)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <label htmlFor="easy-order-paste" className="mb-2 block font-semibold text-neutral-900">
              {t('otherPartNumbers')}
            </label>
            <textarea
              id="easy-order-paste"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={8}
              placeholder={'BA/10K-2-AP, 10\nBA/AQX-D-BNK, 2\nBA/QS-W-B'}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCheckAvailability}
                disabled={isChecking}
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChecking ? (
                  <Loader2Icon className="h-5 w-5 animate-spin" />
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
                {isChecking ? t('checking') : t('checkAvailability')}
              </button>
            </div>
          </div>

          {rows.length > 0 && (
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <SearchIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{t('orderPreview.title')}</h2>
                    <p className="text-sm text-neutral-700">
                      {notFoundCount > 0
                        ? t('orderPreview.foundAndNotFound', { found: foundCount, notFound: notFoundCount })
                        : t('orderPreview.found', { count: foundCount })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddAllToCart}
                  disabled={isAdding || (foundCount === 0 && curatedSelectedCount === 0)}
                  className="flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 shadow-sm transition-all hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {t('addAllToCart')}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 text-sm text-neutral-700">
                      <th className="px-6 py-3 font-medium">{t('table.status')}</th>
                      <th className="px-6 py-3 font-medium">{t('table.partNumber')}</th>
                      <th className="px-6 py-3 font-medium">{t('table.product')}</th>
                      <th className="px-6 py-3 font-medium">{t('table.price')}</th>
                      <th className="px-6 py-3 font-medium">{t('table.qty')}</th>
                      <th className="px-6 py-3 font-medium sr-only">{t('table.remove')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {rows.map((row) => {
                      const orderable =
                        row.status === 'found' && isOrderable(row.result?.price, row.result?.stockStatus);
                      return (
                        <tr key={row.key} className={`transition-colors ${orderable ? 'bg-primary-50/60' : 'hover:bg-neutral-50'}`}>
                          <td className="px-6 py-3">
                            {row.status === 'found' ? (
                              <CheckCircleIcon className="h-5 w-5 text-success-700" aria-label={t('foundStatus')} />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-error-600" aria-label={t('notFoundStatus')} />
                            )}
                          </td>
                          <td className="px-6 py-3 font-mono text-sm text-neutral-700">{row.sku}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              {row.result && (
                                <ProductThumbnail image={row.result.image} name={row.result.name} noImageLabel={t('noImage')} />
                              )}
                              <span className="text-sm font-medium text-neutral-900">
                                {row.result?.name ?? (
                                  <span className="font-normal text-neutral-700">{t('notAvailableYet')}</span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-neutral-900">
                            {row.result?.price ? convertWooCommercePrice(row.result.price, region.currency) : '—'}
                            {row.result?.price && !isOrderable(row.result.price, row.result.stockStatus) && (
                              <span className="ml-2 inline-block rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700">
                                {t('outOfStock')}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <QuantityStepper
                              value={row.quantity}
                              min={1}
                              disabled={!orderable}
                              decreaseAriaLabel={t('quantityDecreaseAriaLabel', { name: row.result?.name ?? row.sku })}
                              increaseAriaLabel={t('quantityIncreaseAriaLabel', { name: row.result?.name ?? row.sku })}
                              onChange={(next) => handleQuantityChange(row.key, next)}
                            />
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleRemoveRow(row.key)}
                              aria-label={t('removeAriaLabel', { sku: row.sku })}
                              className="text-neutral-700 transition-colors hover:text-error-600"
                            >
                              <Trash2Icon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectionSummary.itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-container flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 font-bold text-primary-600">
                {selectionSummary.itemCount}
              </span>
              <div>
                <p className="font-semibold text-neutral-900">
                  {t('summary.itemsSelected', { count: selectionSummary.itemCount })}
                </p>
                <p className="text-sm text-neutral-700">
                  {t('summary.subtotal')}:{' '}
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(selectionSummary.subtotal, region.currency)}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={handleAddAllToCart}
              disabled={isAdding}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 font-bold text-neutral-900 shadow-sm transition-all hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isAdding ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <ShoppingCartIcon className="h-5 w-5" />}
              {t('addAllToCart')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
