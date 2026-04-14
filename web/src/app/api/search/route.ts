import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

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

// Search by SKU (exact or partial match)
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

    // Run both queries in parallel: name/description search + SKU search
    const [nameSearchResponse, skuSearchResponse] = await Promise.all([
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
      // Query 2: Search by SKU (exact match)
      fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: SKU_SEARCH_QUERY,
          variables: { sku: query },
        }),
        next: { revalidate: 0 },
      }),
    ]);

    if (!nameSearchResponse.ok || !skuSearchResponse.ok) {
      logger.error('WordPress GraphQL search failed', {
        nameStatus: nameSearchResponse.status,
        skuStatus: skuSearchResponse.status,
      });
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: nameSearchResponse.ok ? skuSearchResponse.status : nameSearchResponse.status }
      );
    }

    const [nameData, skuData] = await Promise.all([
      nameSearchResponse.json(),
      skuSearchResponse.json(),
    ]);

    if (nameData.errors || skuData.errors) {
      logger.error('GraphQL search query failed', {
        nameErrors: nameData.errors,
        skuErrors: skuData.errors,
      });
      return NextResponse.json(
        { error: 'GraphQL query failed', details: nameData.errors || skuData.errors },
        { status: 500 }
      );
    }

    // Merge results from both queries, removing duplicates by ID
    const nameResults = nameData.data?.products?.nodes || [];
    const skuResults = skuData.data?.products?.nodes || [];

    // Create a Map to deduplicate by product ID
    const resultsMap = new Map();
    
    // Add SKU results first (higher priority for exact SKU matches)
    skuResults.forEach((product: { id: string }) => {
      resultsMap.set(product.id, product);
    });

    // Add name search results (won't override if already exists)
    nameResults.forEach((product: { id: string }) => {
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
