/**
 * VariationSelector Component - Smoke Tests
 *
 * Focused smoke tests to verify component rendering and integration.
 * Core smart filtering logic is comprehensively tested in lib/__tests__/variations.test.ts (34 tests).
 *
 * Addresses Copilot PR review comments #2, #3, #7, #8:
 * - Smart filtering logic: Tested in variations.test.ts (getAvailableOptions - 10 tests)
 * - Stale selection clearing: Tested in variations.test.ts (areAllAttributesSelected - 6 tests)
 * - Binary toggle fallback: Verified via component rendering tests below
 */

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import VariationSelector from '../VariationSelector';
import type { ProductAttribute, ProductVariation } from '@/types/variations';

const { mockFavoriteButton } = vi.hoisted(() => ({
  mockFavoriteButton: vi.fn(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en' as const,
}));

vi.mock('@/store/regionStore', () => ({
  useRegion: () => ({
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
  }),
}));

vi.mock('@/lib/logger', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('@/components/FavoriteButton', () => ({
  default: (props: Record<string, unknown>) => {
    mockFavoriteButton(props);
    return <button type="button">Favorite</button>;
  },
}));

describe('VariationSelector - Component Smoke Tests', () => {
  it('renders without crashing with empty data', () => {
    expect(() => {
      render(
        <VariationSelector
          attributes={[]}
          variations={[]}
          onVariationChange={vi.fn()}
          basePrice="$100.00"
        />
      );
    }).not.toThrow();
  });

  it('renders dropdown for 5+ options', () => {
    const attributes: ProductAttribute[] = [
      {
        id: '1',
        name: 'size',
        label: 'Size',
        options: ['XS', 'S', 'M', 'L', 'XL'],
        variation: true,
      },
    ];

    const variations: ProductVariation[] = [
      {
        id: 'var-1',
        databaseId: 1,
        name: 'Size M',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-1',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'size', value: 'M', label: 'Size' }],
        },
      },
    ];

    render(
      <VariationSelector
        attributes={attributes}
        variations={variations}
        onVariationChange={vi.fn()}
        basePrice="$100.00"
      />
    );

    const dropdown = screen.getByLabelText(/size/i);
    expect(dropdown.tagName).toBe('SELECT');
  });

  it('renders binary toggle for 2 binary-keyword options (Copilot Review #3)', () => {
    const attributes: ProductAttribute[] = [
      {
        id: '1',
        name: 'display',
        label: 'Display',
        options: ['Display', 'No Display'],
        variation: true,
      },
    ];

    const variations: ProductVariation[] = [
      {
        id: 'var-1',
        databaseId: 1,
        name: 'With Display',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-1',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'display', value: 'Display', label: 'Display' }],
        },
      },
      {
        id: 'var-2',
        databaseId: 2,
        name: 'Without Display',
        price: '$90',
        regularPrice: '$110',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-2',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'display', value: 'No Display', label: 'Display' }],
        },
      },
    ];

    render(
      <VariationSelector
        attributes={attributes}
        variations={variations}
        onVariationChange={vi.fn()}
        basePrice="$100.00"
      />
    );

    expect(screen.getByRole('button', { name: 'Display' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No Display' })).toBeInTheDocument();
  });

  it('integrates with smart filtering utility (Copilot Review #2, #7-8)', () => {
    // Smart filtering should only surface attribute options that have at least one
    // matching variation. Here we define 10 possible options but only provide
    // variations for 6 of them, proving the component filters unavailable options.

    const attributes: ProductAttribute[] = [
      {
        id: '1',
        name: 'model',
        label: 'Model',
        options: [
          'Model A',
          'Model B',
          'Model C',
          'Model D',
          'Model E',
          'Model F',
          'Model G',
          'Model H',
          'Model I',
          'Model J',
        ],
        variation: true,
      },
    ];

    const variations: ProductVariation[] = [
      {
        id: 'var-1',
        databaseId: 1,
        name: 'Model A',
        price: '$100',
        regularPrice: '$120',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-1',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model A', label: 'Model' }],
        },
      },
      {
        id: 'var-2',
        databaseId: 2,
        name: 'Model B',
        price: '$105',
        regularPrice: '$125',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-2',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model B', label: 'Model' }],
        },
      },
      {
        id: 'var-3',
        databaseId: 3,
        name: 'Model C',
        price: '$110',
        regularPrice: '$130',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-3',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model C', label: 'Model' }],
        },
      },
      {
        id: 'var-4',
        databaseId: 4,
        name: 'Model D',
        price: '$115',
        regularPrice: '$135',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-4',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model D', label: 'Model' }],
        },
      },
      {
        id: 'var-5',
        databaseId: 5,
        name: 'Model E',
        price: '$120',
        regularPrice: '$140',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-5',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model E', label: 'Model' }],
        },
      },
      {
        id: 'var-6',
        databaseId: 6,
        name: 'Model F',
        price: '$125',
        regularPrice: '$145',
        stockStatus: 'IN_STOCK',
        sku: 'SKU-6',
        partNumber: null,
        attributes: {
          nodes: [{ name: 'model', value: 'Model F', label: 'Model' }],
        },
      },
    ];

    render(
      <VariationSelector
        attributes={attributes}
        variations={variations}
        onVariationChange={vi.fn()}
        basePrice="$100.00"
      />
    );

    // With 6 variations, should render as dropdown
    const dropdown = screen.getByLabelText(/model/i) as HTMLSelectElement;
    const options = Array.from(dropdown.options)
      .map((o) => o.value)
      .filter((v) => v);

    // Smart filtering: should show only 6 available options (A-F), not all 10 defined (A-J)
    expect(options).toHaveLength(6);
    expect(options).toContain('Model A');
    expect(options).toContain('Model F');
    // Verify unavailable options are filtered out
    expect(options).not.toContain('Model G');
    expect(options).not.toContain('Model J');
  });

  it('passes matched variation ID and configured URL to FavoriteButton', () => {
    mockFavoriteButton.mockClear();

    const attributes: ProductAttribute[] = [
      {
        id: '1',
        name: 'temperature-sensor',
        label: 'Temperature Sensor',
        options: ['1K RTD', '10K-2 Thermistor'],
        variation: true,
      },
      {
        id: '2',
        name: 'probe',
        label: 'Probe',
        options: ['18inch (450mm)', '8inch (200mm)'],
        variation: true,
      },
    ];

    const variations: ProductVariation[] = [
      {
        id: 'var-501',
        databaseId: 501,
        name: 'Configured Variation',
        price: '$44.00',
        regularPrice: '$44.00',
        stockStatus: 'IN_STOCK',
        sku: 'BA/1K-D-18-BB',
        partNumber: 'BA/1K-D-18-BB',
        image: { sourceUrl: 'https://example.com/configured.webp', altText: 'Configured' },
        attributes: {
          nodes: [
            { name: 'temperature-sensor', value: '1K RTD', label: 'Temperature Sensor' },
            { name: 'probe', value: '18inch (450mm)', label: 'Probe' },
          ],
        },
      },
    ];

    render(
      <VariationSelector
        attributes={attributes}
        variations={variations}
        onVariationChange={vi.fn()}
        product={{
          id: 'product-1',
          databaseId: 100,
          name: 'Duct Temperature Transmitter',
          slug: 'duct-temperature-transmitter-2',
          image: { sourceUrl: 'https://example.com/product.webp', altText: 'Product' },
        }}
      />
    );

    fireEvent.click(screen.getByText('1K RTD'));
    fireEvent.click(screen.getByText('18inch (450mm)'));

    expect(mockFavoriteButton).toHaveBeenLastCalledWith(
      expect.objectContaining({
        productId: '501',
        productUrl:
          '/product/duct-temperature-transmitter-2?temperature-sensor=1K+RTD&probe=18inch+%28450mm%29',
      })
    );
  });
});
