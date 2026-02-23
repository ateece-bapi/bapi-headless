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

export interface BreadcrumbOptions {
  locale: string;
  includeHome?: boolean;
}

/**
 * Generate breadcrumbs for product category pages
 */
export function getCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  options: BreadcrumbOptions
): BreadcrumbItem[] {
  const { locale, includeHome = true } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: 'Home',
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: 'Products',
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
  const { locale, includeHome = true } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: 'Home',
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: 'Products',
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
  const { locale, includeHome = true } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: 'Home',
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: 'Products',
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
  const { locale, includeHome = true } = options;
  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeHome) {
    breadcrumbs.push({
      label: 'Home',
      href: `/${locale}`,
    });
  }

  breadcrumbs.push({
    label: 'Products',
    href: `/${locale}/products`,
  });

  breadcrumbs.push({
    label: `Search: "${searchQuery}"`,
  });

  return breadcrumbs;
}

/**
 * Convert breadcrumb items to Schema.org BreadcrumbList format
 */
export function breadcrumbsToSchemaOrg(
  breadcrumbs: BreadcrumbItem[],
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement: breadcrumbs
      .filter((crumb) => crumb.href) // Only include items with hrefs in schema
      .map((crumb, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        name: crumb.label,
        item: `${siteUrl}${crumb.href}`,
      })),
  };
}
