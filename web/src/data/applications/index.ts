/**
 * Application Landing Page Data Index
 *
 * Exports all application landing page data for easy importing.
 * Senior approach: Centralized data management.
 */

import { buildingAutomationData } from './building-automation';
import { dataCentersData } from './data-centers';
import { healthcareData } from './healthcare';
import { industrialData } from './industrial';
import { wirelessMonitoringData } from './wireless-monitoring';
import type { ApplicationLandingPageData } from '@/types/applications';

/**
 * All application landing pages
 * Keyed by slug for easy lookup
 */
export const applicationLandingPages: Record<string, ApplicationLandingPageData> = {
  'building-automation': buildingAutomationData,
  'data-centers': dataCentersData,
  healthcare: healthcareData,
  industrial: industrialData,
  'wireless-monitoring': wirelessMonitoringData,
};

/**
 * Get application data by slug
 * Returns undefined if not found (for 404 handling)
 */
export function getApplicationBySlug(slug: string): ApplicationLandingPageData | undefined {
  return applicationLandingPages[slug];
}

/**
 * Get all application slugs for static generation
 */
export function getAllApplicationSlugs(): string[] {
  return Object.keys(applicationLandingPages);
}

/**
 * Get all application data (for navigation, sitemaps, etc.)
 */
export function getAllApplications(): ApplicationLandingPageData[] {
  return Object.values(applicationLandingPages);
}
