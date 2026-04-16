import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { getGraphQLClient } from '@/lib/graphql/client';
import { getSdk, SearchProductsQuery, SearchProductsByVariationSkuQuery } from '@/lib/graphql/generated';

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
}

/**
 * SKU pattern detector - helps optimize by only running variation query when needed
 * Typical SKU format: letters, numbers, hyphens, slashes, quotes (e.g., "BA/TQF-B-2-C80-J-A-B-F", "4\"-BB4")
 * 
 * @param query - Search query string to test
 * @returns True if query matches SKU pattern (alphanumeric with dashes/underscores/slashes/quotes)
 */
function looksLikeSku(query: string): boolean {
  // Match patterns with alphanumeric + dash/underscore/slash/quote (common SKU formats)
  // At least one letter and one number, may contain dashes/underscores/slashes/quotes
  return /^[A-Za-z0-9\-_/"]+$/.test(query) && /[A-Za-z]/.test(query) && /[0-9]/.test(query);
}

/**
 * Search API route - handles product search with variation SKU support
 * 
 * Priority order: Variation SKU > Product SKU > Name search
 * Uses GraphQL client with GET method for CDN caching
 * Conditionally runs variation query only for SKU-like patterns
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ products: { nodes: [] } });
    }

    return await performSearch(query);
  } catch (error) {
    logger.error('Search API error (GET):', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: { nodes: [] } });
    }

    return await performSearch(query);
  } catch (error) {
    logger.error('Search API error (POST):', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

// Shared search logic for both GET and POST
async function performSearch(query: string) {

    // Use GraphQL client with GET method for CDN caching
    const client = getGraphQLClient(['search'], true);
    const sdk = getSdk(client);

    const trimmedQuery = query.trim();
    const normalizedQuery = trimmedQuery.toLowerCase();
    const shouldCheckVariations = looksLikeSku(trimmedQuery);

    // Build query array conditionally - add custom variation SKU search if input looks like a SKU
    const queryPromises = [
      // Query 1: Search product name/description (fuzzy match)
      sdk.SearchProducts({ search: trimmedQuery, first: 8 }),
      // Query 2: Search by parent product SKU (exact match)
      sdk.SearchProductsBySKU({ sku: trimmedQuery, first: 8 }),
    ];

    // Query 3: For SKU-like patterns, use custom WPGraphQL resolver to search variation SKUs
    // This queries wp_postmeta directly for _sku (replicates Relevanssi behavior without the plugin)
    if (shouldCheckVariations) {
      logger.debug('Search API variation SKU search enabled', {
        query: trimmedQuery,
        normalizedQuery,
        shouldCheckVariations,
      });
      queryPromises.push(
        sdk.SearchProductsByVariationSku({ sku: trimmedQuery, first: 10 })
      );
    } else {
      logger.debug('Search API variation SKU search skipped', {
        query: trimmedQuery,
        normalizedQuery,
        shouldCheckVariations,
      });
    }

    const results = await Promise.all(queryPromises);
    
    // Handle variation query results with explicit types
    let nameData: SearchProductsQuery;
    let skuData: SearchProductsQuery;
    let variationData: SearchProductsByVariationSkuQuery | undefined;
    
    if (shouldCheckVariations) {
      [nameData, skuData, variationData] = results as [SearchProductsQuery, SearchProductsQuery, SearchProductsByVariationSkuQuery];
    } else {
      [nameData, skuData] = results as [SearchProductsQuery, SearchProductsQuery];
    }
    
    logger.debug('Search API query results', {
      nameMatches: nameData.products?.nodes?.length || 0,
      skuMatches: skuData.products?.nodes?.length || 0,
      variationMatches: variationData?.searchProductsByVariationSku?.length || 0,
    });

    // Extract products from GraphQL responses
    const nameResults = (nameData.products?.nodes || []) as SearchProduct[];
    const skuResults = (skuData.products?.nodes || []) as SearchProduct[];
    
    // Extract variation search results (custom resolver returns parent products directly)
    let variationResults: SearchProduct[] = [];
    if (shouldCheckVariations && variationData?.searchProductsByVariationSku) {
      variationResults = variationData.searchProductsByVariationSku.filter((p): p is SearchProduct => p !== null);
      logger.debug('Search API variation SKU search results', {
        count: variationResults.length,
        query: normalizedQuery,
      });
    }

    // Create a Map to deduplicate by product ID with priority ordering
    // Priority: Variation SKU (exact configured match) > Product SKU (parent match) > Name (fuzzy)
    const resultsMap = new Map<string, SearchProduct>();
    
    // Add variation SKU matches first (highest priority - exact configured product match)
    variationResults.forEach((product) => {
      resultsMap.set(product.id, product);
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

    // Convert Map back to array and limit to 8 results for dropdown
    const mergedResults = Array.from(resultsMap.values()).slice(0, 8);

    return NextResponse.json({ products: { nodes: mergedResults } });
}
