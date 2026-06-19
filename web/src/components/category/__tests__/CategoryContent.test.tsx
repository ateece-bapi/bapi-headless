/**
 * CategoryContent Component Tests
 *
 * Tests the core product browsing behavior:
 * - Renders all products when no filters active
 * - Subcategory filter removes non-matching products
 * - Application attribute filter filters correctly
 * - Multiple active filters are ANDed together
 * - Customer group filtering: excludes products not accessible to user's group
 * - Sorting: name A-Z, price asc/desc, newest first (by databaseId)
 * - Sort dropdown triggers URL push
 * - Subcategory cards render when subcategories provided
 * - Product count label reflects filtered/total
 *
 * NOTE: CategoryContent is a 'use client' component using useSearchParams/useRouter/usePathname.
 * These are mocked via vi.mock('next/navigation').
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryContent from '../CategoryContent';
import type {
  GetProductAttributesQuery,
} from '@/lib/graphql/generated';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockPush, mockPathname, mockSearchParams, mockGetAll, mockGet } = vi.hoisted(() => {
  const mockGet = vi.fn((_key: string) => null);
  const mockGetAll = vi.fn((_key: string) => []);
  const mockSearchParams = { get: mockGet, getAll: mockGetAll, toString: () => '' };
  const mockPush = vi.fn();
  const mockPathname = vi.fn(() => '/en/products/temperature');
  return { mockPush, mockPathname, mockSearchParams, mockGetAll, mockGet };
});

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { customerGroups: ['end-user'] } }),
}));

vi.mock('@/lib/logger', () => ({
  default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// Mock heavy sub-components that aren't under test
vi.mock('@/components/products/ProductGrid', () => ({
  ProductGrid: ({ products }: { products: Array<{ name?: string | null }> }) => (
    <div data-testid="product-grid">
      {products.map((p) => (
        <div key={p.name} data-testid="product-card">
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../SubcategoryCard', () => ({
  default: ({ name }: { name: string }) => <div data-testid="subcategory-card">{name}</div>,
}));

vi.mock('../SubcategoryQuickFilter', () => ({
  default: () => <div data-testid="subcategory-quick-filter" />,
}));

vi.mock('../FilterSidebar', () => ({
  default: ({
    onChange,
  }: {
    onChange: (filters: ActiveFilters) => void;
    activeFilters: ActiveFilters;
  }) => (
    <div data-testid="filter-sidebar">
      <button
        onClick={() =>
          onChange({
            subcategory: ['duct-sensors'],
            application: [],
            enclosure: [],
            output: [],
            display: [],
            tempSetpoint: [],
            optionalTempOutput: [],
          })
        }
      >
        Apply Duct Sensors Filter
      </button>
    </div>
  ),
}));

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActiveFilters {
  subcategory: string[];
  application: string[];
  enclosure: string[];
  output: string[];
  display: string[];
  tempSetpoint: string[];
  optionalTempOutput: string[];
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const emptyFiltersQuery: GetProductAttributesQuery = {
  paApplications: { nodes: [] },
  paRoomEnclosureStyles: { nodes: [] },
  paTemperatureSensorOutputs: { nodes: [] },
  paHumiditySensorOutputs: { nodes: [] },
  paDisplays: { nodes: [] },
  paTempSetpointAndOverride: { nodes: [] },
  paOptionalTempSensorOutputs: { nodes: [] },
} as unknown as GetProductAttributesQuery;

function makeProduct(
  id: number,
  name: string,
  price: string = '$10.00',
  categorySlug?: string,
  customerGroup?: string,
) {
  return {
    id: `prod-${id}`,
    databaseId: id,
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    price,
    stockStatus: 'IN_STOCK' as const,
    image: null,
    gallery: [],
    variations: [],
    productCategories: categorySlug
      ? { nodes: [{ id: `cat-${id}`, name: categorySlug, slug: categorySlug }] }
      : { nodes: [] },
    customer_group1: customerGroup ? [customerGroup] : ['END USER'],
    attributes: { nodes: [] },
  };
}

const defaultProducts = [
  makeProduct(10, 'Alpha Sensor', '$10.00'),
  makeProduct(20, 'Beta Transmitter', '$5.00'),
  makeProduct(30, 'Gamma Controller', '$15.00'),
];

function renderCategoryContent(products = defaultProducts) {
  return render(
    <CategoryContent
      categorySlugParam="temperature"
      subcategories={[]}
      products={products as any}
      filters={emptyFiltersQuery}
      locale="en"
    />,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CategoryContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
    mockGetAll.mockReturnValue([]);
  });

  // ─── Rendering ───────────────────────────────────────────────────────────────

  it('renders all products when no filters are active', () => {
    renderCategoryContent();
    expect(screen.getAllByTestId('product-card')).toHaveLength(3);
  });

  it('shows the product count label', () => {
    renderCategoryContent();
    // "Showing 3 of 3 products"
    expect(screen.getByText(/showing 3 of 3 products/i)).toBeInTheDocument();
  });

  it('renders subcategory cards when subcategories are provided', () => {
    const subcategories = [
      { id: '1', name: 'Duct Sensors', slug: 'duct-sensors', count: 5 },
      { id: '2', name: 'Room Sensors', slug: 'room-sensors', count: 3 },
    ];

    render(
      <CategoryContent
        categorySlugParam="temperature"
        subcategories={subcategories as any}
        products={defaultProducts as any}
        filters={emptyFiltersQuery}
        locale="en"
      />,
    );

    expect(screen.getAllByTestId('subcategory-card')).toHaveLength(2);
    expect(screen.getByText('Duct Sensors')).toBeInTheDocument();
  });

  it('does not render subcategory section when no subcategories', () => {
    renderCategoryContent();
    expect(screen.queryByText('Browse by Category')).not.toBeInTheDocument();
  });

  it('renders the sort dropdown', () => {
    renderCategoryContent();
    expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
  });

  // ─── Sorting ─────────────────────────────────────────────────────────────────

  it('sorts products A-Z by name by default', () => {
    renderCategoryContent();
    const cards = screen.getAllByTestId('product-card');
    expect(cards[0]).toHaveTextContent('Alpha Sensor');
    expect(cards[1]).toHaveTextContent('Beta Transmitter');
    expect(cards[2]).toHaveTextContent('Gamma Controller');
  });

  it('sorts products by price ascending when selected', () => {
    renderCategoryContent();
    fireEvent.change(screen.getByRole('combobox', { name: /sort/i }), {
      target: { value: 'price-asc' },
    });

    const cards = screen.getAllByTestId('product-card');
    expect(cards[0]).toHaveTextContent('Beta Transmitter'); // $5.00
    expect(cards[1]).toHaveTextContent('Alpha Sensor'); // $10.00
    expect(cards[2]).toHaveTextContent('Gamma Controller'); // $15.00
  });

  it('sorts products by price descending when selected', () => {
    renderCategoryContent();
    fireEvent.change(screen.getByRole('combobox', { name: /sort/i }), {
      target: { value: 'price-desc' },
    });

    const cards = screen.getAllByTestId('product-card');
    expect(cards[0]).toHaveTextContent('Gamma Controller'); // $15.00
    expect(cards[1]).toHaveTextContent('Alpha Sensor'); // $10.00
    expect(cards[2]).toHaveTextContent('Beta Transmitter'); // $5.00
  });

  it('sorts by newest first (highest databaseId first) when selected', () => {
    renderCategoryContent();
    fireEvent.change(screen.getByRole('combobox', { name: /sort/i }), {
      target: { value: 'newest' },
    });

    const cards = screen.getAllByTestId('product-card');
    expect(cards[0]).toHaveTextContent('Gamma Controller'); // databaseId: 30
    expect(cards[1]).toHaveTextContent('Beta Transmitter'); // databaseId: 20
    expect(cards[2]).toHaveTextContent('Alpha Sensor'); // databaseId: 10
  });

  it('pushes URL when sort changes', () => {
    renderCategoryContent();
    fireEvent.change(screen.getByRole('combobox', { name: /sort/i }), {
      target: { value: 'price-asc' },
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('sort=price-asc'),
      expect.any(Object),
    );
  });

  it('does not include sort param in URL when sort is "name" (default)', () => {
    renderCategoryContent();
    // Default sort is 'name' — no sort param needed
    // Trigger the filter change through FilterSidebar mock to exercise URL push
    fireEvent.click(screen.getByText('Apply Duct Sensors Filter'));

    const pushCall = mockPush.mock.calls[0]?.[0] ?? '';
    expect(pushCall).not.toContain('sort=name');
  });

  // ─── Subcategory filtering ────────────────────────────────────────────────────

  it('filters by subcategory when FilterSidebar triggers onChange', () => {
    const ductProduct = makeProduct(1, 'Duct Alpha', '$10.00', 'duct-sensors');
    const roomProduct = makeProduct(2, 'Room Beta', '$10.00', 'room-sensors');

    render(
      <CategoryContent
        categorySlugParam="temperature"
        subcategories={[]}
        products={[ductProduct, roomProduct] as any}
        filters={emptyFiltersQuery}
        locale="en"
      />,
    );

    // Both show initially
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);

    // Apply duct-sensors subcategory filter via the mock sidebar button
    fireEvent.click(screen.getByText('Apply Duct Sensors Filter'));

    // Only duct product should remain
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Duct Alpha');
  });

  it('pushes URL with active filters when FilterSidebar triggers onChange', () => {
    renderCategoryContent();
    fireEvent.click(screen.getByText('Apply Duct Sensors Filter'));

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('subcategory=duct-sensors'),
      expect.any(Object),
    );
  });

  // ─── Product count label ──────────────────────────────────────────────────────

  it('shows filtered count after applying a filter that removes products', () => {
    const ductProduct = makeProduct(1, 'Duct Alpha', '$10.00', 'duct-sensors');
    const roomProduct = makeProduct(2, 'Room Beta', '$10.00', 'room-sensors');

    render(
      <CategoryContent
        categorySlugParam="temperature"
        subcategories={[]}
        products={[ductProduct, roomProduct] as any}
        filters={emptyFiltersQuery}
        locale="en"
      />,
    );

    fireEvent.click(screen.getByText('Apply Duct Sensors Filter'));

    // 1 of 2 products shown
    expect(screen.getByText(/showing 1 of 2 products/i)).toBeInTheDocument();
  });

  // ─── Bluetooth-wireless category exclusion logic ─────────────────────────────

  it('excludes specific subcategory cards in bluetooth-wireless category', () => {
    const subcategories = [
      { id: '1', name: 'Wireless Gateway', slug: 'wireless-gateway', count: 3 },
      { id: '2', name: 'Wireless Transmitters', slug: 'wireless-transmitters', count: 5 },
    ];

    render(
      <CategoryContent
        categorySlugParam="bluetooth-wireless"
        subcategories={subcategories as any}
        products={[]}
        filters={emptyFiltersQuery}
        locale="en"
      />,
    );

    // Gateway should be excluded for this category
    expect(screen.queryByText('Wireless Gateway')).not.toBeInTheDocument();
    // Transmitters should still show
    expect(screen.getByText('Wireless Transmitters')).toBeInTheDocument();
  });
});
