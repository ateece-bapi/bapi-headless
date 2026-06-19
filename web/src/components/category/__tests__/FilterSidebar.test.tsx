/**
 * FilterSidebar Component Tests
 *
 * Tests filter state management, rendering, and user interactions:
 * - Renders subcategory and attribute filter groups
 * - Checking a filter calls onChange with updated state
 * - Unchecking a filter removes it
 * - "Clear All Filters" button appears only with active filters and clears them
 * - Filters are not shown when no options exist for that category
 * - Mobile filter button opens the overlay
 * - Active filter badge count reflects total active selections
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterSidebar from '../FilterSidebar';
import type { GetProductAttributesQuery } from '@/lib/graphql/generated';

// ─── Mock icons ───────────────────────────────────────────────────────────────
vi.mock('@/lib/icons', () => ({
  XIcon: () => <span data-testid="x-icon" />,
  SlidersHorizontalIcon: () => <span data-testid="sliders-icon" />,
  ChevronDownIcon: () => <span data-testid="chevron-down-icon" />,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptyFilters: ActiveFilters = {
  subcategory: [],
  application: [],
  enclosure: [],
  output: [],
  display: [],
  tempSetpoint: [],
  optionalTempOutput: [],
};

interface ActiveFilters {
  subcategory: string[];
  application: string[];
  enclosure: string[];
  output: string[];
  display: string[];
  tempSetpoint: string[];
  optionalTempOutput: string[];
}

const mockSubcategories = [
  { id: '1', name: 'Duct Sensors', slug: 'duct-sensors', count: 12 },
  { id: '2', name: 'Room Sensors', slug: 'room-sensors', count: 8 },
];

const mockFilters: GetProductAttributesQuery = {
  paApplications: {
    nodes: [
      { id: 'app-1', name: 'HVAC', slug: 'hvac', count: 10 },
      { id: 'app-2', name: 'Industrial', slug: 'industrial', count: 5 },
    ],
  },
  paRoomEnclosureStyles: { nodes: [] },
  paTemperatureSensorOutputs: { nodes: [] },
  paHumiditySensorOutputs: { nodes: [] },
  paDisplays: { nodes: [] },
  paTempSetpointAndOverride: { nodes: [] },
  paOptionalTempSensorOutputs: { nodes: [] },
} as unknown as GetProductAttributesQuery;

const emptyFiltersQuery: GetProductAttributesQuery = {
  paApplications: { nodes: [] },
  paRoomEnclosureStyles: { nodes: [] },
  paTemperatureSensorOutputs: { nodes: [] },
  paHumiditySensorOutputs: { nodes: [] },
  paDisplays: { nodes: [] },
  paTempSetpointAndOverride: { nodes: [] },
  paOptionalTempSensorOutputs: { nodes: [] },
} as unknown as GetProductAttributesQuery;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FilterSidebar', () => {
  let onChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChangeMock = vi.fn();
  });

  // ─── Rendering ───────────────────────────────────────────────────────────────

  it('renders the desktop Filters heading', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    // The desktop heading is inside a hidden lg:block div, but it renders in the DOM
    expect(screen.getAllByText('Filters').length).toBeGreaterThan(0);
  });

  it('renders subcategory filter groups when subcategories are provided', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    expect(screen.getAllByText('Duct Sensors').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Room Sensors').length).toBeGreaterThan(0);
  });

  it('does not render subcategory group when there are no subcategories', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    expect(screen.queryByText('Duct Sensors')).not.toBeInTheDocument();
  });

  it('renders application filter group when options are provided', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={mockFilters}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    expect(screen.getAllByText('HVAC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Industrial').length).toBeGreaterThan(0);
  });

  it('does not render application group when no options exist', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    expect(screen.queryByText('HVAC')).not.toBeInTheDocument();
  });

  // ─── onChange interactions ────────────────────────────────────────────────────

  it('calls onChange with selected subcategory when checkbox is checked', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    // Find the Duct Sensors checkbox (first one)
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ subcategory: ['duct-sensors'] }),
    );
  });

  it('calls onChange without subcategory when checkbox is unchecked', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={{ ...emptyFilters, subcategory: ['duct-sensors'] }}
        onChange={onChangeMock}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox (Duct Sensors) is checked — click to uncheck
    fireEvent.click(checkboxes[0]);

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ subcategory: [] }),
    );
  });

  it('calls onChange with selected application when application checkbox is checked', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={mockFilters}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // First app checkbox = HVAC

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ application: ['hvac'] }),
    );
  });

  // ─── Clear All Filters ───────────────────────────────────────────────────────

  it('does not show "Clear All Filters" when no filters are active', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    expect(screen.queryByText('Clear All Filters')).not.toBeInTheDocument();
  });

  it('shows "Clear All Filters" when at least one filter is active', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={{ ...emptyFilters, subcategory: ['duct-sensors'] }}
        onChange={onChangeMock}
      />,
    );
    expect(screen.getAllByText('Clear All Filters').length).toBeGreaterThan(0);
  });

  it('calls onChange with all-empty filters when "Clear All Filters" is clicked', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={mockFilters}
        activeFilters={{ ...emptyFilters, subcategory: ['duct-sensors'], application: ['hvac'] }}
        onChange={onChangeMock}
      />,
    );
    const clearButtons = screen.getAllByText('Clear All Filters');
    fireEvent.click(clearButtons[0]);

    expect(onChangeMock).toHaveBeenCalledWith({
      subcategory: [],
      application: [],
      enclosure: [],
      output: [],
      display: [],
      tempSetpoint: [],
      optionalTempOutput: [],
    });
  });

  // ─── Active filter badge (mobile button) ─────────────────────────────────────

  it('shows active filter count badge on mobile button when filters are active', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={mockFilters}
        activeFilters={{ ...emptyFilters, subcategory: ['duct-sensors'], application: ['hvac'] }}
        onChange={onChangeMock}
      />,
    );
    // The badge shows total count: 1 subcategory + 1 application = 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not show active filter badge when no filters are active', () => {
    render(
      <FilterSidebar
        subcategories={mockSubcategories}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    // No numeric badge rendered
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  // ─── Mobile overlay ───────────────────────────────────────────────────────────

  it('opens mobile overlay when mobile Filters button is clicked', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    // The mobile toggle button (visible on mobile, hidden lg:hidden)
    const mobileButton = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(mobileButton);

    // Close button and Apply Filters button now appear in the overlay
    expect(screen.getByRole('button', { name: /close filters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
  });

  it('closes mobile overlay when close button is clicked', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: /close filters/i }));

    expect(screen.queryByRole('button', { name: /close filters/i })).not.toBeInTheDocument();
  });

  it('closes mobile overlay when Apply Filters is clicked', () => {
    render(
      <FilterSidebar
        subcategories={[]}
        filters={emptyFiltersQuery}
        activeFilters={emptyFilters}
        onChange={onChangeMock}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: /apply filters/i }));

    expect(screen.queryByRole('button', { name: /apply filters/i })).not.toBeInTheDocument();
  });
});
