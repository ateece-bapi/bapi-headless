#!/usr/bin/env node

/**
 * Optimize Wireless Hero Image
 * 
 * Original: 14999 x 9642 pixels, 35 MB PNG
 * Target: 2400px wide (for 2x retina at 1200px display), < 500KB
 * 
 * Creates both PNG and WebP versions
 */

const path = require('path');
const fs = require('fs');

// Resolve sharp from web/node_modules since that's where it's installed
const sharp = require(path.join(__dirname, '../web/node_modules/sharp'));

const inputPath = path.join(__dirname, '../web/public/images/wireless/Wireless_HVAC_2025_Plain.png');
const outputDir = path.join(__dirname, '../web/public/images/wireless');
const outputPngPath = path.join(outputDir, 'Wireless_HVAC_2025_Plain_optimized.png');
const outputWebpPath = path.join(outputDir, 'Wireless_HVAC_2025_Plain.webp');

async function optimizeImage() {
  try {
    console.log('📸 Starting image optimization...\n');
    
    // Get original file stats
    const originalStats = fs.statSync(inputPath);
    console.log(`Original file: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original dimensions: ${metadata.width} x ${metadata.height} pixels\n`);
    
    // Calculate new dimensions (max width 2400px, maintain aspect ratio)
    const maxWidth = 2400;
    const aspectRatio = metadata.height / metadata.width;
    const newWidth = Math.min(metadata.width, maxWidth);
    const newHeight = Math.round(newWidth * aspectRatio);
    
    console.log(`Target dimensions: ${newWidth} x ${newHeight} pixels\n`);
    
    // Create optimized PNG (for fallback)
    console.log('🖼️  Creating optimized PNG...');
    await sharp(inputPath)
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({
        quality: 90,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true // Use 8-bit palette if possible
      })
      .toFile(outputPngPath);
    
    const pngStats = fs.statSync(outputPngPath);
    console.log(`✅ PNG created: ${(pngStats.size / 1024).toFixed(0)} KB (${((1 - pngStats.size / originalStats.size) * 100).toFixed(1)}% smaller)\n`);
    
    // Create WebP version (better compression)
    console.log('🖼️  Creating WebP version...');
    await sharp(inputPath)
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6 // Higher effort = better compression (0-6)
      })
      .toFile(outputWebpPath);
    
    const webpStats = fs.statSync(outputWebpPath);
    console.log(`✅ WebP created: ${(webpStats.size / 1024).toFixed(0)} KB (${((1 - webpStats.size / originalStats.size) * 100).toFixed(1)}% smaller)\n`);
    
    console.log('📊 Summary:');
    console.log(`   Original:      ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Optimized PNG: ${(pngStats.size / 1024).toFixed(0)} KB`);
    console.log(`   WebP:          ${(webpStats.size / 1024).toFixed(0)} KB`);
    console.log(`\n🎉 Optimization complete!`);
    console.log(`\nNext steps:`);
    console.log(`1. Replace original with optimized PNG:`);
    console.log(`   mv ${outputPngPath} ${inputPath}`);
    console.log(`2. Update component to use WebP with PNG fallback`);
    
  } catch (error) {
    console.error('❌ Error optimizing image:', error);
    process.exit(1);
  }
}

optimizeImage();
