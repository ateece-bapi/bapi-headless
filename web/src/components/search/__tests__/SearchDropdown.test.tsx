/**
 * SearchDropdown Component Tests
 *
 * Tests the search result dropdown UI behavior:
 * - Returns null when isOpen is false
 * - Renders loading spinner when isLoading is true
 * - Renders empty state when query >= 2 chars but no results
 * - Does NOT render empty state when query is too short
 * - Renders product results with name, SKU/partNumber, category, price
 * - Renders "View all results" footer button
 * - Clicking a product result calls onSelect with correct slug
 * - Clicking "View all results" calls onViewAll
 * - Arrow key navigation: ArrowDown increments selection, ArrowUp decrements
 * - Enter key on product calls onSelect
 * - Enter key on "View all" row calls onViewAll
 * - Escape key calls onClose
 * - Click outside the dropdown calls onClose
 * - partNumber takes priority over SKU for display
 * - Products without images render without an image element
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchDropdown } from '../SearchDropdown';

// ─── Mock heavy deps ──────────────────────────────────────────────────────────
vi.mock('@/lib/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} data-testid="product-image" />
  ),
}));

vi.mock('@/lib/icons', () => ({
  SearchIcon: () => <span data-testid="search-icon" />,
  XIcon: () => <span data-testid="x-icon" />,
  ArrowRightIcon: () => <span data-testid="arrow-right-icon" />,
  Loader2Icon: () => <span data-testid="loader-icon" />,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
function makeProduct(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id: `prod-${id}`,
    databaseId: id,
    name: `Product ${id}`,
    slug: `product-${id}`,
    sku: `SKU-${id}`,
    partNumber: null,
    price: `$${id * 10}.00`,
    shortDescription: null,
    image: { sourceUrl: `https://example.com/img-${id}.jpg`, altText: `Product ${id}` },
    productCategories: { nodes: [{ name: 'Temperature', slug: 'temperature' }] },
    ...overrides,
  };
}

const defaultProps = {
  id: 'search-dropdown',
  results: [],
  isLoading: false,
  isOpen: true,
  query: 'temp',
  onSelect: vi.fn(),
  onViewAll: vi.fn(),
  onClose: vi.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SearchDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Visibility guard ────────────────────────────────────────────────────────

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<SearchDropdown {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders when isOpen is true', () => {
    render(<SearchDropdown {...defaultProps} />);
    // The dropdown container should be in the DOM
    expect(document.getElementById('search-dropdown')).toBeInTheDocument();
  });

  // ─── Loading state ───────────────────────────────────────────────────────────

  it('shows loading spinner when isLoading is true', () => {
    render(<SearchDropdown {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('does not show results when loading', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        isLoading={true}
        results={[makeProduct(1)]}
      />,
    );
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  // ─── Empty state ─────────────────────────────────────────────────────────────

  it('shows empty state when query >= 2 chars and no results', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[]}
        isLoading={false}
        query="temp"
      />,
    );
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    expect(screen.getByText(/temp/)).toBeInTheDocument();
  });

  it('does not show empty state when query is too short', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[]}
        isLoading={false}
        query="t"
      />,
    );
    expect(screen.queryByText(/no products found/i)).not.toBeInTheDocument();
  });

  // ─── Results rendering ────────────────────────────────────────────────────────

  it('renders product names', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1), makeProduct(2)]}
      />,
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(5)]} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders SKU when no partNumber', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1, { sku: 'SKU-ABC', partNumber: null })]}
      />,
    );
    expect(screen.getByText('SKU-ABC')).toBeInTheDocument();
  });

  it('renders partNumber instead of SKU when partNumber is present', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1, { sku: 'SKU-ABC', partNumber: 'PN-XYZ' })]}
      />,
    );
    expect(screen.getByText('PN-XYZ')).toBeInTheDocument();
    expect(screen.queryByText('SKU-ABC')).not.toBeInTheDocument();
  });

  it('renders category name', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1)]} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });

  it('renders product image when available', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1)]} />);
    expect(screen.getByTestId('product-image')).toBeInTheDocument();
  });

  it('does not render image element when product has no image', () => {
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1, { image: null })]}
      />,
    );
    expect(screen.queryByTestId('product-image')).not.toBeInTheDocument();
  });

  it('renders "View all results" footer with query text', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1)]} query="sensor" />);
    expect(screen.getByText(/view all results for.*sensor/i)).toBeInTheDocument();
  });

  // ─── Click interactions ───────────────────────────────────────────────────────

  it('calls onSelect with product slug when a product is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(42)]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Product 42'));
    expect(onSelect).toHaveBeenCalledWith('product-42');
  });

  it('calls onViewAll when "View all results" is clicked', () => {
    const onViewAll = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1)]}
        onViewAll={onViewAll}
      />,
    );
    fireEvent.click(screen.getByText(/view all results/i));
    expect(onViewAll).toHaveBeenCalledOnce();
  });

  // ─── Keyboard navigation ─────────────────────────────────────────────────────

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1)]} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onSelect with first result slug when Enter is pressed on first item', () => {
    const onSelect = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1), makeProduct(2)]}
        onSelect={onSelect}
      />,
    );
    // selectedIndex defaults to 0 — Enter selects results[0]
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('product-1');
  });

  it('calls onViewAll when Enter is pressed and last item (View all) is selected', () => {
    const onViewAll = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1)]}
        onViewAll={onViewAll}
      />,
    );
    // ArrowDown once → moves to index 1 which is "View all results" (results.length === 1)
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onViewAll).toHaveBeenCalledOnce();
  });

  it('moves selection down with ArrowDown', () => {
    const onSelect = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1), makeProduct(2)]}
        onSelect={onSelect}
      />,
    );
    // Move down to index 1, then Enter should select results[1]
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('product-2');
  });

  it('does not move selection below last item', () => {
    const onViewAll = vi.fn();
    render(
      <SearchDropdown
        {...defaultProps}
        results={[makeProduct(1)]}
        onViewAll={onViewAll}
      />,
    );
    // Press ArrowDown many times — should clamp to results.length (View all)
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onViewAll).toHaveBeenCalledOnce();
  });

  // ─── Click outside ────────────────────────────────────────────────────────────

  it('calls onClose when clicking outside the dropdown', () => {
    const onClose = vi.fn();
    render(
      <div>
        <SearchDropdown {...defaultProps} results={[makeProduct(1)]} onClose={onClose} />
        <button data-testid="outside">Outside</button>
      </div>,
    );
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────────

  it('gives the container id matching the passed id prop', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1)]} id="my-dropdown" />);
    expect(document.getElementById('my-dropdown')).toBeInTheDocument();
  });

  it('marks selected item as aria-selected', () => {
    render(<SearchDropdown {...defaultProps} results={[makeProduct(1), makeProduct(2)]} />);
    const options = screen.getAllByRole('option');
    // Index 0 is selected by default
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });
});
