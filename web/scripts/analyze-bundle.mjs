#!/usr/bin/env node
/**
 * Bundle Size Analyzer
 * 
 * Analyzes Next.js build output to identify:
 * - Large dependencies
 * - Code splitting opportunities
 * - Duplicate dependencies
 * - Bundle size trends
 * 
 * Usage:
 *   node scripts/analyze-bundle.mjs
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('📦 BAPI Bundle Analysis');
console.log('======================\n');

// Read package.json
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

console.log('📚 Dependencies Analysis');
console.log('========================\n');

// Analyze dependencies
const allDeps = { ...dependencies, ...devDependencies };
const depList = Object.entries(allDeps).sort((a, b) => a[0].localeCompare(b[0]));

console.log(`Total dependencies: ${depList.length}`);
console.log(`  Production: ${Object.keys(dependencies).length}`);
console.log(`  Development: ${Object.keys(devDependencies).length}\n`);

// Key dependencies with estimated sizes
const keyDependencies = [
  { name: 'next', type: 'framework', critical: true },
  { name: 'react', type: 'framework', critical: true },
  { name: 'react-dom', type: 'framework', critical: true },
  { name: '@clerk/nextjs', type: 'auth', critical: true },
  { name: '@stripe/stripe-js', type: 'payment', critical: true },
  { name: '@stripe/react-stripe-js', type: 'payment', critical: true },
  { name: 'graphql-request', type: 'api', critical: true },
  { name: 'zustand', type: 'state', critical: false },
  { name: 'lucide-react', type: 'icons', critical: false },
  { name: 'next-intl', type: 'i18n', critical: false },
  { name: 'clsx', type: 'utility', critical: false },
  { name: 'sonner', type: 'ui', critical: false },
];

console.log('🎯 Key Dependencies');
console.log('===================\n');

keyDependencies.forEach(dep => {
  const version = dependencies[dep.name] || devDependencies[dep.name] || 'not installed';
  const critical = dep.critical ? '⚠️  Critical' : '✅ Optional';
  console.log(`${dep.name.padEnd(30)} ${version.padEnd(15)} ${dep.type.padEnd(12)} ${critical}`);
});

// Check for potential duplicate dependencies
console.log('\n🔍 Checking for Common Issues');
console.log('==============================\n');

const warnings = [];

// Check for date libraries (should only use Intl)
const dateLibs = ['date-fns', 'moment', 'dayjs', 'luxon'];
const foundDateLibs = dateLibs.filter(lib => allDeps[lib]);
if (foundDateLibs.length > 0) {
  warnings.push(`⚠️  Date libraries found: ${foundDateLibs.join(', ')} - Consider using native Intl API`);
}

// Check for multiple icon libraries
const iconLibs = ['lucide-react', 'react-icons', '@heroicons/react', 'feather-icons'];
const foundIconLibs = iconLibs.filter(lib => allDeps[lib]);
if (foundIconLibs.length > 1) {
  warnings.push(`⚠️  Multiple icon libraries: ${foundIconLibs.join(', ')} - Consolidate to one`);
}

// Check for CSS-in-JS libraries (we use Tailwind)
const cssInJsLibs = ['styled-components', '@emotion/react', '@emotion/styled', 'linaria'];
const foundCssLibs = cssInJsLibs.filter(lib => allDeps[lib]);
if (foundCssLibs.length > 0) {
  warnings.push(`⚠️  CSS-in-JS libraries: ${foundCssLibs.join(', ')} - Using Tailwind, consider removing`);
}

// Check for state management duplicates
const stateLibs = ['zustand', 'redux', '@reduxjs/toolkit', 'jotai', 'recoil'];
const foundStateLibs = stateLibs.filter(lib => allDeps[lib]);
if (foundStateLibs.length > 1) {
  warnings.push(`⚠️  Multiple state libraries: ${foundStateLibs.join(', ')} - Consolidate to one`);
}

if (warnings.length === 0) {
  console.log('✅ No common issues detected');
} else {
  warnings.forEach(warning => console.log(warning));
}

// Recommendations
console.log('\n💡 Optimization Recommendations');
console.log('================================\n');

const recommendations = [
  '1. Use dynamic imports for heavy components (Stripe, Charts)',
  '2. Implement code splitting for route-level components',
  '3. Tree-shake unused exports from lucide-react',
  '4. Consider lazy loading non-critical dependencies',
  '5. Analyze actual bundle with: pnpm build && pnpm experimental-analyze',
  '6. Monitor Core Web Vitals in production',
  '7. Use Next.js Image component for all images',
  '8. Implement proper caching headers for static assets',
];

recommendations.forEach(rec => console.log(rec));

// Build size report
console.log('\n🏗️  Build Analysis');
console.log('=================\n');

try {
  console.log('Running production build...\n');
  execSync('pnpm run build', { 
    stdio: 'inherit',
    cwd: projectRoot 
  });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('\n✨ Bundle analysis complete!\n');
console.log('📝 Next steps:');
console.log('  1. Review build output above for First Load JS sizes');
console.log('  2. Run performance audit: node scripts/performance-audit.mjs');
console.log('  3. Test on staging: node scripts/performance-audit.mjs https://bapi-headless.vercel.app');
console.log('  4. Monitor Core Web Vitals in Vercel Analytics\n');
