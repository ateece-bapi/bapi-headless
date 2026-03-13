#!/usr/bin/env node
/**
 * Verify Product Category Counts
 * 
 * This script queries the GraphQL API to fetch actual product counts
 * for each category and compares them with the hardcoded counts in
 * web/src/app/[locale]/products/page.tsx
 * 
 * Usage: cd web && node ../scripts/verify-product-counts.ts
 */

import('graphql-request').then(({ GraphQLClient }) => {
  verifyWithClient(GraphQLClient);
}).catch(err => {
  console.error('❌ Error loading graphql-request:', err.message);
  console.log('\n💡 Run this script from the web directory: cd web && node ../scripts/verify-product-counts.ts');
  process.exit(1);
});

function verifyWithClient(GraphQLClient) {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';

  if (!GRAPHQL_ENDPOINT) {
    console.error('❌ NEXT_PUBLIC_WORDPRESS_GRAPHQL environment variable not set');
    process.exit(1);
  }

// Hardcoded counts from web/src/app/[locale]/products/page.tsx
const HARDCODED_COUNTS: Record<string, number> = {
  'temperature-sensors': 119,
  'humidity-sensors': 33,
  'pressure-sensors': 39,
  'air-quality-sensors': 32,
  'wireless-sensors': 24,
  'accessories': 45,
  'test-instruments': 8,
  'eta-line': 70,
};

const TOTAL_HARDCODED = Object.values(HARDCODED_COUNTS).reduce((sum, count) => sum + count, 0);

interface ProductCategory {
  name: string;
  slug: string;
  count: number | null;
}

interface GetProductCategoriesResponse {
  productCategories: {
    nodes: ProductCategory[];
  };
}

const query = `
  query GetProductCategories($first: Int = 100) {
    productCategories(first: $first, where: { hideEmpty: false }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

async function verifyProductCounts(GraphQLClient, GRAPHQL_ENDPOINT) {
  console.log('🔍 Verifying Product Category Counts\n');
  console.log(`📡 GraphQL Endpoint: ${GRAPHQL_ENDPOINT}\n`);

  const client = new GraphQLClient(GRAPHQL_ENDPOINT);

  try {
    const data = await client.request<GetProductCategoriesResponse>(query, { first: 100 });
    const categories = data.productCategories.nodes;

    console.log('📊 Comparison Report:\n');
    console.log('Category                    | Hardcoded | GraphQL | Match | Diff');
    console.log('----------------------------|-----------|---------|-------|------');

    let totalGraphQL = 0;
    let matchCount = 0;
    let mismatchCount = 0;

    // Check each hardcoded category
    for (const [slug, hardcodedCount] of Object.entries(HARDCODED_COUNTS)) {
      const category = categories.find(cat => cat.slug === slug);
      const graphqlCount = category?.count ?? 0;
      totalGraphQL += graphqlCount;

      const match = hardcodedCount === graphqlCount;
      const matchIcon = match ? '✅' : '❌';
      const diff = graphqlCount - hardcodedCount;
      const diffStr = diff > 0 ? `+${diff}` : diff.toString();

      if (match) matchCount++;
      else mismatchCount++;

      const paddedName = (category?.name || slug).padEnd(27);
      const paddedHardcoded = hardcodedCount.toString().padStart(9);
      const paddedGraphQL = graphqlCount.toString().padStart(7);

      console.log(
        `${paddedName} | ${paddedHardcoded} | ${paddedGraphQL} | ${matchIcon}    | ${diffStr}`
      );
    }

    console.log('----------------------------|-----------|---------|-------|------');
    const paddedTotal = 'TOTAL'.padEnd(27);
    const paddedHardcodedTotal = TOTAL_HARDCODED.toString().padStart(9);
    const paddedGraphQLTotal = totalGraphQL.toString().padStart(7);
    const totalDiff = totalGraphQL - TOTAL_HARDCODED;
    const totalDiffStr = totalDiff > 0 ? `+${totalDiff}` : totalDiff.toString();

    console.log(
      `${paddedTotal} | ${paddedHardcodedTotal} | ${paddedGraphQLTotal} |       | ${totalDiffStr}\n`
    );

    // Summary
    console.log('📈 Summary:');
    console.log(`   ✅ Matches: ${matchCount}/${Object.keys(HARDCODED_COUNTS).length}`);
    console.log(`   ❌ Mismatches: ${mismatchCount}/${Object.keys(HARDCODED_COUNTS).length}`);
    console.log(`   📊 Total Products (Hardcoded): ${TOTAL_HARDCODED}`);
    console.log(`   📊 Total Products (GraphQL): ${totalGraphQL}`);
    console.log(`   📊 Difference: ${totalDiffStr}\n`);

    // Additional categories in WordPress not in hardcoded list
    const additionalCategories = categories.filter(
      cat => !Object.keys(HARDCODED_COUNTS).includes(cat.slug) && cat.count && cat.count > 0
    );

    if (additionalCategories.length > 0) {
      console.log('⚠️  Additional Categories in WordPress (not in hardcoded list):');
      additionalCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}): ${cat.count} products`);
      });
      console.log('');
    }

    // Recommendations
    if (mismatchCount > 0 || additionalCategories.length > 0) {
      console.log('💡 Recommendations:');
      if (mismatchCount > 0) {
        console.log('   1. Update hardcoded counts in web/src/app/[locale]/products/page.tsx');
      }
      if (additionalCategories.length > 0) {
        console.log('   2. Consider adding missing categories to the products page');
      }
      console.log('   3. Consider using GraphQL query instead of hardcoded data for real-time accuracy\n');
    } else {
      console.log('✅ All counts match! No updates needed.\n');
    }

    process.exit(mismatchCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error querying GraphQL API:', error);
    process.exit(1);
  }
}

verifyProductCounts(GraphQLClient, GRAPHQL_ENDPOINT);
}
