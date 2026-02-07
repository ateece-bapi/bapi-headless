#!/usr/bin/env node
/**
 * Image Optimization Audit Script
 * 
 * Scans the codebase for:
 * 1. <img> tags that should be <Image />
 * 2. Images without optimization
 * 3. Missing WebP versions
 * 4. Large image files
 * 
 * Usage: node scripts/audit-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import globPkg from 'glob';

const { glob } = globPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const IMAGE_SIZE_WARNING = 200 * 1024; // 200KB
const IMAGE_SIZE_ERROR = 500 * 1024;   // 500KB

// Results storage
const results = {
  imgTags: [],
  largeImages: [],
  missingWebP: [],
  totalImages: 0,
  totalSize: 0,
};

/**
 * Find all <img> tags in TSX files
 */
async function findImgTags() {
  console.log('🔍 Scanning for <img> tags in TSX files...\n');
  
  const pattern = 'src/**/*.{tsx,jsx}';
  const files = await new Promise((resolve, reject) => {
    glob(pattern, { cwd: projectRoot }, (err, matches) => {
      if (err) reject(err);
      else resolve(matches);
    });
  });
  
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('<img')) {
        results.imgTags.push({
          file,
          line:index + 1,
          content: line.trim(),
        });
      }
    });
  }
  
  console.log(`Found ${results.imgTags.length} <img> tags\n`);
}

/**
 * Find large image files
 */
async function findLargeImages() {
  console.log('📊 Analyzing image file sizes...\n');
  
  const pattern = 'public/**/*.{jpg,jpeg,png,webp,gif}';
  const imageFiles = await new Promise((resolve, reject) => {
    glob(pattern, { cwd: projectRoot }, (err, matches) => {
      if (err) reject(err);
      else resolve(matches);
    });
  });
  
  for (const file of imageFiles) {
    const filePath = path.join(projectRoot, file);
    const stats = fs.statSync(filePath);
    
    results.totalImages++;
    results.totalSize += stats.size;
    
    if (stats.size > IMAGE_SIZE_WARNING) {
      results.largeImages.push({
        file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
        level: stats.size > IMAGE_SIZE_ERROR ? 'ERROR' : 'WARNING',
      });
    }
  }
  
  console.log(`Analyzed ${results.totalImages} images (${Math.round(results.totalSize / 1024 / 1024)}MB total)\n`);
}

/**
 * Find images without WebP versions
 */
async function findMissingWebP() {
  console.log('🖼️  Checking for WebP conversions...\n');
  
  const pattern = 'public/**/*.{jpg,jpeg,png}';
  const imageFiles = await new Promise((resolve, reject) => {
    glob(pattern, { cwd: projectRoot }, (err, matches) => {
      if (err) reject(err);
      else resolve(matches);
    });
  });
  
  for (const file of imageFiles) {
    const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const webpAbsPath = path.join(projectRoot, webpPath);
    
    if (!fs.existsSync(webpAbsPath)) {
      const filePath = path.join(projectRoot, file);
      const stats = fs.statSync(filePath);
      
      results.missingWebP.push({
        original: file,
        webpPath,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024),
      });
    }
  }
  
  console.log(`Found ${results.missingWebP.length} images without WebP versions\n`);
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📄 IMAGE OPTIMIZATION AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  // Summary
  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Images: ${results.totalImages}`);
  console.log(`Total Size: ${Math.round(results.totalSize / 1024 / 1024)}MB`);
  console.log(`<img> Tags Found: ${results.imgTags.length}`);
  console.log(`Large Images (>200KB): ${results.largeImages.length}`);
  console.log(`Missing WebP: ${results.missingWebP.length}`);
  console.log();
  
  // <img> Tags Report
  if (results.imgTags.length > 0) {
    console.log('🔴 <IMG> TAGS TO MIGRATE (Use Next.js <Image />)');
    console.log('-'.repeat(80));
    results.imgTags.forEach(({ file, line, content }) => {
      console.log(`${file}:${line}`);
      console.log(`  ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
    });
    console.log();
  }
  
  // Large Images Report
  if (results.largeImages.length > 0) {
    console.log('⚠️  LARGE IMAGES (Should be optimized)');
    console.log('-'.repeat(80));
    results.largeImages
      .sort((a, b) => b.size - a.size)
      .slice(0, 20) // Top 20
      .forEach(({ file, sizeKB, level }) => {
        const icon = level === 'ERROR' ? '❌' : '⚠️ ';
        console.log(`${icon} ${sizeKB}KB - ${file}`);
      });
    console.log();
  }
  
  // Missing WebP Report
  if (results.missingWebP.length > 0) {
    console.log('🖼️  IMAGES NEEDING WEBP CONVERSION');
    console.log('-'.repeat(80));
    results.missingWebP
      .sort((a, b) => b.size - a.size)
      .slice(0, 20) // Top 20
      .forEach(({ original, sizeKB }) => {
        console.log(`📄 ${sizeKB}KB - ${original}`);
      });
    console.log();
  }
  
  // Recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('-'.repeat(80));
  
  if (results.imgTags.length > 0) {
    console.log(`1. Replace ${results.imgTags.length} <img> tags with Next.js <Image /> component`);
    console.log('   - Enables automatic optimization');
    console.log('   - Adds lazy loading');
    console.log('   - Prevents layout shift\n');
  }
  
  if (results.largeImages.length > 0) {
    console.log(`2. Optimize ${results.largeImages.length} large images`);
    console.log('   - Resize to appropriate dimensions');
    console.log('   - Convert to WebP format');
    console.log('   - Use lower quality settings (75-85)\n');
  }
  
  if (results.missingWebP.length > 0) {
    console.log(`3. Convert ${results.missingWebP.length} images to WebP`);
    console.log('   - 25-35% smaller file size');
    console.log('   - Better compression than JPEG/PNG');
    console.log('   - Run: pnpm run convert-webp\n');
  }
  
  // Estimated savings
  const potentialSavings = results.missingWebP.reduce((sum, img) => sum + img.size, 0) * 0.30;
  console.log(`📈 POTENTIAL SAVINGS: ~${Math.round(potentialSavings / 1024 / 1024)}MB (30% compression)`);
  console.log();
  
  console.log('='.repeat(80));
  console.log('✅ Audit complete! See docs/IMAGE-OPTIMIZATION-IMPLEMENTATION.md for guidance.');
  console.log('='.repeat(80) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Starting Image Optimization Audit...\n');
  
  await findImgTags();
  await findLargeImages();
  await findMissingWebP();
  generateReport();
}

main().catch((error) => {
  console.error('❌ Error running audit:', error);
  process.exit(1);
});
