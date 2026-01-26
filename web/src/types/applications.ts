/**
 * TypeScript interfaces for Application Landing Pages
 * Phase 16: Applications Landing Pages
 * 
 * These types define the structure for high-level application landing pages
 * that sit between the applications hub and granular subcategory pages.
 */

/**
 * Single statistic displayed in hero section
 */
export interface ApplicationStat {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Hero section data for application landing page
 */
export interface ApplicationHero {
  /** Hero image path (installation photo) */
  image: string;
  /** Alt text for hero image */
  imageAlt: string;
  /** Main headline */
  title: string;
  /** Compelling tagline/description */
  tagline: string;
  /** 3 key statistics */
  stats: ApplicationStat[];
}

/**
 * Challenge/problem that customers face
 */
export interface ApplicationChallenge {
  /** Short challenge title */
  title: string;
  /** Detailed description */
  description: string;
}

/**
 * BAPI solution to customer challenge
 */
export interface ApplicationSolution {
  /** Short solution title */
  title: string;
  /** Detailed description */
  description: string;
  /** Optional array of key features */
  features?: string[];
}

/**
 * Product category relevant to this application
 */
export interface ApplicationProductCategory {
  /** Category display name */
  name: string;
  /** Description of how this category applies */
  description: string;
  /** Link to filtered products */
  link: string;
}

/**
 * Benefit of using BAPI for this application
 */
export interface ApplicationBenefit {
  /** Short benefit title */
  title: string;
  /** Detailed description */
  description: string;
}

/**
 * Real-world example or mini case study
 */
export interface ApplicationExample {
  /** Example title/name */
  title: string;
  /** Brief description */
  description: string;
  /** Optional installation image */
  image?: string;
  /** Optional image alt text */
  imageAlt?: string;
  /** Result outcome (single string with multiple points) */
  result: string;
}

/**
 * Call-to-action button configuration
 */
export interface ApplicationCTA {
  /** CTA button text */
  text: string;
  /** Destination URL */
  link: string;
  /** Button variant (primary uses accent-500, secondary uses primary-500) */
  variant: 'primary' | 'secondary';
}

/**
 * SEO metadata for application landing page
 */
export interface ApplicationSEO {
  /** Page title (50-60 chars) */
  title: string;
  /** Meta description (150-160 chars) */
  description: string;
  /** Keywords for SEO */
  keywords: string[];
  /** Open Graph image */
  ogImage?: string;
}

/**
 * Complete application landing page data
 * 
 * This is the main interface that defines all content for an application landing page.
 * Senior approach: Data-driven pages instead of duplicated components.
 */
export interface ApplicationLandingPageData {
  /** Unique slug for URL routing */
  slug: string;
  /** Application name */
  name: string;
  /** Hero section data */
  hero: ApplicationHero;
  /** Introduction paragraph (optional) */
  introduction?: string;
  /** Customer challenges */
  challenges: ApplicationChallenge[];
  /** BAPI solutions */
  solutions: ApplicationSolution[];
  /** Product categories for this application */
  productCategories: ApplicationProductCategory[];
  /** Benefits grid */
  benefits: ApplicationBenefit[];
  /** Real-world examples (mini case studies) */
  examples: ApplicationExample[];
  /** Call-to-action buttons */
  ctas: {
    primary: ApplicationCTA;
    secondary: ApplicationCTA;
  };
  /** SEO metadata */
  seo: ApplicationSEO;
}

/**
 * Type guard to validate application data at runtime
 */
export function isValidApplicationData(data: unknown): data is ApplicationLandingPageData {
  if (typeof data !== 'object' || data === null) return false;
  
  const app = data as ApplicationLandingPageData;
  
  return (
    typeof app.slug === 'string' &&
    typeof app.name === 'string' &&
    typeof app.hero === 'object' &&
    Array.isArray(app.challenges) &&
    Array.isArray(app.solutions) &&
    Array.isArray(app.productCategories) &&
    Array.isArray(app.benefits) &&
    Array.isArray(app.examples) &&
    typeof app.ctas === 'object' &&
    typeof app.seo === 'object'
  );
}
