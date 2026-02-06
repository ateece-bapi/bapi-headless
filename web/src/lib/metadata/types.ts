/**
 * Metadata Types for SEO and Social Sharing
 * 
 * Type-safe interfaces for generating comprehensive metadata
 * across the entire site, optimized for search engines and AI systems.
 */

import type { Metadata } from 'next';

/**
 * Product-specific metadata configuration
 */
export interface ProductMetadataInput {
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  sku?: string | null;
  partNumber?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  galleryImages?: Array<{
    sourceUrl?: string | null;
    altText?: string | null;
  }> | null;
  categories?: Array<{
    name?: string | null;
    slug?: string | null;
  }> | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  stockStatus?: string | null;
  featured?: boolean | null;
}

/**
 * Category-specific metadata configuration
 */
export interface CategoryMetadataInput {
  name: string;
  slug: string;
  description?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  count?: number | null;
  parent?: {
    name?: string | null;
    slug?: string | null;
  } | null;
}

/**
 * Page-specific metadata configuration
 */
export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Site-wide metadata defaults
 */
export interface SiteMetadataConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
  locale: string;
  localeAlternates: string[];
  organizationName: string;
  keywords: string[];
}
