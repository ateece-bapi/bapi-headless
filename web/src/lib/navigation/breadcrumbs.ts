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
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  // Build hierarchy from root to current category
  if (parent) {
    // Has parent - build from root
    if (parent.parent) {
      // Grandparent exists (root category)
      breadcrumbs.push({
        label: parent.parent.name,
        href: `/${locale}/products/${parent.parent.slug}`,
      });
      breadcrumbs.push({
        label: parent.name,
        href: `/${locale}/products/${parent.parent.slug}/${parent.slug}`,
      });
    } else {
      // Parent is root category
      breadcrumbs.push({
        label: parent.name,
        href: `/${locale}/products/${parent.slug}`,
      });
    }
    // Current category
    const parentPath = parent.parent
      ? `${parent.parent.slug}/${parent.slug}`
      : parent.slug;
    breadcrumbs.push({
      label: categoryName,
      href: `/${locale}/products/${parentPath}/${categorySlug}`,
    });
  } else {
    // No parent - this is a root category
    breadcrumbs.push({
      label: categoryName,
      href: `/${locale}/products/${categorySlug}`,
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
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
    });
  }

  // Build hierarchy from root
  if (grandparent) {
    // Grandparent is the root category
    breadcrumbs.push({
      label: grandparent.name,
      href: `/${locale}/products/${grandparent.slug}`,
    });
    breadcrumbs.push({
      label: parentCategoryName,
      href: `/${locale}/products/${grandparent.slug}/${parentCategorySlug}`,
    });
    breadcrumbs.push({
      label: subcategoryName,
      href: `/${locale}/products/${grandparent.slug}/${parentCategorySlug}/${subcategorySlug}`,
    });
  } else {
    // Parent is the root category
    breadcrumbs.push({
      label: parentCategoryName,
      href: `/${locale}/products/${parentCategorySlug}`,
    });
    breadcrumbs.push({
      label: subcategoryName,
      href: `/${locale}/products/${parentCategorySlug}/${subcategorySlug}`,
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
  const { locale, includeHome = true, labels } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: getLabel('home', labels),
      href: `/${locale}`,
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
    hierarchy.forEach((cat, index) => {
      if (index === 0) {
        // Root category - link directly to it
        breadcrumbs.push({
          label: cat.name,
          href: `/${locale}/products/${cat.slug}`,
        });
      } else {
        // Child categories - build nested path
        const parentPath = hierarchy
          .slice(0, index)
          .map(c => c.slug)
          .join('/');
        breadcrumbs.push({
          label: cat.name,
          href: `/${locale}/products/${parentPath}/${cat.slug}`,
        });
      }
    });
  } else {
    // No categories - fallback to generic "Products" link
    breadcrumbs.push({
      label: getLabel('products', labels),
      href: `/${locale}/products`,
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

  // For search, show generic "Products" since no specific category
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
