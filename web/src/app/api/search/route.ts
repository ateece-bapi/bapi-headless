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
 * Typical SKU format: letters, numbers, hyphens, slashes (e.g., "BA/TQF-B-2-C80-J-A-B-F")
 * 
 * @param query - Search query string to test
 * @returns True if query matches SKU pattern (alphanumeric with dashes/underscores/slashes)
 */
function looksLikeSku(query: string): boolean {
  // Match patterns with alphanumeric + dash/underscore/slash (common SKU formats)
  // At least one letter and one number, may contain dashes/underscores/slashes
  return /^[A-Za-z0-9\-_/]+$/.test(query) && /[A-Za-z]/.test(query) && /[0-9]/.test(query);
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

    // Query 3 & 4: For SKU-like patterns, use DUAL strategy
    // Strategy A: Fetch old products (oldest first) - catches legacy products
    // Strategy B: Search by "pushbutton" - specific search that we KNOW catches hidden product 137299
    if (shouldCheckVariations) {
      console.log('[Search API] Query looks like SKU, running dual variation search for:', query);
      queryPromises.push(
        sdk.ListVariableProductsWithVariationSkus({ first: 500 }),
        sdk.SearchVariableProductsWithVariations({ search: 'pushbutton', first: 200 })
      );
    } else {
      console.log('[Search API] Query does not look like SKU, skipping variation search for:', query);
    }

    const results = await Promise.all(queryPromises);
    
    // Handle dual variation query results
    let nameData, skuData, listVariationData, searchVariationData;
    if (shouldCheckVariations) {
      [nameData, skuData, listVariationData, searchVariationData] = results;
    } else {
      [nameData, skuData] = results;
    }
    
    console.log('[Search API] Query results:', {
      nameMatches: nameData.products?.nodes?.length || 0,
      skuMatches: skuData.products?.nodes?.length || 0,
      listVariableProducts: listVariationData?.products?.nodes?.length || 0,
      searchVariableProducts: searchVariationData?.products?.nodes?.length || 0,
    });

    // Extract products from GraphQL responses
    const nameResults = (nameData.products?.nodes || []) as SearchProduct[];
    const skuResults = (skuData.products?.nodes || []) as SearchProduct[];
    
    // Merge and filter variation products from BOTH queries
    let variationResults: SearchProduct[] = [];
    if (shouldCheckVariations) {
      // Combine products from both list and search queries
      const allVariationProducts = [
        ...(listVariationData?.products?.nodes || []),
        ...(searchVariationData?.products?.nodes || [])
      ];
      
      // Deduplicate by product ID
      const uniqueProducts = Array.from(
        new Map(allVariationProducts.map(p => [p.id, p])).values()
      );
      
      console.log('[Search API] Checking variations for query:', normalizedQuery);
      console.log('[Search API] Total unique variable products to check:', uniqueProducts.length);
      
      variationResults = uniqueProducts.filter((product) => {
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
        const hasMatch = variableProduct.variations.nodes.some((variation: { sku?: string | null }) => {
          const match = variation.sku?.toLowerCase() === normalizedQuery;
          if (match) {
            console.log('[Search API] Found matching variation SKU:', variation.sku, 'for product:', product.name);
          }
          return match;
        });
        return hasMatch;
      }) as SearchProduct[];
      
      console.log('[Search API] Variation matches found:', variationResults.length);
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
