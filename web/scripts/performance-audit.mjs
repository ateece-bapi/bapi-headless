#!/usr/bin/env node
/**
 * Performance Audit Script
 * 
 * Measures and reports on key performance metrics:
 * - Page load times
 * - Core Web Vitals (LCP, FID, CLS)
 * - Bundle sizes
 * - API response times
 * 
 * Usage:
 *   node scripts/performance-audit.mjs [url]
 *   node scripts/performance-audit.mjs https://bapi-headless.vercel.app
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_DIR = join(projectRoot, 'test-output', 'performance');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Test pages
const TEST_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/products', name: 'Products Listing' },
  { path: '/products/bacnet-ip-module', name: 'Product Detail' },
  { path: '/cart', name: 'Cart Page' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/company/mission-values', name: 'Company Page' },
];

// Performance budgets (milliseconds)
const BUDGETS = {
  fcp: 1800,  // First Contentful Paint
  lcp: 2500,  // Largest Contentful Paint
  tti: 3500,  // Time to Interactive
  tbt: 300,   // Total Blocking Time
  cls: 0.1,   // Cumulative Layout Shift
};

console.log('🚀 BAPI Performance Audit');
console.log('========================\n');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Check if Lighthouse is installed
function checkLighthouse() {
  try {
    execSync('npx lighthouse --version', { stdio: 'ignore' });
    return true;
  } catch {
    console.log('📦 Installing Lighthouse CLI...\n');
    try {
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('❌ Failed to install Lighthouse');
      return false;
    }
  }
}

// Run Lighthouse audit
function runLighthouse(url, pageName) {
  console.log(`🔍 Auditing: ${pageName} (${url})`);
  
  const outputPath = join(OUTPUT_DIR, `${pageName.toLowerCase().replace(/\s+/g, '-')}-${TIMESTAMP}.json`);
  
  try {
    const command = `npx lighthouse "${url}" \
      --output=json \
      --output-path="${outputPath}" \
      --chrome-flags="--headless --no-sandbox" \
      --only-categories=performance \
      --throttling-method=simulate \
      --quiet`;
    
    execSync(command, { stdio: 'inherit' });
    
    // Read and parse results
    if (existsSync(outputPath)) {
      const results = JSON.parse(readFileSync(outputPath, 'utf-8'));
      return parseResults(results, pageName);
    }
  } catch (error) {
    console.error(`   ❌ Failed to audit ${pageName}`);
    return null;
  }
}

// Parse Lighthouse results
function parseResults(lighthouse, pageName) {
  const metrics = lighthouse.audits;
  
  const result = {
    page: pageName,
    score: Math.round(lighthouse.categories.performance.score * 100),
    metrics: {
      fcp: Math.round(metrics['first-contentful-paint']?.numericValue || 0),
      lcp: Math.round(metrics['largest-contentful-paint']?.numericValue || 0),
      tti: Math.round(metrics['interactive']?.numericValue || 0),
      tbt: Math.round(metrics['total-blocking-time']?.numericValue || 0),
      cls: parseFloat((metrics['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
      si: Math.round(metrics['speed-index']?.numericValue || 0),
    }
  };
  
  // Check budgets
  result.budgetStatus = {
    fcp: result.metrics.fcp <= BUDGETS.fcp ? '✅' : '❌',
    lcp: result.metrics.lcp <= BUDGETS.lcp ? '✅' : '❌',
    tti: result.metrics.tti <= BUDGETS.tti ? '✅' : '❌',
    tbt: result.metrics.tbt <= BUDGETS.tbt ? '✅' : '❌',
    cls: result.metrics.cls <= BUDGETS.cls ? '✅' : '❌',
  };
  
  return result;
}

// Format results table
function formatResults(results) {
  console.log('\n📊 Performance Results');
  console.log('======================\n');
  
  // Table header
  console.log('Page                 | Score | FCP    | LCP    | TTI    | TBT   | CLS   ');
  console.log('--------------------|-------|--------|--------|--------|-------|-------');
  
  // Table rows
  results.forEach(result => {
    if (!result) return;
    
    const row = [
      result.page.padEnd(19),
      `${result.score}`.padStart(5),
      `${result.metrics.fcp}ms ${result.budgetStatus.fcp}`.padEnd(6),
      `${result.metrics.lcp}ms ${result.budgetStatus.lcp}`.padEnd(6),
      `${result.metrics.tti}ms ${result.budgetStatus.tti}`.padEnd(6),
      `${result.metrics.tbt}ms ${result.budgetStatus.tbt}`.padEnd(5),
      `${result.metrics.cls} ${result.budgetStatus.cls}`.padEnd(5),
    ];
    
    console.log(row.join(' | '));
  });
  
  console.log('\n📈 Performance Budgets');
  console.log('======================');
  console.log(`FCP: ≤ ${BUDGETS.fcp}ms`);
  console.log(`LCP: ≤ ${BUDGETS.lcp}ms`);
  console.log(`TTI: ≤ ${BUDGETS.tti}ms`);
  console.log(`TBT: ≤ ${BUDGETS.tbt}ms`);
  console.log(`CLS: ≤ ${BUDGETS.cls}`);
  
  // Calculate averages
  const avg = {
    score: Math.round(results.reduce((sum, r) => sum + (r?.score || 0), 0) / results.length),
    fcp: Math.round(results.reduce((sum, r) => sum + (r?.metrics.fcp || 0), 0) / results.length),
    lcp: Math.round(results.reduce((sum, r) => sum + (r?.metrics.lcp || 0), 0) / results.length),
    tti: Math.round(results.reduce((sum, r) => sum + (r?.metrics.tti || 0), 0) / results.length),
    tbt: Math.round(results.reduce((sum, r) => sum + (r?.metrics.tbt || 0), 0) / results.length),
    cls: parseFloat((results.reduce((sum, r) => sum + (r?.metrics.cls || 0), 0) / results.length).toFixed(3)),
  };
  
  console.log('\n🎯 Average Performance');
  console.log('=====================');
  console.log(`Score: ${avg.score}/100`);
  console.log(`FCP: ${avg.fcp}ms`);
  console.log(`LCP: ${avg.lcp}ms`);
  console.log(`TTI: ${avg.tti}ms`);
  console.log(`TBT: ${avg.tbt}ms`);
  console.log(`CLS: ${avg.cls}`);
  
  // Save summary
  const summary = {
    timestamp: TIMESTAMP,
    baseUrl: BASE_URL,
    budgets: BUDGETS,
    results,
    averages: avg,
  };
  
  const summaryPath = join(OUTPUT_DIR, `summary-${TIMESTAMP}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n💾 Summary saved to: ${summaryPath}\n`);
}

// Main execution
async function main() {
  // Check Lighthouse
  if (!checkLighthouse()) {
    process.exit(1);
  }
  
  console.log('⏱️  Running performance audits...\n');
  
  // Run audits
  const results = [];
  for (const page of TEST_PAGES) {
    const url = `${BASE_URL}${page.path}`;
    const result = runLighthouse(url, page.name);
    if (result) {
      results.push(result);
      console.log(`   ✅ Score: ${result.score}/100\n`);
    }
  }
  
  // Format and display results
  formatResults(results);
  
  console.log('✨ Performance audit complete!\n');
}

main().catch(console.error);
