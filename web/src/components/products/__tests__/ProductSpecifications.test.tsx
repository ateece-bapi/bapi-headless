import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@/test/i18n-test-utils';
import ProductSpecifications, { type SpecificationGroup } from '../ProductSpecifications';

describe('ProductSpecifications Component', () => {
  const mockSpecifications: SpecificationGroup[] = [
    {
      title: 'Technical Specifications',
      specs: [
        { label: 'Operating Temperature', value: '-40°F to 185°F' },
        { label: 'Accuracy', value: '±1% F.S.' },
        { label: 'Power Supply', value: '24 VAC/VDC' },
      ],
    },
    {
      title: 'Physical Specifications',
      specs: [
        { label: 'Dimensions', value: '4.5" x 2.3" x 1.2"' },
        { label: 'Weight', value: '0.5 lbs' },
      ],
    },
    {
      title: 'Compliance',
      specs: [{ label: 'Certifications', value: 'CE, FCC, UL' }],
    },
  ];

  const productName = 'Test Product';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all specification groups', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
      expect(screen.getByText('Physical Specifications')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
    });

    it('renders all specifications when expanded', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
      expect(screen.getByText('-40°F to 185°F')).toBeInTheDocument();
      expect(screen.getByText('Dimensions')).toBeInTheDocument();
    });

    it('shows spec count in group headers', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      expect(screen.getByText('3 specs')).toBeInTheDocument();
      expect(screen.getByText('2 specs')).toBeInTheDocument();
      expect(screen.getByText('1 spec')).toBeInTheDocument();
    });

    it('renders empty state when no specifications', () => {
      renderWithIntl(<ProductSpecifications specifications={[]} productName={productName} />);

      expect(screen.getByText('No specifications available for this product.')).toBeInTheDocument();
    });

    it('renders search input when searchable is true', () => {
      renderWithIntl(
        <ProductSpecifications
          specifications={mockSpecifications}
          productName={productName}
          searchable={true}
        />
      );

      expect(screen.getByPlaceholderText('Search specifications...')).toBeInTheDocument();
    });

    it('does not render search input when searchable is false', () => {
      renderWithIntl(
        <ProductSpecifications
          specifications={mockSpecifications}
          productName={productName}
          searchable={false}
        />
      );

      expect(screen.queryByPlaceholderText('Search specifications...')).not.toBeInTheDocument();
    });

    it('renders download button when downloadable is true', () => {
      renderWithIntl(
        <ProductSpecifications
          specifications={mockSpecifications}
          productName={productName}
          downloadable={true}
        />
      );

      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    it('does not render download button when downloadable is false', () => {
      renderWithIntl(
        <ProductSpecifications
          specifications={mockSpecifications}
          productName={productName}
          downloadable={false}
        />
      );

      expect(screen.queryByRole('button', { name: /download/i })).not.toBeInTheDocument();
    });
  });

  describe('Group Expansion/Collapse', () => {
    it('starts with all groups expanded by default', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      // All specs should be visible
      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
      expect(screen.getByText('Dimensions')).toBeInTheDocument();
      expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('collapses group when header is clicked', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const technicalHeader = screen.getByText('Technical Specifications');

      fireEvent.click(technicalHeader);

      expect(screen.queryByText('Operating Temperature')).not.toBeInTheDocument();
    });

    it('expands collapsed group when header is clicked again', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const technicalHeader = screen.getByText('Technical Specifications');

      // Collapse
      fireEvent.click(technicalHeader);
      expect(screen.queryByText('Operating Temperature')).not.toBeInTheDocument();

      // Expand
      fireEvent.click(technicalHeader);
      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
    });

    it('shows chevron down icon when group is collapsed', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const technicalHeader = screen.getByText('Technical Specifications');

      fireEvent.click(technicalHeader);

      const chevronDown = container.querySelector('.lucide-chevron-down');
      expect(chevronDown).toBeInTheDocument();
    });

    it('shows chevron up icon when group is expanded', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const chevronUp = container.querySelectorAll('.lucide-chevron-up');
      expect(chevronUp.length).toBeGreaterThan(0);
    });
  });

  describe('Expand/Collapse All', () => {
    it('collapses all groups when Collapse All clicked', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const collapseAllButton = screen.getByRole('button', { name: 'Collapse All' });

      fireEvent.click(collapseAllButton);

      expect(screen.queryByText('Operating Temperature')).not.toBeInTheDocument();
      expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
      expect(screen.queryByText('Certifications')).not.toBeInTheDocument();
    });

    it('expands all groups when Expand All clicked', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      // First collapse all
      const collapseAllButton = screen.getByRole('button', { name: 'Collapse All' });
      fireEvent.click(collapseAllButton);

      // Then expand all
      const expandAllButton = screen.getByRole('button', { name: 'Expand All' });
      fireEvent.click(expandAllButton);

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
      expect(screen.getByText('Dimensions')).toBeInTheDocument();
      expect(screen.getByText('Certifications')).toBeInTheDocument();
    });

    it('expands collapsed groups when Expand All clicked', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      // Collapse first group
      const technicalHeader = screen.getByText('Technical Specifications');
      fireEvent.click(technicalHeader);

      // Expand all
      const expandAllButton = screen.getByRole('button', { name: 'Expand All' });
      fireEvent.click(expandAllButton);

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters specifications by label', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'Temperature' } });

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
      expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
    });

    it('filters specifications by value', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: '24 VAC' } });

      expect(screen.getByText('Power Supply')).toBeInTheDocument();
      expect(screen.queryByText('Dimensions')).not.toBeInTheDocument();
    });

    it('is case insensitive', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'temperature' } });

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
    });

    it('shows no results message when search has no matches', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(
        screen.getByText(/No specifications found matching "nonexistent"/)
      ).toBeInTheDocument();
    });

    it('hides groups with no matching specs', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'Temperature' } });

      expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
      expect(screen.queryByText('Physical Specifications')).not.toBeInTheDocument();
      expect(screen.queryByText('Compliance')).not.toBeInTheDocument();
    });

    it('clears search when Clear search button clicked', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      expect(screen.getByText(/No specifications found/)).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      fireEvent.click(clearButton);

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
    });

    it('shows all specs when search is cleared', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'Temperature' } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByText('Operating Temperature')).toBeInTheDocument();
      expect(screen.getByText('Dimensions')).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    it('triggers download when download button clicked', () => {
      // Mock URL methods
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const downloadButton = screen.getByRole('button', { name: /download/i });

      fireEvent.click(downloadButton);

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });

    it('generates filename from product name', () => {
      // Mock createElement to capture the download attribute
      const originalCreateElement = document.createElement.bind(document);
      let capturedFilename = '';

      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          Object.defineProperty(element, 'download', {
            set(value) {
              capturedFilename = value;
            },
            get() {
              return capturedFilename;
            },
          });
        }
        return element;
      });

      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName="My Product Name" />
      );
      const downloadButton = screen.getByRole('button', { name: /download/i });

      fireEvent.click(downloadButton);

      expect(capturedFilename).toBe('My-Product-Name-specifications.txt');

      vi.restoreAllMocks();
    });
  });

  describe('Table Display', () => {
    it('renders specifications in a table', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const tables = screen.getAllByRole('table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('displays label in first column', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const cells = screen.getAllByRole('cell');
      const labelCells = cells.filter((cell) => cell.textContent === 'Operating Temperature');
      expect(labelCells.length).toBeGreaterThan(0);
    });

    it('displays value in second column', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const cells = screen.getAllByRole('cell');
      const valueCells = cells.filter((cell) => cell.textContent === '-40°F to 185°F');
      expect(valueCells.length).toBeGreaterThan(0);
    });

    it('applies alternating row colors', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows[0].className).toContain('bg-neutral-50');
      expect(rows[1].className).toContain('bg-white');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading elements for group titles', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThan(0);
    });

    it('has proper button roles for expand/collapse', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      expect(screen.getByRole('button', { name: 'Expand All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Collapse All' })).toBeInTheDocument();
    });

    it('has accessible group toggle buttons', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const technicalHeader = screen.getByText('Technical Specifications').closest('button');
      expect(technicalHeader).toBeInTheDocument();
    });

    it('has proper table structure', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const tables = screen.getAllByRole('table');
      tables.forEach((table) => {
        expect(table.querySelector('tbody')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('uses responsive flex layout for header', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const header = container.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(header).toBeInTheDocument();
    });

    it('hides Download text on small screens', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const downloadText = container.querySelector('.hidden.sm\\:inline');
      expect(downloadText?.textContent).toBe('Download');
    });

    it('adjusts table column widths responsively', () => {
      const { container } = renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      const labelCell = container.querySelector('td.w-1\\/3.sm\\:w-1\\/4');
      expect(labelCell).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty specification groups', () => {
      const emptyGroups: SpecificationGroup[] = [
        {
          title: 'Empty Group',
          specs: [],
        },
      ];

      renderWithIntl(
        <ProductSpecifications specifications={emptyGroups} productName={productName} />
      );

      // Component filters out empty groups, so nothing should render
      expect(screen.queryByText('Empty Group')).not.toBeInTheDocument();
    });

    it('handles long product names in download', () => {
      const longName = 'Very Long Product Name With Many Words And Spaces';

      let capturedFilename = '';
      const originalCreateElement = document.createElement.bind(document);

      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          Object.defineProperty(element, 'download', {
            set(value) {
              capturedFilename = value;
            },
            get() {
              return capturedFilename;
            },
          });
        }
        return element;
      });

      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={longName} />
      );
      const downloadButton = screen.getByRole('button', { name: /download/i });

      fireEvent.click(downloadButton);

      expect(capturedFilename).toContain('Very-Long-Product-Name-With-Many-Words-And-Spaces');

      vi.restoreAllMocks();
    });

    it('handles specifications with special characters', () => {
      const specialSpecs: SpecificationGroup[] = [
        {
          title: 'Special Characters',
          specs: [
            { label: 'Voltage', value: '±10V' },
            { label: 'Current', value: '≤5A' },
            { label: 'Range', value: '0°C → 100°C' },
          ],
        },
      ];

      renderWithIntl(
        <ProductSpecifications specifications={specialSpecs} productName={productName} />
      );

      expect(screen.getByText('±10V')).toBeInTheDocument();
      expect(screen.getByText('≤5A')).toBeInTheDocument();
      expect(screen.getByText('0°C → 100°C')).toBeInTheDocument();
    });

    it('handles search with no initial results', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );
      const searchInput = screen.getByPlaceholderText('Search specifications...');

      fireEvent.change(searchInput, { target: { value: 'xyz123' } });

      expect(screen.getByText(/No specifications found matching "xyz123"/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('maintains expansion state after search', () => {
      renderWithIntl(
        <ProductSpecifications specifications={mockSpecifications} productName={productName} />
      );

      // Collapse a group
      const technicalHeader = screen.getByText('Technical Specifications');
      fireEvent.click(technicalHeader);

      // Search
      const searchInput = screen.getByPlaceholderText('Search specifications...');
      fireEvent.change(searchInput, { target: { value: 'Dimensions' } });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });

      // Technical specs should still be collapsed
      expect(screen.queryByText('Operating Temperature')).not.toBeInTheDocument();
    });
  });
});
