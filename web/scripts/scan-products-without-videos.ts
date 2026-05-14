#!/usr/bin/env tsx
/**
 * Scan Products Without Videos
 * 
 * This script queries all products from WordPress GraphQL and identifies
 * which products do NOT have videos in the productVideos field.
 * 
 * Usage:
 *   ts-node scripts/scan-products-without-videos.ts
 *   ts-node scripts/scan-products-without-videos.ts --output csv
 *   ts-node scripts/scan-products-without-videos.ts --output json
 */

import { GraphQLClient, gql } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';

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
  productVideos?: {
    heading: string;
    videos: { url: string }[];
  }[] | null;
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

// GraphQL query to fetch products with video data
const PRODUCTS_QUERY = gql`
  query GetProductsWithVideos($first: Int!, $after: String) {
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
          productVideos {
            heading
            videos {
              url
            }
          }
        }
        ... on VariableProduct {
          sku
          productVideos {
            heading
            videos {
              url
            }
          }
        }
        ... on ExternalProduct {
          sku
          productVideos {
            heading
            videos {
              url
            }
          }
        }
        ... on GroupProduct {
          productVideos {
            heading
            videos {
              url
            }
          }
        }
      }
    }
  }
`;

/**
 * Check if a product has videos
 */
function hasVideos(product: Product): boolean {
  if (!product.productVideos || product.productVideos.length === 0) {
    return false;
  }
  
  // Check if any category has videos
  return product.productVideos.some(category => 
    category.videos && category.videos.length > 0
  );
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

    // Fetch all products
    const allProducts = await fetchAllProducts(client);

    // Separate products with and without videos
    const productsWithVideos = allProducts.filter(hasVideos);
    const productsWithoutVideos = allProducts.filter(p => !hasVideos(p));

    // Generate report
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 PRODUCT VIDEO SCAN RESULTS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Total Products:          ${allProducts.length}`);
    console.log(`✅ Products WITH videos:  ${productsWithVideos.length} (${((productsWithVideos.length / allProducts.length) * 100).toFixed(1)}%)`);
    console.log(`❌ Products WITHOUT videos: ${productsWithoutVideos.length} (${((productsWithoutVideos.length / allProducts.length) * 100).toFixed(1)}%)`);
    console.log('\n═══════════════════════════════════════════════════════════\n');

    // Output results based on format
    if (OUTPUT_FORMAT === 'json') {
      const outputPath = path.join(process.cwd(), 'products-without-videos.json');
      const data = {
        summary: {
          total: allProducts.length,
          withVideos: productsWithVideos.length,
          withoutVideos: productsWithoutVideos.length,
          scanDate: new Date().toISOString(),
        },
        productsWithoutVideos: productsWithoutVideos.map(p => ({
          id: p.databaseId,
          name: p.name,
          slug: p.slug,
          sku: p.sku || 'N/A',
          url: `https://bapi.com/product/${p.slug}`,
        })),
      };

      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`📄 JSON report saved to: ${outputPath}\n`);

    } else if (OUTPUT_FORMAT === 'csv') {
      const outputPath = path.join(process.cwd(), 'products-without-videos.csv');
      const csvHeader = 'Database ID,Name,Slug,SKU,URL\n';
      const csvRows = productsWithoutVideos.map(p => 
        `${p.databaseId},"${p.name.replace(/"/g, '""')}",${p.slug},${p.sku || 'N/A'},https://bapi.com/product/${p.slug}`
      ).join('\n');

      fs.writeFileSync(outputPath, csvHeader + csvRows);
      console.log(`📄 CSV report saved to: ${outputPath}\n`);

    } else {
      // Console output (default)
      console.log('Products WITHOUT Videos:\n');
      console.log('ID     | SKU            | Name');
      console.log('-------+----------------+' + '-'.repeat(50));
      
      productsWithoutVideos.forEach(p => {
        const id = String(p.databaseId).padEnd(6);
        const sku = (p.sku || 'N/A').padEnd(14);
        const name = p.name.substring(0, 48);
        console.log(`${id} | ${sku} | ${name}`);
      });

      console.log('\n💡 TIP: Run with --output json or --output csv to save results to a file\n');
    }

    // Show some sample products WITH videos for comparison
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('Sample Products WITH Videos (first 5):');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    productsWithVideos.slice(0, 5).forEach(p => {
      const videoCount = p.productVideos?.reduce((sum, cat) => sum + (cat.videos?.length || 0), 0) || 0;
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
