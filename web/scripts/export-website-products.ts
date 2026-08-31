#!/usr/bin/env tsx
/**
 * Export Website Products
 *
 * Exports every product currently published on the website (SKU, part number,
 * name, slug, categories) to CSV so it can be compared against external lists
 * (e.g. a customer's FileMaker order history) to find products that need to
 * be added to the site.
 *
 * Usage:
 *   pnpm tsx scripts/export-website-products.ts
 *   pnpm tsx scripts/export-website-products.ts --output json
 */

import { GraphQLClient, gql } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';
const BATCH_SIZE = 100;
const OUTPUT_FORMAT = process.argv.includes('--output')
  ? process.argv[process.argv.indexOf('--output') + 1]
  : 'csv';

interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  partNumber?: string | null;
  productCategories?: {
    nodes: { name: string }[];
  } | null;
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

const PRODUCTS_QUERY = gql`
  query GetAllProductsForExport($first: Int!, $after: String) {
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
          partNumber
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on VariableProduct {
          sku
          partNumber
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on ExternalProduct {
          sku
          partNumber
          productCategories {
            nodes {
              name
            }
          }
        }
        ... on GroupProduct {
          partNumber
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

async function main() {
  try {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT);
    const allProducts = await fetchAllProducts(client);

    const rows = allProducts.map(p => ({
      databaseId: p.databaseId,
      name: p.name,
      slug: p.slug,
      sku: p.sku || '',
      partNumber: p.partNumber || '',
      categories: (p.productCategories?.nodes || []).map(c => c.name).join('; '),
      url: `https://bapisensors.com/product/${p.slug}`,
    }));

    if (OUTPUT_FORMAT === 'json') {
      const outputPath = path.join(process.cwd(), 'website-products-export.json');
      fs.writeFileSync(
        outputPath,
        JSON.stringify({ exportDate: new Date().toISOString(), total: rows.length, products: rows }, null, 2)
      );
      console.log(`📄 JSON export saved to: ${outputPath}\n`);
    } else {
      const outputPath = path.join(process.cwd(), 'website-products-export.csv');
      const csvHeader = 'Database ID,Name,Slug,SKU,Part Number,Categories,URL\n';
      const csvRows = rows
        .map(
          r =>
            `${r.databaseId},"${r.name.replace(/"/g, '""')}",${r.slug},${r.sku},${r.partNumber},"${r.categories.replace(/"/g, '""')}",${r.url}`
        )
        .join('\n');

      fs.writeFileSync(outputPath, csvHeader + csvRows);
      console.log(`📄 CSV export saved to: ${outputPath}\n`);
    }

    console.log(`Total products exported: ${rows.length}`);
  } catch (error) {
    console.error('❌ Error exporting products:', error);
    process.exit(1);
  }
}

main();
