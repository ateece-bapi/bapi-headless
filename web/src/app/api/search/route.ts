import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { getGraphQLClient } from '@/lib/graphql/client';
import { getSdk } from '@/lib/graphql/generated';

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
 * Typical SKU format: letters, numbers, hyphens (e.g., "TEMP-SENSOR-1000-024")
 * 
 * @param query - Search query string to test
 * @returns True if query matches SKU pattern (alphanumeric with dashes/underscores)
 */
function looksLikeSku(query: string): boolean {
  // Match patterns with alphanumeric + dash/underscore (common SKU formats)
  // At least one letter and one number, may contain dashes/underscores
  return /^[A-Za-z0-9\-_]+$/.test(query) && /[A-Za-z]/.test(query) && /[0-9]/.test(query);
}

/**
 * Search API route - handles product search with variation SKU support
 * 
 * Priority order: Variation SKU > Product SKU > Name search
 * Uses GraphQL client with GET method for CDN caching
 * Conditionally runs variation query only for SKU-like patterns
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: { nodes: [] } });
    }

    // Use GraphQL client with GET method for CDN caching
    const client = getGraphQLClient(['search'], true);
    const sdk = getSdk(client);

    const normalizedQuery = query.trim().toLowerCase();
    const shouldCheckVariations = looksLikeSku(query);

    // Build query array conditionally - only add variation query if input looks like a SKU
    const queryPromises = [
      // Query 1: Search product name/description (fuzzy match)
      sdk.SearchProducts({ search: query, first: 8 }),
      // Query 2: Search by product SKU (exact match)
      sdk.SearchProductsBySKU({ sku: query, first: 8 }),
    ];

    // Query 3: Only search variable product variations if query looks like a SKU pattern
    // This avoids fetching 50 products × 100 variations (5,000 SKUs) for non-SKU searches
    if (shouldCheckVariations) {
      queryPromises.push(sdk.ListVariableProductsWithVariationSkus({ first: 50 }));
    }

    const results = await Promise.all(queryPromises);
    const [nameData, skuData, variationData] = results;

    // Extract products from GraphQL responses
    const nameResults = (nameData.products?.nodes || []) as SearchProduct[];
    const skuResults = (skuData.products?.nodes || []) as SearchProduct[];
    
    // Filter variation products to only those with matching variation SKUs (if query ran)
    let variationResults: SearchProduct[] = [];
    if (shouldCheckVariations && variationData) {
      const variationProducts = (variationData.products?.nodes || []);
      
      variationResults = variationProducts.filter((product) => {
        // Type guard: only VariableProduct has variations
        if (product.__typename !== 'VariableProduct') {
          return false;
        }
        // Safe to cast after typename check - GraphQL unions make type narrowing complex
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const variableProduct = product as any;
        if (!variableProduct.variations?.nodes) {
          return false;
        }
        // Check if any variation SKU matches the search query exactly
        return variableProduct.variations.nodes.some((variation: { sku?: string | null }) => 
          variation.sku?.toLowerCase() === normalizedQuery
        );
      }) as SearchProduct[];
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
  } catch (error) {
    logger.error('Search API error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
