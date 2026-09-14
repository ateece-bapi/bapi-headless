/**
 * Easy Order Form — curated order list
 *
 * GET /api/easy-order/order-list
 *
 * Returns the products curated for the current user's Easy Order Form
 * customer group (e.g. Lennox's frequently-reordered parts), tagged via the
 * private `order_list` WordPress taxonomy (see cms/files/wpgraphql-order-list.php).
 *
 * Uses the custom `easyOrderCuratedList` resolver (see
 * cms/files/wpgraphql-easy-order-sku-lookup.php) rather than a generic
 * `products(where: { taxonomyFilter: ... })` query, since the taxonomy is
 * assigned at both the product and variation level — the custom resolver
 * returns the exact variation identity/price when applicable and dedupes
 * redundant parent-level entries. This query targets fields that only exist
 * on the Headless WordPress instance, not in the shared committed
 * schema.json — it's written directly against the live schema here (rather
 * than as a codegen-tracked .graphql file) so it doesn't block
 * `pnpm run codegen` for the rest of the team.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { gql } from 'graphql-request';
import { getServerAuth } from '@/lib/auth/server';
import { canUseEasyOrderForm, EASY_ORDER_FORM_CUSTOMER_GROUPS } from '@/lib/constants/easyOrderForm';
import { getGraphQLClient } from '@/lib/graphql/client';
import { logError } from '@/lib/errors';

const CURATED_LIST_QUERY = gql`
  query EasyOrderCuratedList($term: String!) {
    easyOrderCuratedList(term: $term) {
      databaseId
      parentDatabaseId
      isVariation
      name
      slug
      sku
      partNumber
      canonicalId
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

interface CuratedMatch {
  databaseId: number;
  parentDatabaseId: number;
  isVariation: boolean;
  name: string;
  slug: string;
  sku: string | null;
  partNumber: string | null;
  canonicalId: string | null;
  price: string | null;
  stockStatus: string | null;
  imageUrl: string | null;
  imageAltText: string | null;
  customerGroup1: string | null;
  customerGroup2: string | null;
  customerGroup3: string | null;
}

interface CuratedListResponse {
  easyOrderCuratedList: CuratedMatch[];
}

/** The Easy Order Form customer group doubles as the order_list taxonomy term for now. */
function getOrderListTermForGroups(customerGroups: string[]): string | null {
  return customerGroups.find((group) =>
    (EASY_ORDER_FORM_CUSTOMER_GROUPS as readonly string[]).includes(group)
  ) ?? null;
}

export async function GET() {
  try {
    const { user } = await getServerAuth();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canUseEasyOrderForm(user.customerGroups)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const term = getOrderListTermForGroups(user.customerGroups ?? []);
    if (!term) {
      return NextResponse.json({ products: [] });
    }

    // Forward the caller's JWT — easyOrderCuratedList requires an
    // authenticated viewer server-side, independent of this route's own check.
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const customHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;

    // useGetMethod: false — this result is viewer-specific (auth + customer
    // group dependent); a GET request would be eligible for Smart Cache's
    // shared CDN cache and could leak one user's curated list to another.
    const client = getGraphQLClient(['products', 'order-list'], false, customHeaders);
    const data = await client.request<CuratedListResponse>(CURATED_LIST_QUERY, { term });

    const matches = data.easyOrderCuratedList ?? [];

    // No JS-side filterProductsByCustomerGroup() here: results are already
    // scoped to this customer's own order_list taxonomy term, and the
    // easyOrderCuratedList resolver enforces real ACF customerGroup1/2/3
    // restrictions server-side. Applying the JS filter's legacy slug/title
    // fallback here caused false-positive restrictions (e.g. products whose
    // slug happens to match CUSTOMER_GROUPS_BY_PRODUCT_SLUG) to be dropped
    // even though they carry no actual ACF restriction and were explicitly
    // curated for this customer.
    const products = matches.map((p) => ({
      id: p.canonicalId ?? `easy_order_sku:${p.databaseId}`,
      databaseId: p.parentDatabaseId,
      variationId: p.isVariation ? p.databaseId : null,
      name: p.name,
      slug: p.slug,
      sku: p.sku ?? null,
      partNumber: p.partNumber ?? p.sku ?? null,
      price: p.price ?? null,
      stockStatus: p.stockStatus ?? null,
      image: p.imageUrl ? { sourceUrl: p.imageUrl, altText: p.imageAltText ?? undefined } : null,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    logError('easy_order.order_list_failed', error);
    return NextResponse.json({ error: 'Failed to load order list' }, { status: 500 });
  }
}
