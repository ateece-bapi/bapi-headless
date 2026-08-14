import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetProductsWithFiltersQuery } from '@/lib/graphql/generated';
import FilteredProductGrid from '../FilteredProductGrid';

const { mockSearchParams } = vi.hoisted(() => ({
  mockSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams(),
}));

vi.mock('@sentry/nextjs', () => ({
  addBreadcrumb: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { customerGroups: ['END USER'] } }),
}));

vi.mock('../ProductGrid', () => ({
  ProductGrid: ({ products }: { products: Array<{ name?: string | null }> }) => (
    <div>
      {products.map((product) => (
        <span key={product.name}>{product.name}</span>
      ))}
    </div>
  ),
}));

vi.mock('../Pagination', () => ({
  Pagination: () => null,
}));

type Product = NonNullable<GetProductsWithFiltersQuery['products']>['nodes'][number];

function makeProduct(
  id: string,
  name: string,
  attributes: Array<{ name: string; options: string[] }>
): Product {
  return {
    __typename: 'SimpleProduct',
    id,
    databaseId: Number(id),
    name,
    slug: name.toLowerCase().replaceAll(' ', '-'),
    attributes: {
      nodes: attributes.map((attribute, index) => ({
        id: `attribute-${id}-${index}`,
        ...attribute,
      })),
    },
  } as Product;
}

describe('FilteredProductGrid', () => {
  beforeEach(() => {
    mockSearchParams.mockReturnValue(new URLSearchParams());
  });

  it('filters products using the optimized attributes field', () => {
    mockSearchParams.mockReturnValue(new URLSearchParams('application=hvac'));

    render(
      <FilteredProductGrid
        products={[
          makeProduct('1', 'HVAC Sensor', [
            { name: 'pa_application', options: ['HVAC'] },
          ]),
          makeProduct('2', 'Industrial Sensor', [
            { name: 'pa_application', options: ['Industrial'] },
          ]),
        ]}
        locale="en"
      />
    );

    expect(screen.getByText('HVAC Sensor')).toBeInTheDocument();
    expect(screen.queryByText('Industrial Sensor')).not.toBeInTheDocument();
  });

  it('supports hyphenated attribute names across product lines', () => {
    mockSearchParams.mockReturnValue(
      new URLSearchParams('pressureApplication=duct&pressureSensorStyle=differential')
    );

    render(
      <FilteredProductGrid
        products={[
          makeProduct('1', 'Differential Pressure Sensor', [
            { name: 'pa_pressure-application', options: ['Duct'] },
            { name: 'pa_pressure-sensor-style', options: ['Differential'] },
          ]),
          makeProduct('2', 'Room Pressure Sensor', [
            { name: 'pa_pressure-application', options: ['Room'] },
            { name: 'pa_pressure-sensor-style', options: ['Differential'] },
          ]),
        ]}
        locale="en"
      />
    );

    expect(screen.getByText('Differential Pressure Sensor')).toBeInTheDocument();
    expect(screen.queryByText('Room Pressure Sensor')).not.toBeInTheDocument();
  });

  it('uses OR within one filter group and AND across filter groups', () => {
    mockSearchParams.mockReturnValue(
      new URLSearchParams('application=hvac,industrial&display=display')
    );

    render(
      <FilteredProductGrid
        products={[
          makeProduct('1', 'HVAC Display Sensor', [
            { name: 'pa_application', options: ['HVAC'] },
            { name: 'pa_display', options: ['Display'] },
          ]),
          makeProduct('2', 'Industrial Display Sensor', [
            { name: 'pa_application', options: ['Industrial'] },
            { name: 'pa_display', options: ['Display'] },
          ]),
          makeProduct('3', 'HVAC No Display Sensor', [
            { name: 'pa_application', options: ['HVAC'] },
            { name: 'pa_display', options: ['No Display'] },
          ]),
        ]}
        locale="en"
      />
    );

    expect(screen.getByText('HVAC Display Sensor')).toBeInTheDocument();
    expect(screen.getByText('Industrial Display Sensor')).toBeInTheDocument();
    expect(screen.queryByText('HVAC No Display Sensor')).not.toBeInTheDocument();
  });
});