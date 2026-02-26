/**
 * Breadcrumb Navigation Utilities
 *
 * Generates breadcrumb trails for product, category, and content pages
 * Supports i18n and Schema.org structured data
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbLabels {
  home?: string;
  products?: string;
  search?: string;
}

export interface BreadcrumbOptions {
  locale: string;
  includeHome?: boolean;
  labels?: BreadcrumbLabels;
}

/**
 * Get default label with i18n support
 */
function getLabel(key: string, labels?: BreadcrumbLabels): string {
  if (labels) {
    if (key === 'home' && labels.home) return labels.home;
    if (key === 'products' && labels.products) return labels.products;
    if (key === 'search' && labels.search) return labels.search;
  }
  // Default English labels
  const defaults: Record<string, string> = {
    home: 'Home',
    products: 'Products',
    search: 'Search',
  };
  return defaults[key] || key;
}

/**
 * Generate breadcrumbs for product category pages
 */
export function getCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: getLabel('products', labels),
    href: `/${locale}/products`,
  });

  breadcrumbs.push({
    label: categoryName,
    href: `/${locale}/categories/${categorySlug}`,
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for product subcategory pages
 */
export function getSubcategoryBreadcrumbs(
  parentCategoryName: string,
  parentCategorySlug: string,
  subcategoryName: string,
  subcategorySlug: string,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: getLabel('products', labels),
    href: `/${locale}/products`,
  });

  breadcrumbs.push({
    label: parentCategoryName,
    href: `/${locale}/categories/${parentCategorySlug}`,
  });

  breadcrumbs.push({
    label: subcategoryName,
    href: `/${locale}/products/${parentCategorySlug}/${subcategorySlug}`,
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for individual product pages
 */
export function getProductBreadcrumbs(
  productName: string,
  productSlug: string,
  categories: Array<{
    name: string;
    slug: string;
    parent?: {
      name: string;
      slug: string;
    };
  }>,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: getLabel('products', labels),
    href: `/${locale}/products`,
  });

  // Use the first category (primary category)
  if (categories.length > 0) {
    const primaryCategory = categories[0];

    // Add parent category if exists
    if (primaryCategory.parent) {
      breadcrumbs.push({
        label: primaryCategory.parent.name,
        href: `/${locale}/categories/${primaryCategory.parent.slug}`,
      });
    }

    // Add current category
    breadcrumbs.push({
      label: primaryCategory.name,
      href: `/${locale}/products/${primaryCategory.parent?.slug || 'all'}/${primaryCategory.slug}`,
    });
  }

  // Add product itself (no link on current page)
  breadcrumbs.push({
    label: productName,
  });

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for search results pages
 */
export function getSearchBreadcrumbs(
  searchQuery: string,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: getLabel('products', labels),
    href: `/${locale}/products`,
  });

  breadcrumbs.push({
    label: `${getLabel('search', labels)}: "${searchQuery}"`,
  });

  return breadcrumbs;
}

/**
 * Convert breadcrumb items to Schema.org BreadcrumbList format
 *
 * This function provides improved schema generation compared to generateBreadcrumbSchema:
 * - URL normalization to prevent double slashes
 * - Filtering of invalid/empty hrefs
 * - Integration with BreadcrumbItem type
 * - Proper handling of relative URLs
 *
 * @param breadcrumbs - Array of breadcrumb items with label and optional href
 * @param siteUrl - Base site URL (e.g., "https://bapi.com")
 * @returns Schema.org BreadcrumbList object for structured data
 */
export function breadcrumbsToSchemaOrg(breadcrumbs: BreadcrumbItem[], siteUrl: string) {
  // Normalize siteUrl to avoid double slashes
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');

  const itemListElement = breadcrumbs
    // Only include items with non-empty hrefs in schema
    .filter((crumb) => typeof crumb.href === 'string' && crumb.href.trim().length > 0)
    .map((crumb, index) => {
      const href = crumb.href as string;
      const normalizedHref = href.startsWith('/') ? href : `/${href}`;

      return {
        '@type': 'ListItem' as const,
        position: index + 1,
        name: crumb.label,
        item: `${normalizedSiteUrl}${normalizedHref}`,
      };
    });

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement,
  };
}
