/**
 * Easy Order Form — curated order list
 *
 * GET /api/easy-order/order-list
 *
 * Returns the products curated for the current user's Easy Order Form
 * customer group (e.g. Lennox's frequently-reordered parts), tagged via the
 * private `order_list` WordPress taxonomy (see cms/files/wpgraphql-order-list.php).
 *
 * This query targets a taxonomy that only exists on the Headless WordPress
 * instance, not in the shared committed schema.json — it's written directly
 * against the live schema here (rather than as a codegen-tracked .graphql
 * file) so it doesn't block `pnpm run codegen` for the rest of the team.
 */
import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { getServerAuth } from '@/lib/auth/server';
import { canUseEasyOrderForm, EASY_ORDER_FORM_CUSTOMER_GROUPS } from '@/lib/constants/easyOrderForm';
import { getGraphQLClient } from '@/lib/graphql/client';
import { logError } from '@/lib/errors';

const ORDER_LIST_QUERY = gql`
  query GetOrderListProducts($term: String!, $first: Int!) {
    products(
      where: {
        taxonomyFilter: { filters: [{ taxonomy: ORDER_LIST, terms: [$term], operator: IN }] }
        visibility: VISIBLE
      }
      first: $first
    ) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          sku
          partNumber
          price
          stockStatus
          image {
            sourceUrl
            altText
          }
        }
        ... on VariableProduct {
          sku
          partNumber
          price
          stockStatus
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

interface OrderListProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  partNumber?: string | null;
  price?: string | null;
  stockStatus?: string | null;
  image?: { sourceUrl?: string | null; altText?: string | null } | null;
}

interface OrderListResponse {
  products: { nodes: OrderListProduct[] };
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

    const client = getGraphQLClient(['products', 'order-list'], true);
    const data = await client.request<OrderListResponse>(ORDER_LIST_QUERY, { term, first: 100 });

    const products = (data.products?.nodes ?? []).map((p) => ({
      id: p.id,
      databaseId: p.databaseId,
      name: p.name,
      slug: p.slug,
      sku: p.sku ?? null,
      partNumber: p.partNumber ?? null,
      price: p.price ?? null,
      stockStatus: p.stockStatus ?? null,
      image: p.image?.sourceUrl ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText ?? undefined } : null,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    logError('easy_order.order_list_failed', error);
    return NextResponse.json({ error: 'Failed to load order list' }, { status: 500 });
  }
}
