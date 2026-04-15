import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

// Type for search product response
interface SearchProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  partNumber?: string | null;
  price?: string | null;
  shortDescription?: string | null;
  image?: {
    id: string;
    sourceUrl: string;
    altText?: string | null;
    mediaDetails?: {
      height: number;
      width: number;
    } | null;
  } | null;
  productCategories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  } | null;
  variations?: {
    nodes: Array<{
      sku?: string | null;
    }>;
  } | null;
}

// Search by product name/description
const SEARCH_QUERY = `
  query SearchProducts($search: String!) {
    products(where: { search: $search, visibility: VISIBLE }, first: 8) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          sku
          partNumber
          price
          shortDescription
          image {
            id
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          sku
          partNumber
          price
          shortDescription
          image {
            id
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

// Search by SKU (exact match)
const SKU_SEARCH_QUERY = `
  query SearchProductsBySKU($sku: String!) {
    products(where: { sku: $sku, visibility: VISIBLE }, first: 8) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          sku
          partNumber
          price
          shortDescription
          image {
            id
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
        ... on VariableProduct {
          sku
          partNumber
          price
          shortDescription
          image {
            id
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

// Search variable products with variations for SKU matching
// Limit to recent products to avoid performance issues
const VARIATION_SKU_SEARCH_QUERY = `
  query SearchVariationsBySKU {
    products(where: { type: VARIABLE, visibility: VISIBLE }, first: 50) {
      nodes {
        id
        databaseId
        name
        slug
        ... on VariableProduct {
          sku
          partNumber
          price
          shortDescription
          image {
            id
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
          variations(first: 100) {
            nodes {
              sku
            }
          }
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: { nodes: [] } });
    }

    const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    if (!GRAPHQL_ENDPOINT) {
      logger.error('NEXT_PUBLIC_WORDPRESS_GRAPHQL not configured');
      return NextResponse.json({ error: 'GraphQL endpoint not configured' }, { status: 500 });
    }

    // Run three queries in parallel: name/description search + product SKU search + variation SKU search
    const [nameSearchResponse, skuSearchResponse, variationSearchResponse] = await Promise.all([
      // Query 1: Search product name/description
      fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: SEARCH_QUERY,
          variables: { search: query },
        }),
        next: { revalidate: 0 },
      }),
      // Query 2: Search by product SKU (exact match)
      fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: SKU_SEARCH_QUERY,
          variables: { sku: query },
        }),
        next: { revalidate: 0 },
      }),
      // Query 3: Search variable products with variations
      fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: VARIATION_SKU_SEARCH_QUERY,
        }),
        next: { revalidate: 0 },
      }),
    ]);

    if (!nameSearchResponse.ok || !skuSearchResponse.ok || !variationSearchResponse.ok) {
      logger.error('WordPress GraphQL search failed', {
        nameStatus: nameSearchResponse.status,
        skuStatus: skuSearchResponse.status,
        variationStatus: variationSearchResponse.status,
      });
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: nameSearchResponse.ok 
            ? (skuSearchResponse.ok ? variationSearchResponse.status : skuSearchResponse.status)
            : nameSearchResponse.status }
      );
    }

    const [nameData, skuData, variationData] = await Promise.all([
      nameSearchResponse.json(),
      skuSearchResponse.json(),
      variationSearchResponse.json(),
    ]);

    if (nameData.errors || skuData.errors || variationData.errors) {
      logger.error('GraphQL search query failed', {
        nameErrors: nameData.errors,
        skuErrors: skuData.errors,
        variationErrors: variationData.errors,
      });
      return NextResponse.json(
        { error: 'GraphQL query failed', details: nameData.errors || skuData.errors || variationData.errors },
        { status: 500 }
      );
    }

    // Merge results from all three queries, removing duplicates by ID
    const nameResults: SearchProduct[] = nameData.data?.products?.nodes || [];
    const skuResults: SearchProduct[] = skuData.data?.products?.nodes || [];
    const variationProducts: SearchProduct[] = variationData.data?.products?.nodes || [];

    // Filter variation products to only those with matching variation SKUs
    const normalizedQuery = query.trim().toLowerCase();
    const variationResults = variationProducts.filter((product) => {
      if (!product.variations?.nodes) return false;
      return product.variations.nodes.some((variation) => 
        variation.sku?.toLowerCase() === normalizedQuery
      );
    });

    // Create a Map to deduplicate by product ID
    // Priority order: Variation SKU > Product SKU > Name search
    const resultsMap = new Map<string, SearchProduct>();
    
    // Add variation SKU matches first (highest priority - exact configured product match)
    variationResults.forEach((product) => {
      // Remove variations from response to keep payload clean
      const { variations, ...productWithoutVariations } = product;
      resultsMap.set(product.id, productWithoutVariations);
    });
    
    // Add product SKU results (second priority - parent product SKU match)
    skuResults.forEach((product) => {
      if (!resultsMap.has(product.id)) {
        resultsMap.set(product.id, product);
      }
    });

    // Add name search results (lowest priority - fuzzy name match)
    nameResults.forEach((product) => {
      if (!resultsMap.has(product.id)) {
        resultsMap.set(product.id, product);
      }
    });

    // Convert Map back to array and limit to 8 results
    const mergedResults = Array.from(resultsMap.values()).slice(0, 8);

    return NextResponse.json({ products: { nodes: mergedResults } });
  } catch (error) {
    logger.error('Search API error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
