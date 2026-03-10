#!/usr/bin/env node
/**
 * Download GraphQL schema from WordPress backend for codegen.ts
 *
 * Usage:
 *   node scripts/download-schema.mjs
 *
 * Requires NEXT_PUBLIC_WORDPRESS_GRAPHQL to be set in .env
 */

import { writeFileSync } from 'fs';
import { getIntrospectionQuery } from 'graphql';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL ||
  'https://bapi-staging.kinsta.cloud/graphql';

console.log(`📡 Fetching GraphQL schema from: ${GRAPHQL_ENDPOINT}`);

try {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors, null, 2)}`);
  }

  writeFileSync('schema.json', JSON.stringify(result.data, null, 2));
  console.log('✅ Schema saved to schema.json');
  console.log(`📊 Schema size: ${(JSON.stringify(result.data).length / 1024).toFixed(1)}KB`);
} catch (error) {
  console.error('❌ Failed to download schema:', error.message);
  process.exit(1);
}
