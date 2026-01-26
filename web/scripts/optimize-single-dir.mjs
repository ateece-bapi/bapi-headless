import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const directory = process.argv[2];

if (!directory) {
  console.log('Usage: node optimize-single-dir.mjs <directory>');
  process.exit(1);
}

async function convertToWebP(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.tif', '.tiff'].includes(ext)) {
    return null;
  }

  const outputPath = inputPath.replace(/\.(png|jpg|jpeg|tif|tiff)$/i, '.webp');
  const stats = await fs.stat(inputPath);
  const originalSize = stats.size / (1024 * 1024);

  try {
    await sharp(inputPath)
      .webp({ quality: 85, lossless: false })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size / (1024 * 1024);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✓ ${path.basename(inputPath)} (${originalSize.toFixed(2)} MB) → ${newSize.toFixed(2)} MB WebP (${savings}% smaller)`);
    
    return { original: originalSize, webp: newSize };
  } catch (error) {
    console.error(`✗ ${path.basename(inputPath)}: ${error.message}`);
    return null;
  }
}

async function processDirectory(dir) {
  console.log(`\n📁 Processing: ${dir}\n`);
  
  const files = await fs.readdir(dir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|tif|tiff)$/i.test(f));
  
  let totalOriginal = 0;
  let totalWebP = 0;
  let processed = 0;

  for (const file of imageFiles) {
    const result = await convertToWebP(path.join(dir, file));
    if (result) {
      totalOriginal += result.original;
      totalWebP += result.webp;
      processed++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Files processed: ${processed}`);
  console.log(`Original size: ${totalOriginal.toFixed(2)} MB`);
  console.log(`WebP size: ${totalWebP.toFixed(2)} MB`);
  console.log(`Total savings: ${(totalOriginal - totalWebP).toFixed(2)} MB (${((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(1)}%)`);
  console.log(`${'='.repeat(60)}\n`);
}

processDirectory(directory);
