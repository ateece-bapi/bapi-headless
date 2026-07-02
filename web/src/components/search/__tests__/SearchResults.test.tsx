/**
 * SearchResults Component Tests
 *
 * Tests the full-page search results display:
 * - Renders result count for multiple results
 * - Renders singular count for exactly 1 result
 * - Renders empty state (heading + Browse/Contact buttons) when no results
 * - Customer group filtering: products not accessible to user's group are hidden
 * - Renders product name, SKU/partNumber badge, category chip, price
 * - partNumber takes priority over SKU in badge
 * - Products without images render without an <img>
 * - Each product is a link to /product/{slug}
 * - "Back to Products" link is rendered
 * - sanitizeWordPressContent called for shortDescription (XSS guard)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchResults from '../SearchResults';

// ─── Mock deps ────────────────────────────────────────────────────────────────
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { customerGroups: ['end-user'] }, isLoaded: true }),
}));

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} data-testid="result-image" />
  ),
}));

vi.mock('@/lib/icons', () => ({
  SearchIcon: () => <span data-testid="search-icon" />,
  ArrowLeftIcon: () => <span data-testid="arrow-left-icon" />,
}));

vi.mock('@/lib/sanitizeDescription', () => ({
  sanitizeWordPressContent: (html: string) => `[sanitized] ${html}`,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const baseTranslations = {
  backToProducts: 'Back to Products',
  title: 'Search Results',
  resultsCount: '{count} result for "{query}"',
  resultsCountPlural: '{count} results for "{query}"',
  noResultsTitle: 'No Products Found',
  noResultsDescription: 'We could not find anything for "{query}".',
  browseButton: 'Browse Products',
  contactButton: 'Contact Us',
};

function makeProduct(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id: `prod-${id}`,
    databaseId: id,
    name: `Sensor ${id}`,
    slug: `sensor-${id}`,
    sku: `SKU-${id}`,
    partNumber: null,
    price: `$${id * 10}.00`,
    shortDescription: null,
    image: { sourceUrl: `https://example.com/img-${id}.jpg`, altText: `Sensor ${id}` },
    productCategories: { nodes: [{ name: 'Temperature', slug: 'temperature' }] },
    // camelCase field names as used by filterProductsByCustomerGroup
    customerGroup1: 'END USER',
    customerGroup2: null,
    customerGroup3: null,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Result count ─────────────────────────────────────────────────────────────

  it('renders plural result count for multiple results', () => {
    render(
      <SearchResults
        products={[makeProduct(1), makeProduct(2)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText(/2 results for.*sensor/i)).toBeInTheDocument();
  });

  it('renders singular result count for exactly 1 result', () => {
    render(
      <SearchResults
        products={[makeProduct(1)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText(/1 result for.*sensor/i)).toBeInTheDocument();
  });

  // ─── Empty state ──────────────────────────────────────────────────────────────

  it('renders empty state heading when no results', () => {
    render(
      <SearchResults
        products={[]}
        query="xyz"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('No Products Found')).toBeInTheDocument();
  });

  it('includes the query in the empty state description', () => {
    render(
      <SearchResults
        products={[]}
        query="xyz123"
        locale="en"
        translations={baseTranslations}
      />,
    );
    // The description text specifically contains the query (distinct from the result count line)
    const allMatches = screen.getAllByText(/xyz123/);
    expect(allMatches.length).toBeGreaterThan(0);
    // The description paragraph should be one of them
    const descEl = allMatches.find((el) => el.textContent?.includes('could not find'));
    expect(descEl).toBeDefined();
  });

  it('renders Browse Products button in empty state', () => {
    render(
      <SearchResults products={[]} query="xyz" locale="en" translations={baseTranslations} />,
    );
    expect(screen.getByRole('link', { name: 'Browse Products' })).toBeInTheDocument();
  });

  it('renders Contact Us button in empty state', () => {
    render(
      <SearchResults products={[]} query="xyz" locale="en" translations={baseTranslations} />,
    );
    expect(screen.getByRole('link', { name: 'Contact Us' })).toBeInTheDocument();
  });

  // ─── Product rendering ────────────────────────────────────────────────────────

  it('renders product names', () => {
    render(
      <SearchResults
        products={[makeProduct(1), makeProduct(2)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('Sensor 1')).toBeInTheDocument();
    expect(screen.getByText('Sensor 2')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <SearchResults
        products={[makeProduct(3)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('$30.00')).toBeInTheDocument();
  });

  it('renders SKU badge when no partNumber', () => {
    render(
      <SearchResults
        products={[makeProduct(1, { sku: 'ABC-001', partNumber: null })] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('ABC-001')).toBeInTheDocument();
  });

  it('renders partNumber badge instead of SKU when present', () => {
    render(
      <SearchResults
        products={[makeProduct(1, { sku: 'ABC-001', partNumber: 'PN-XYZ' })] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('PN-XYZ')).toBeInTheDocument();
    expect(screen.queryByText('ABC-001')).not.toBeInTheDocument();
  });

  it('renders category chip', () => {
    render(
      <SearchResults
        products={[makeProduct(1)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });

  it('renders product image when available', () => {
    render(
      <SearchResults
        products={[makeProduct(1)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.getByTestId('result-image')).toBeInTheDocument();
  });

  it('does not render image when product has no image', () => {
    render(
      <SearchResults
        products={[makeProduct(1, { image: null })] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    expect(screen.queryByTestId('result-image')).not.toBeInTheDocument();
  });

  it('wraps each product in a link to /product/{slug}', () => {
    render(
      <SearchResults
        products={[makeProduct(7)] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    const link = screen.getByRole('link', { name: /sensor 7/i });
    expect(link).toHaveAttribute('href', '/product/sensor-7');
  });

  it('sanitizes shortDescription HTML before rendering', () => {
    render(
      <SearchResults
        products={[makeProduct(1, { shortDescription: '<b>bold</b> desc' })] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );
    // Our mock prepends [sanitized] to confirm it was called
    expect(screen.getByText(/\[sanitized\]/)).toBeInTheDocument();
  });

  // ─── Navigation link ──────────────────────────────────────────────────────────

  it('renders "Back to Products" link', () => {
    render(
      <SearchResults products={[]} query="x" locale="en" translations={baseTranslations} />,
    );
    expect(screen.getByRole('link', { name: /back to products/i })).toBeInTheDocument();
  });

  // ─── Customer group filtering ─────────────────────────────────────────────────

  it('hides products not accessible to the user customer group', () => {
    // filterProductsByCustomerGroup reads customerGroup1/2/3 (camelCase ACF fields)
    // A product with a restricted group (e.g. 'alc') won't show for an end-user
    const restrictedProduct = makeProduct(99, {
      // Use a title prefix that triggers group restriction
      name: '(ALC) Restricted Sensor',
      customerGroup1: null,
      customerGroup2: null,
      customerGroup3: null,
    });
    const publicProduct = makeProduct(1); // no group restriction

    render(
      <SearchResults
        products={[publicProduct, restrictedProduct] as any}
        query="sensor"
        locale="en"
        translations={baseTranslations}
      />,
    );

    expect(screen.getByText('Sensor 1')).toBeInTheDocument();
    // Restricted product should not appear for an end-user
    expect(screen.queryByText('(ALC) Restricted Sensor')).not.toBeInTheDocument();
  });
});
