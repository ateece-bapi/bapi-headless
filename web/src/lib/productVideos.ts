/**
 * Product Videos Data Loader
 * 
 * Loads videos for products from the generated JSON file.
 * Videos are mapped by product SKU or product ID.
 */

import productVideosData from '@/data/product-videos.json';

export interface ProductVideo {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  duration: string;
  category?: string;
}

/**
 * Get videos for a product by SKU or Product ID
 * 
 * @param productSku - Product SKU (e.g., "BA/3324VC")
 * @param productId - Product ID (e.g., "418359")
 * @returns Array of videos for the product, or empty array if none found
 */
export function getProductVideos(
  productSku?: string | null,
  productId?: string | null
): ProductVideo[] {
  const videos: ProductVideo[] = [];

  // Try SKU first
  if (productSku && productSku in productVideosData) {
    videos.push(...(productVideosData as Record<string, ProductVideo[]>)[productSku]);
  }

  // Try Product ID if no SKU match
  if (videos.length === 0 && productId && productId in productVideosData) {
    videos.push(...(productVideosData as Record<string, ProductVideo[]>)[productId]);
  }

  return videos;
}

/**
 * Check if a product has videos
 */
export function hasProductVideos(
  productSku?: string | null,
  productId?: string | null
): boolean {
  return getProductVideos(productSku, productId).length > 0;
}
