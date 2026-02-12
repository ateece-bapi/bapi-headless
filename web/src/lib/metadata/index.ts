/**
 * Metadata Generation System
 *
 * Centralized exports for enterprise-level SEO metadata generation.
 * Use these utilities to create consistent, AI-friendly metadata
 * across all pages.
 *
 * @example
 * ```tsx
 * import { generateProductMetadata } from '@/lib/metadata';
 *
 * export async function generateMetadata({ params }) {
 *   const product = await getProduct(params.slug);
 *   return generateProductMetadata(product);
 * }
 * ```
 */

export * from './types';
export * from './generators';
export { SITE_CONFIG } from './generators';
