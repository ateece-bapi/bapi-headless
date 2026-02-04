import { getGraphQLClient } from '@/lib/graphql/client';
import { gql } from 'graphql-request';
import logger from '@/lib/logger';

/**
 * Product search for AI chatbot integration
 * Searches BAPI product catalog via GraphQL
 */

const PRODUCT_SEARCH_QUERY = gql`
  query ChatProductSearch($search: String!, $first: Int = 5) {
    products(where: { search: $search }, first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          sku
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on ExternalProduct {
          price
          regularPrice
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on GroupProduct {
          price
          productCategories {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

export interface ProductSearchResult {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: string | null;
  regularPrice: string | null;
  sku: string | null;
  imageUrl: string | null;
  categories: string[];
  url: string;
}

/**
 * Search products by keyword
 * Used by AI chatbot to find relevant BAPI products
 */
export async function searchProducts(
  query: string,
  limit: number = 5
): Promise<ProductSearchResult[]> {
  try {
    const client = getGraphQLClient(['products']);

    const data = await client.request(PRODUCT_SEARCH_QUERY, {
      search: query,
      first: limit,
    });

    const products = data?.products?.nodes || [];

    return products.map((product: any) => ({
      id: product.id,
      databaseId: product.databaseId,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      price: product.price,
      regularPrice: product.regularPrice,
      sku: product.sku,
      imageUrl: product.image?.sourceUrl || null,
      categories: product.productCategories?.nodes?.map((cat: any) => cat.name) || [],
      url: `/products/${product.slug}`,
    }));
  } catch (error) {
    logger.error('Product search error', error);
    return [];
  }
}

/**
 * Format products for Claude's context
 * Returns text description of products suitable for AI response
 */
export function formatProductsForAI(products: ProductSearchResult[]): string {
  if (products.length === 0) {
    return 'No products found matching that criteria.';
  }

  return products
    .map((product, index) => {
      const parts = [
        `${index + 1}. **${product.name}**`,
        product.sku ? `   - SKU: ${product.sku}` : '',
        product.price ? `   - Price: ${product.price}` : '',
        product.categories.length > 0 ? `   - Category: ${product.categories.join(', ')}` : '',
        product.shortDescription
          ? `   - Description: ${product.shortDescription.replace(/<[^>]*>/g, '').substring(0, 150)}...`
          : '',
        `   - View product: ${product.url}`,
      ];

      return parts.filter(Boolean).join('\n');
    })
    .join('\n\n');
}
