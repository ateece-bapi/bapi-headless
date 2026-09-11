/**
 * Easy Order Form — bulk SKU lookup
 *
 * POST /api/easy-order/lookup
 *
 * Accepts a batch of part numbers/SKUs and returns matching product data
 * (id, name, price, image, stock status) for each, respecting B2B customer
 * group visibility rules. Restricted to authenticated users in a customer
 * group allowed to use the Easy Order Form (see lib/constants/easyOrderForm.ts).
 *
 * Uses the custom `easyOrderSkuLookup` WPGraphQL resolver (see
 * cms/files/wpgraphql-easy-order-sku-lookup.php) rather than the standard
 * `products` query, since many real part numbers (e.g. Lennox's reorder
 * list) are variation SKUs — the standard query only searches parent-level
 * SKUs, so it would silently fail to find them or return the wrong price.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { gql } from 'graphql-request';
import { z } from 'zod';
import { getServerAuth } from '@/lib/auth/server';
import { canUseEasyOrderForm } from '@/lib/constants/easyOrderForm';
import { getGraphQLClient } from '@/lib/graphql/client';
import { filterProductsByCustomerGroup } from '@/lib/utils/filterProductsByCustomerGroup';
import { logError } from '@/lib/errors';
import logger from '@/lib/logger';

const MAX_SKUS_PER_REQUEST = 100;
// Bounds how many SKU lookups run concurrently per request, so a max-size
// (100 SKU) request doesn't fire 100 simultaneous GraphQL/DB queries at once.
const CONCURRENCY_LIMIT = 8;

const lookupSchema = z.object({
  skus: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(MAX_SKUS_PER_REQUEST),
});

const SKU_LOOKUP_QUERY = gql`
  query EasyOrderSkuLookup($sku: String!) {
    easyOrderSkuLookup(sku: $sku) {
      databaseId
      parentDatabaseId
      isVariation
      name
      slug
      sku
      price
      stockStatus
      imageUrl
      imageAltText
      customerGroup1
      customerGroup2
      customerGroup3
    }
  }
`;

interface SkuLookupMatch {
  databaseId: number;
  parentDatabaseId: number;
  isVariation: boolean;
  name: string;
  slug: string;
  sku: string | null;
  price: string | null;
  stockStatus: string | null;
  imageUrl: string | null;
  imageAltText: string | null;
  customerGroup1: string | null;
  customerGroup2: string | null;
  customerGroup3: string | null;
}

interface SkuLookupResponse {
  easyOrderSkuLookup: SkuLookupMatch | null;
}

export interface EasyOrderLookupResult {
  sku: string;
  found: boolean;
  product?: {
    id: string;
    databaseId: number;
    variationId: number | null;
    name: string;
    slug: string;
    sku: string | null;
    partNumber: string | null;
    price: string | null;
    stockStatus: string | null;
    image: { sourceUrl?: string | null; altText?: string | null } | null;
  };
}

/** Runs async tasks with bounded concurrency, preserving input order in the results. */
async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await task(items[currentIndex]);
    }
  }

  await Promise.all(new Array(Math.min(limit, items.length)).fill(null).map(() => worker()));
  return results;
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

    // Forward the caller's JWT — the easyOrderSkuLookup resolver requires an
    // authenticated viewer server-side, independent of this route's own check.
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const customHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

    const client = getGraphQLClient(['products'], true, customHeaders);

    const results = await mapWithConcurrencyLimit(
      uniqueSkus,
      CONCURRENCY_LIMIT,
      async (sku): Promise<EasyOrderLookupResult> => {
        try {
          const data = await client.request<SkuLookupResponse>(SKU_LOOKUP_QUERY, { sku });
          const match = data.easyOrderSkuLookup;

          if (!match) {
            return { sku, found: false };
          }

          const [visible] = filterProductsByCustomerGroup(
            [
              {
                name: match.name,
                slug: match.slug,
                customerGroup1: match.customerGroup1,
                customerGroup2: match.customerGroup2,
                customerGroup3: match.customerGroup3,
              },
            ],
            user.customerGroups ?? ['end-user']
          );

          if (!visible) {
            return { sku, found: false };
          }

          return {
            sku,
            found: true,
            product: {
              id: `easy_order_sku:${match.databaseId}`,
              databaseId: match.parentDatabaseId,
              variationId: match.isVariation ? match.databaseId : null,
              name: match.name,
              slug: match.slug,
              sku: match.sku,
              partNumber: match.sku,
              price: match.price,
              stockStatus: match.stockStatus,
              image: match.imageUrl ? { sourceUrl: match.imageUrl, altText: match.imageAltText } : null,
            },
          };
        } catch (error) {
          logError('easy_order.sku_lookup_failed', error, { sku });
          return { sku, found: false };
        }
      }
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
