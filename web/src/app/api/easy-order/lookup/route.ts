/**
 * Easy Order Form — bulk SKU lookup
 *
 * POST /api/easy-order/lookup
 *
 * Accepts a batch of part numbers/SKUs and returns matching product data
 * (id, name, price, image, stock status) for each, respecting B2B customer
 * group visibility rules. Restricted to authenticated users in a customer
 * group allowed to use the Easy Order Form (see lib/constants/easyOrderForm.ts).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerAuth } from '@/lib/auth/server';
import { canUseEasyOrderForm } from '@/lib/constants/easyOrderForm';
import { getGraphQLClient } from '@/lib/graphql/client';
import { getSdk, type SearchProductsBySkuQuery } from '@/lib/graphql/generated';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';
import { logError } from '@/lib/errors';
import logger from '@/lib/logger';

const MAX_SKUS_PER_REQUEST = 100;

const lookupSchema = z.object({
  skus: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(MAX_SKUS_PER_REQUEST),
});

type LookupProduct = NonNullable<SearchProductsBySkuQuery['products']>['nodes'][number];

export interface EasyOrderLookupResult {
  sku: string;
  found: boolean;
  product?: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    sku: string | null;
    partNumber: string | null;
    price: string | null;
    image: { sourceUrl?: string | null; altText?: string | null } | null;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getServerAuth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canUseEasyOrderForm(user.customerGroups)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = lookupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', message: parsed.error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    // De-dupe while preserving the original casing/order for the response
    const uniqueSkus = [...new Set(parsed.data.skus)];

    const client = getGraphQLClient(['products'], true);
    const sdk = getSdk(client);

    const results = await Promise.all(
      uniqueSkus.map(async (sku): Promise<EasyOrderLookupResult> => {
        try {
          const data = await sdk.SearchProductsBySKU({ sku, first: 1 });
          const nodes = (data.products?.nodes ?? []) as LookupProduct[];
          const [visible] = filterProductsByCustomerGroup(nodes, user.customerGroups ?? ['end-user']);

          if (!visible) {
            return { sku, found: false };
          }

          return {
            sku,
            found: true,
            product: {
              id: visible.id,
              databaseId: visible.databaseId,
              name: visible.name ?? sku,
              slug: visible.slug ?? '',
              sku: 'sku' in visible ? (visible.sku ?? null) : null,
              partNumber: 'partNumber' in visible ? (visible.partNumber ?? null) : null,
              price: 'price' in visible ? (visible.price ?? null) : null,
              image: 'image' in visible ? (visible.image ?? null) : null,
            },
          };
        } catch (error) {
          logError('easy_order.sku_lookup_failed', error, { sku });
          return { sku, found: false };
        }
      })
    );

    logger.debug('Easy Order Form lookup completed', {
      requested: parsed.data.skus.length,
      unique: uniqueSkus.length,
      found: results.filter((r) => r.found).length,
    });

    return NextResponse.json({ results });
  } catch (error) {
    logError('easy_order.lookup_failed', error);
    return NextResponse.json({ error: 'Failed to look up products' }, { status: 500 });
  }
}
