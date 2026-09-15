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

function getGraphQLEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  if (!endpoint) {
    console.error(
      '❌ NEXT_PUBLIC_WORDPRESS_GRAPHQL is not set. Set it to the WordPress GraphQL endpoint you want to export from (e.g. the production endpoint) before running this script -- silently falling back to a default could compare customer data against the wrong catalog.'
    );
    process.exit(1);
  }
  return endpoint;
}

const GRAPHQL_ENDPOINT = getGraphQLEndpoint();
const BATCH_SIZE = 100;
const OUTPUT_FORMAT = process.argv.includes('--output')
  ? process.argv[process.argv.indexOf('--output') + 1]
  : 'csv';

interface ProductVariationNode {
  databaseId: number;
  sku?: string | null;
}

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
  variations?: {
    nodes: ProductVariationNode[];
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
          variations(first: 100) {
            nodes {
              databaseId
              sku
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
          sku
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

/** Wraps a CSV field in quotes and escapes internal quotes -- every field can contain commas/quotes (e.g. `BA/T1K[20 TO 120F]-D-4"-BBX`). */
function csvField(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

interface ExportRow {
  databaseId: number;
  parentDatabaseId: number;
  isVariation: boolean;
  name: string;
  slug: string;
  sku: string;
  partNumber: string;
  categories: string;
  url: string;
}

async function main() {
  try {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT);
    const allProducts = await fetchAllProducts(client);

    const rows: ExportRow[] = [];
    allProducts.forEach(p => {
      const categories = (p.productCategories?.nodes || []).map(c => c.name).join('; ');
      const url = `https://bapisensors.com/en/product/${p.slug}`;

      rows.push({
        databaseId: p.databaseId,
        parentDatabaseId: p.databaseId,
        isVariation: false,
        name: p.name,
        slug: p.slug,
        sku: p.sku || '',
        partNumber: p.partNumber || '',
        categories,
        url,
      });

      // Variable products are frequently reordered by their variation SKU, not
      // the (often empty) parent SKU -- emit one row per variation so those
      // SKUs aren't missed when comparing against a customer's order history.
      (p.variations?.nodes || []).forEach(variation => {
        rows.push({
          databaseId: variation.databaseId,
          parentDatabaseId: p.databaseId,
          isVariation: true,
          name: p.name,
          slug: p.slug,
          sku: variation.sku || '',
          partNumber: '',
          categories,
          url,
        });
      });
    });

    if (OUTPUT_FORMAT === 'json') {
      const outputPath = path.join(process.cwd(), 'website-products-export.json');
      fs.writeFileSync(
        outputPath,
        JSON.stringify({ exportDate: new Date().toISOString(), total: rows.length, products: rows }, null, 2)
      );
      console.log(`📄 JSON export saved to: ${outputPath}\n`);
    } else {
      const outputPath = path.join(process.cwd(), 'website-products-export.csv');
      const csvHeader =
        'Database ID,Parent Database ID,Is Variation,Name,Slug,SKU,Part Number,Categories,URL\n';
      const csvRows = rows
        .map(r =>
          [
            r.databaseId,
            r.parentDatabaseId,
            r.isVariation,
            csvField(r.name),
            csvField(r.slug),
            csvField(r.sku),
            csvField(r.partNumber),
            csvField(r.categories),
            csvField(r.url),
          ].join(',')
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
