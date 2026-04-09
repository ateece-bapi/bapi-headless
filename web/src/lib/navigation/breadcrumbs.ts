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
  locale?: string;
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
 * @param categoryName - The display name of the category
 * @param categorySlug - The slug of the category
 * @param options - Breadcrumb options including locale and labels
 * @param parent - Optional parent category information
 * @param parent.name - Parent category name
 * @param parent.slug - Parent category slug
 * @param parent.parent - Optional grandparent category
 * @param parent.parent.name - Grandparent category name
 * @param parent.parent.slug - Grandparent category slug
 */
export function getCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  options: BreadcrumbOptions,
  parent?: { name: string; slug: string; parent?: { name: string; slug: string } }
): BreadcrumbItem[] {
  const { includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: '/',
    });
  }

  // Build hierarchy from root to current category
  if (parent) {
    // Has parent - build from root
    if (parent.parent) {
      // Grandparent exists (root category)
      breadcrumbs.push({
        label: parent.parent.name,
        href: `/products/${parent.parent.slug}`,
      });
      // Parent - router supports /products/[category]/[subcategory]
      breadcrumbs.push({
        label: parent.name,
        href: `/products/${parent.parent.slug}/${parent.slug}`,
      });
    } else {
      // Parent is root category
      breadcrumbs.push({
        label: parent.name,
        href: `/products/${parent.slug}`,
      });
    }
    // Current category - use canonical /products/[category] route
    // Router only supports 2 segments max, so link to category's own page
    breadcrumbs.push({
      label: categoryName,
      href: `/products/${categorySlug}`,
    });
  } else {
    // No parent - this is a root category
    breadcrumbs.push({
      label: categoryName,
      href: `/products/${categorySlug}`,
    });
  }

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for product subcategory pages
 * @param parentCategoryName - The display name of the parent category
 * @param parentCategorySlug - The slug of the parent category
 * @param subcategoryName - The display name of the subcategory
 * @param subcategorySlug - The slug of the subcategory
 * @param options - Breadcrumb options including locale and labels
 * @param grandparent - Optional grandparent category information
 * @param grandparent.name - Grandparent category name
 * @param grandparent.slug - Grandparent category slug
 */
export function getSubcategoryBreadcrumbs(
  parentCategoryName: string,
  parentCategorySlug: string,
  subcategoryName: string,
  subcategorySlug: string,
  options: BreadcrumbOptions,
  grandparent?: { name: string; slug: string }
): BreadcrumbItem[] {
  const { includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: '/',
    });
  }

  // Build hierarchy from root
  if (grandparent) {
    // 3-level hierarchy: grandparent > parent > subcategory
    // Router only supports 2 segments, so link to valid routes
    breadcrumbs.push({
      label: grandparent.name,
      href: `/products/${grandparent.slug}`,
    });
    breadcrumbs.push({
      label: parentCategoryName,
      href: `/products/${grandparent.slug}/${parentCategorySlug}`,
    });
    // Subcategory - use canonical /products/[parent]/[subcategory] route
    breadcrumbs.push({
      label: subcategoryName,
      href: `/products/${parentCategorySlug}/${subcategorySlug}`,
    });
  } else {
    // 2-level hierarchy: parent > subcategory
    breadcrumbs.push({
      label: parentCategoryName,
      href: `/products/${parentCategorySlug}`,
    });
    breadcrumbs.push({
      label: subcategoryName,
      href: `/products/${parentCategorySlug}/${subcategorySlug}`,
    });
  }

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
      parent?: {
        name: string;
        slug: string;
      };
    };
  }>,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: '/',
    });
  }

  // Use the first category (primary category)
  if (categories.length > 0) {
    const primaryCategory = categories[0];

    // Build full hierarchy by walking up the tree
    const hierarchy: Array<{ name: string; slug: string }> = [];

    // Start with grandparent (if exists)
    if (primaryCategory.parent?.parent) {
      hierarchy.push({
        name: primaryCategory.parent.parent.name,
        slug: primaryCategory.parent.parent.slug,
      });
    }

    // Add parent (if exists)
    if (primaryCategory.parent) {
      hierarchy.push({
        name: primaryCategory.parent.name,
        slug: primaryCategory.parent.slug,
      });
    }

    // Add current category
    hierarchy.push({
      name: primaryCategory.name,
      slug: primaryCategory.slug,
    });

    // Build breadcrumbs from root to leaf
    // Router supports max 2 segments: /products/[category]/[subcategory]
    hierarchy.forEach((cat, index) => {
      if (index === 0) {
        // Root category - matches /products/[category]
        breadcrumbs.push({
          label: cat.name,
          href: `/products/${cat.slug}`,
        });
      } else if (index === 1) {
        // Second level - matches /products/[category]/[subcategory]
        breadcrumbs.push({
          label: cat.name,
          href: `/products/${hierarchy[0].slug}/${cat.slug}`,
        });
      } else {
        // Deeper levels have no matching route, show without link
        breadcrumbs.push({
          label: cat.name,
        });
      }
    });
  } else {
    // No categories - fallback to generic "Products" link
    breadcrumbs.push({
      label: getLabel('products', labels),
      href: '/products',
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
  const { includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: '/',
    });
  }

  // For search, show generic "Products" since no specific category
  breadcrumbs.push({
    label: getLabel('products', labels),
    href: '/products',
  });

  breadcrumbs.push({
    label: `${getLabel('search', labels)}: "${searchQuery}"`,
  });

  return breadcrumbs;
}

/**
 * Convert breadcrumb items to Schema.org BreadcrumbList format.
 * Breadcrumb hrefs are locale-agnostic (e.g. /products/actuators); the locale
 * is injected here to build correct absolute URLs for structured data.
 *
 * @param breadcrumbs - Array of breadcrumb items with label and optional href
 * @param siteUrl - Base site URL (e.g., "https://bapi.com")
 * @param locale - Active locale (e.g., "en", "de") used to prefix hrefs in schema
 * @returns Schema.org BreadcrumbList object for structured data
 */
export function breadcrumbsToSchemaOrg(
  breadcrumbs: BreadcrumbItem[],
  siteUrl: string,
  locale: string
) {
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
        item: `${normalizedSiteUrl}/${locale}${normalizedHref}`,
      };
    });

  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement,
  };
}
