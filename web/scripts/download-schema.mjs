#!/usr/bin/env node
/**
 * Download GraphQL schema from WordPress backend for codegen.ts
 *
 * Usage:
 *   cd web && pnpm run schema:download
 *
 * Requires NEXT_PUBLIC_WORDPRESS_GRAPHQL to be set in your environment.
 * The script will exit with an error if this variable is not defined.
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getIntrospectionQuery } from 'graphql';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

if (!GRAPHQL_ENDPOINT) {
  console.error(
    '❌ Environment variable NEXT_PUBLIC_WORDPRESS_GRAPHQL is not set. ' +
      'Please define it in your .env file (or environment) before running scripts/download-schema.mjs.',
  );
  process.exit(1);
}

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

  // Resolve path relative to script location (web/scripts/) to ensure schema.json lands in web/
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const schemaPath = join(__dirname, '..', 'schema.json');

  writeFileSync(schemaPath, JSON.stringify(result.data, null, 2));
  console.log(`✅ Schema saved to ${schemaPath}`);
  console.log(`📊 Schema size: ${(JSON.stringify(result.data).length / 1024).toFixed(1)}KB`);
} catch (error) {
  console.error('❌ Failed to download schema:', error.message);
  process.exit(1);
}
