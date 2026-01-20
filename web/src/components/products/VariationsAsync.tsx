import { getGraphQLClient } from '@/lib/graphql/client';
import { GetProductVariationsDocument } from '@/lib/graphql/generated';
import type { GetProductVariationsQuery } from '@/lib/graphql/generated';

interface VariationsAsyncProps {
  productId: string;
}

/**
 * Server component that fetches product variations asynchronously
 * 
 * Only loads variation data when needed for VariableProduct types.
 * Uses separate Suspense boundary to avoid blocking initial page render.
 * 
 * @param productId - Database ID of the product
 * @returns Variation data or null if not a variable product
 */
export async function VariationsAsync({ productId }: VariationsAsyncProps) {
  if (!productId) {
    return null;
  }

  const client = getGraphQLClient(['product-variations', `product-${productId}`], true);

  try {
    const data = await client.request<GetProductVariationsQuery>(
      GetProductVariationsDocument,
      { id: productId }
    );

    // Return the variation data - will be null if not a VariableProduct
    return data.product || null;
  } catch (error) {
    console.error('[VariationsAsync] Failed to fetch variations:', error);
    return null;
  }
}

export default VariationsAsync;
