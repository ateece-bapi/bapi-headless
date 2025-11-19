#!/usr/bin/env node
/**
 * CI pre-deploy check for required production environment variables.
 * Exits with non-zero code when required vars are missing.
 * Intended to be run only in CI for the main branch before deployment.
 */

const required = [
  'NEXT_PUBLIC_WORDPRESS_GRAPHQL',
  'PREVIEW_SECRET'
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length === 0) {
  console.log('check_prod_envs: all required production env vars present');
  process.exit(0);
}

console.error('check_prod_envs: missing required production env vars:');
for (const k of missing) {
  console.error('  -', k);
}

console.error('\nRemediation: set the missing environment variables in your deployment provider or GitHub Secrets.');
console.error('See docs/PREVIEW-OPERATIONS.md for instructions on how to rotate or provision PREVIEW_SECRET.');

// Provide a short, copyable message for the CI log to help operators
console.error('\nTo set these in GitHub Actions (example):');
console.error('  Settings → Environments or Repository → Secrets → Actions → New repository secret');

process.exit(1);
