#!/usr/bin/env tsx
/**
 * Scan Products Without Videos (Using JSON Data)
 * 
 * This script checks which products have videos in the product-videos.json file
 * vs which products exist in WordPress but don't have videos mapped yet.
 * 
 * Usage:
 *   pnpm tsx scripts/scan-products-videos-json.ts
 *   pnpm tsx scripts/scan-products-videos-json.ts --output csv
 *   pnpm tsx scripts/scan-products-videos-json.ts --output json
 */

import { GraphQLClient, gql } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';
import productVideosData from '../src/data/product-videos.json';

// Configuration
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';
const BATCH_SIZE = 100;
const OUTPUT_FORMAT = process.argv.includes('--output') 
  ? process.argv[process.argv.indexOf('--output') + 1] 
  : 'console';

interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string;
}

interface ProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: Product[];
  };
}

// Simplified GraphQL query - just get product IDs and SKUs
const PRODUCTS_QUERY = gql`
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          sku
        }
        ... on VariableProduct {
          sku
        }
        ... on ExternalProduct {
          sku
        }
      }
    }
  }
`;

/**
 * Check if a product has videos in the JSON file
 */
function hasVideos(product: Product): boolean {
  const productId = product.databaseId.toString();
  const productSku = product.sku;
  
  // Check by Product ID first
  if (productId in productVideosData) {
    const videos = (productVideosData as Record<string, any[]>)[productId];
    return videos && videos.length > 0;
  }
  
  // Check by SKU
  if (productSku && productSku in productVideosData) {
    const videos = (productVideosData as Record<string, any[]>)[productSku];
    return videos && videos.length > 0;
  }
  
  return false;
}

/**
 * Get video count for a product
 */
function getVideoCount(product: Product): number {
  const productId = product.databaseId.toString();
  const productSku = product.sku;
  
  // Check by Product ID first
  if (productId in productVideosData) {
    const videos = (productVideosData as Record<string, any[]>)[productId];
    return videos ? videos.length : 0;
  }
  
  // Check by SKU
  if (productSku && productSku in productVideosData) {
    const videos = (productVideosData as Record<string, any[]>)[productSku];
    return videos ? videos.length : 0;
  }
  
  return 0;
}

/**
 * Fetch all products from GraphQL with pagination
 */
async function fetchAllProducts(client: GraphQLClient): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let after: string | null = null;
  let pageCount = 0;

  console.log('Fetching products from WordPress GraphQL...\n');

  while (hasNextPage) {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const response: ProductsResponse = await client.request<ProductsResponse>(PRODUCTS_QUERY, {
      first: BATCH_SIZE,
      after,
    });

    const { nodes, pageInfo } = response.products;
    allProducts.push(...nodes);

    console.log(`  Retrieved ${nodes.length} products (Total: ${allProducts.length})`);

    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;
  }

  console.log(`\n✅ Fetched ${allProducts.length} total products\n`);
  return allProducts;
}

/**
 * Main execution
 */
async function main() {
  try {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT);

    // Load video data stats
    const videoEntryCount = Object.keys(productVideosData).length;
    const totalVideos = Object.values(productVideosData).reduce(
      (sum, videos) => sum + videos.length, 
      0
    );

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📹 PRODUCT VIDEOS JSON DATA');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Product entries in JSON: ${videoEntryCount}`);
    console.log(`Total videos in JSON:    ${totalVideos}`);
    console.log('\n');

    // Fetch all products from WordPress
    const allProducts = await fetchAllProducts(client);

    // Separate products with and without videos
    const productsWithVideos = allProducts.filter(hasVideos);
    const productsWithoutVideos = allProducts.filter(p => !hasVideos(p));

    // Generate report
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 PRODUCT VIDEO SCAN RESULTS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Total Products in WordPress:     ${allProducts.length}`);
    console.log(`✅ Products WITH videos (in JSON): ${productsWithVideos.length} (${((productsWithVideos.length / allProducts.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Products WITHOUT videos:        ${productsWithoutVideos.length} (${((productsWithoutVideos.length / allProducts.length) * 100).toFixed(1)}%)`);
    console.log('\n═══════════════════════════════════════════════════════════\n');

    // Output results based on format
    if (OUTPUT_FORMAT === 'json') {
      const outputPath = path.join(process.cwd(), 'products-without-videos.json');
      const data = {
        summary: {
          totalProducts: allProducts.length,
          withVideos: productsWithVideos.length,
          withoutVideos: productsWithoutVideos.length,
          videoEntriesInJson: videoEntryCount,
          totalVideosInJson: totalVideos,
          scanDate: new Date().toISOString(),
        },
        productsWithoutVideos: productsWithoutVideos.map(p => ({
          id: p.databaseId,
          name: p.name,
          slug: p.slug,
          sku: p.sku || 'N/A',
          url: `https://bapi.com/product/${p.slug}`,
        })),
        productsWithVideos: productsWithVideos.map(p => ({
          id: p.databaseId,
          name: p.name,
          slug: p.slug,
          sku: p.sku || 'N/A',
          videoCount: getVideoCount(p),
          url: `https://bapi.com/product/${p.slug}`,
        })),
      };

      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`📄 JSON report saved to: ${outputPath}\n`);

    } else if (OUTPUT_FORMAT === 'csv') {
      const outputPath = path.join(process.cwd(), 'products-video-status.csv');
      const csvHeader = 'Database ID,Name,Slug,SKU,Has Videos,Video Count,URL\n';
      const csvRows = allProducts.map(p => {
        const hasVids = hasVideos(p);
        const vidCount = getVideoCount(p);
        return `${p.databaseId},"${p.name.replace(/"/g, '""')}",${p.slug},${p.sku || 'N/A'},${hasVids ? 'YES' : 'NO'},${vidCount},https://bapi.com/product/${p.slug}`;
      }).join('\n');

      fs.writeFileSync(outputPath, csvHeader + csvRows);
      console.log(`📄 CSV report saved to: ${outputPath}\n`);

    } else {
      // Console output (default)
      console.log('Products WITHOUT Videos (first 50):\n');
      console.log('ID     | SKU            | Name');
      console.log('-------+----------------+' + '-'.repeat(50));
      
      productsWithoutVideos.slice(0, 50).forEach(p => {
        const id = String(p.databaseId).padEnd(6);
        const sku = (p.sku || 'N/A').padEnd(14);
        const name = p.name.substring(0, 48);
        console.log(`${id} | ${sku} | ${name}`);
      });

      if (productsWithoutVideos.length > 50) {
        console.log(`\n... and ${productsWithoutVideos.length - 50} more products without videos`);
      }

      console.log('\n💡 TIP: Run with --output json or --output csv to save full results\n');
    }

    // Show some sample products WITH videos
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('Sample Products WITH Videos (first 10):');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    productsWithVideos.slice(0, 10).forEach(p => {
      const videoCount = getVideoCount(p);
      console.log(`✅ ${p.name}`);
      console.log(`   SKU: ${p.sku || 'N/A'} | Videos: ${videoCount} | ID: ${p.databaseId}`);
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Error scanning products:', error);
    if (error instanceof Error) {
      console.error('Details:', error.message);
    }
    process.exit(1);
  }
}

// Run the script
main();
