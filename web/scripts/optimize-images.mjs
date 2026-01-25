#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Optimizes PNG images using sharp:
 * - Converts large PNGs to WebP format (90% smaller, modern browsers)
 * - Keeps original PNGs as fallback
 * - Compresses PNGs for browsers that don't support WebP
 * 
 * Usage:
 *   pnpm optimize:images              # Optimize all images
 *   pnpm optimize:images families     # Optimize only product families
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const imageDirectories = {
  families: 'public/images/products/families',
  logos: 'public/images/logos',
  installations: 'public/images/installations',
  displays: 'public/images/displays',
  icons: 'public/images/icons',
};

async function getAllImageFiles(dir) {
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      files.push(...(await getAllImageFiles(fullPath)));
    } else if (['.png', '.jpg', '.jpeg'].includes(extname(item).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimizeImage(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  const outputWebP = imagePath.replace(ext, '.webp');
  const fileStats = await stat(imagePath);
  const originalSize = fileStats.size;

  console.log(`\n📸 Processing: ${basename(imagePath)}`);
  console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

  try {
    // Create WebP version (90% smaller, great quality)
    await sharp(imagePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputWebP);

    const webpStats = await stat(outputWebP);
    const webpSize = webpStats.size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

    console.log(`   ✅ WebP created: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${savings}% smaller)`);

    // Compress original PNG/JPG (keep as fallback)
    if (ext === '.png') {
      const tempPath = imagePath + '.tmp';
      await sharp(imagePath)
        .png({ compressionLevel: 9, quality: 85 })
        .toFile(tempPath);

      const compressedStats = await stat(tempPath);
      const compressedSize = compressedStats.size;
      const pngSavings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      // Only replace if we saved space
      if (compressedSize < originalSize) {
        await sharp(tempPath).toFile(imagePath);
        console.log(`   ✅ PNG optimized: ${(compressedSize / 1024 / 1024).toFixed(2)} MB (${pngSavings}% smaller)`);
      } else {
        console.log(`   ℹ️  PNG already optimized, keeping original`);
      }

      // Clean up temp file
      try {
        await import('fs').then(fs => fs.promises.unlink(tempPath));
      } catch (e) {
        // Temp file might not exist, ignore
      }
    }

    return {
      original: originalSize,
      webp: webpSize,
      savings: originalSize - webpSize,
    };
  } catch (error) {
    console.error(`   ❌ Error optimizing ${basename(imagePath)}:`, error.message);
    return { original: originalSize, webp: 0, savings: 0 };
  }
}

async function main() {
  const targetDir = process.argv[2];
  let dirsToProcess = [];

  if (targetDir && imageDirectories[targetDir]) {
    dirsToProcess = [{ name: targetDir, path: imageDirectories[targetDir] }];
  } else {
    dirsToProcess = Object.entries(imageDirectories).map(([name, path]) => ({ name, path }));
  }

  console.log('🎨 BAPI Image Optimization Script\n');
  console.log('Target directories:', dirsToProcess.map(d => d.name).join(', '));

  let totalOriginal = 0;
  let totalWebP = 0;
  let totalFiles = 0;

  for (const { name, path } of dirsToProcess) {
    console.log(`\n📁 Processing: ${name}`);
    
    try {
      const images = await getAllImageFiles(path);
      console.log(`   Found ${images.length} images`);

      for (const imagePath of images) {
        const result = await optimizeImage(imagePath);
        totalOriginal += result.original;
        totalWebP += result.webp;
        totalFiles++;
      }
    } catch (error) {
      console.error(`   ⚠️  Directory not found or error: ${path}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files processed: ${totalFiles}`);
  console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP size: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((totalOriginal - totalWebP) / 1024 / 1024).toFixed(2)} MB (${((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
  console.log('\n✨ Optimization complete!\n');
}

main().catch(console.error);
