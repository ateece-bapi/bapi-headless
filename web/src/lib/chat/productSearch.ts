import { getGraphQLClient } from '@/lib/graphql/client';
import { gql } from 'graphql-request';
import logger from '@/lib/logger';
import {
  filterProductsByCustomerGroup,
  getProductCustomerGroups,
  type ProductWithCustomerGroup,
} from '@/lib/utils/filterProductsByCustomerGroup';
import { slugify } from '@/lib/utils/slugify';

/**
 * Product search for AI chatbot integration
 * Searches BAPI product catalog via GraphQL
 */

const PRODUCT_SEARCH_QUERY = gql`
  query ChatProductSearch($search: String!, $first: Int = 5) {
    products(where: { search: $search, visibility: VISIBLE }, first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        description
        shortDescription
        ... on Product {
          partNumber
        }
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          sku
          stockStatus
          customerGroup1
          customerGroup2
          customerGroup3
          attributes {
            nodes {
              name
              label
              options
            }
          }
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
          customerGroup1
          customerGroup2
          customerGroup3
          attributes {
            nodes {
              name
              label
              options
            }
          }
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

export interface ProductAttribute {
  name: string;
  label: string;
  options: string[];
}

export interface ProductSearchResult {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  partNumber: string | null;
  price: string | null;
  regularPrice: string | null;
  sku: string | null;
  stockStatus: string | null;
  imageUrl: string | null;
  categories: string[];
  attributes: ProductAttribute[];
  url: string;
}

const UNTAGGED_OEM_PRODUCT_PATTERNS = [/\bnovar\b/i];

/** Returns whether a product is OEM-only and unavailable in chatbot recommendations. */
function isOemProduct(product: ProductWithCustomerGroup & { slug?: string | null }): boolean {
  const hasOemCustomerGroup = getProductCustomerGroups(product).some(
    (group) => slugify(group) !== 'end-user'
  );
  if (hasOemCustomerGroup) return true;

  const searchableName = `${product.name ?? ''} ${product.slug ?? ''}`;
  return UNTAGGED_OEM_PRODUCT_PATTERNS.some((pattern) => pattern.test(searchableName));
}

/**
 * Search products by keyword
 * Used by AI chatbot to find relevant BAPI products
 * @param query Search query string
 * @param limit Maximum number of results
 * @param customerGroups Optional customer groups for B2B filtering (e.g., 'alc', 'acs', 'emc', 'ccg')
 */
export async function searchProducts(
  query: string,
  limit: number = 5,
  customerGroups: string[] = ['END USER']
): Promise<ProductSearchResult[]> {
  try {
    const client = getGraphQLClient(['products']);

    const data = await client.request(PRODUCT_SEARCH_QUERY, {
      search: query,
      first: limit,
    });

    const products = data?.products?.nodes || [];

    // OEM products are never eligible for chatbot recommendations, even for authorized users.
    const filteredProducts = filterProductsByCustomerGroup(products, customerGroups).filter(
      (product) => !isOemProduct(product)
    );

    return filteredProducts.map((product: any) => ({
      id: product.id,
      databaseId: product.databaseId,
      name: product.name,
      slug: product.slug,
      description: product.description || null,
      shortDescription: product.shortDescription || null,
      partNumber: product.partNumber || null,
      price: product.price || null,
      regularPrice: product.regularPrice || null,
      sku: product.sku || null,
      stockStatus: product.stockStatus || null,
      imageUrl: product.image?.sourceUrl || null,
      categories: product.productCategories?.nodes?.map((cat: any) => cat.name) || [],
      attributes: (product.attributes?.nodes ?? []).map((attr: any) => ({
        name: attr.name ?? '',
        label: attr.label ?? '',
        options: (attr.options ?? []).filter((o: string | null) => o != null && o !== ''),
      })).filter((attr: ProductAttribute) => attr.name || attr.label),
      url: `/product/${product.slug}`,
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
      const partId = product.partNumber || product.sku;
      const descriptionText = (product.description || product.shortDescription || '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      const parts = [
        `${index + 1}. **${product.name}**`,
        partId ? `   - Part #: ${partId}` : '',
        product.categories.length > 0 ? `   - Category: ${product.categories.join(', ')}` : '',
        product.stockStatus ? `   - Stock: ${product.stockStatus}` : '',
        product.price ? `   - Price: ${product.price}` : '',
        descriptionText ? `   - Description: ${descriptionText}${descriptionText.length >= 300 ? '...' : ''}` : '',
        product.attributes.length > 0
          ? product.attributes
              .filter((attr) => (attr.label || attr.name) && attr.options.length > 0)
              .map((attr) => `   - ${attr.label || attr.name}: ${attr.options.join(', ')}`)
              .join('\n')
          : '',
        `   - View product: ${product.url}`,
      ];

      return parts.filter(Boolean).join('\n');
    })
    .join('\n\n');
}
