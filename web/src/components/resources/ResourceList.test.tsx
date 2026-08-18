import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResourceList } from './ResourceList';

const { mockReplace, mockSearchParams, mockSearchParamsValue } = vi.hoisted(() => {
  const value = { current: '' };

  return {
    mockReplace: vi.fn(),
    mockSearchParamsValue: value,
    mockSearchParams: {
      get: vi.fn((key: string) => new URLSearchParams(value.current).get(key)),
      toString: vi.fn(() => value.current),
    },
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/resources',
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

const resources = Array.from({ length: 25 }, (_, index) => {
  const documentNumber = String(index + 1).padStart(3, '0');

  return {
    id: `resource-${documentNumber}`,
    databaseId: index + 1,
    title: `Document ${documentNumber}`,
    description: null,
    mediaItemUrl: `/documents/document-${documentNumber}.pdf`,
    fileSize: 1024,
    date: '2026-01-01',
    sourceUrl: `/documents/document-${documentNumber}.pdf`,
  };
});

describe('ResourceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsValue.current = '';
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('defaults to the compact list view and renders 24 documents per page', () => {
    render(<ResourceList resources={resources} />);

    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getAllByRole('link')).toHaveLength(24);
    expect(screen.getByText('Document 001')).toBeInTheDocument();
    expect(screen.queryByText('Document 025')).not.toBeInTheDocument();
    expect(screen.getByText(/Page/).parentElement).toHaveTextContent('Page 1 of 2');
  });

  it('renders the remaining documents and updates the URL on the next page', () => {
    render(<ResourceList resources={resources} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText('Document 025')).toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith('/en/resources?page=2', { scroll: false });
  });

  it('stores the selected document type in the URL and resets pagination', () => {
    render(<ResourceList resources={resources} />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter by Installation Guides' }));

    expect(mockReplace).toHaveBeenCalledWith('/en/resources?type=installation', {
      scroll: false,
    });
  });

  it('synchronizes every control when browser navigation changes the URL', async () => {
    const { rerender } = render(<ResourceList resources={resources} />);

    mockSearchParamsValue.current =
      'search=Document&type=other&sort=date-desc&view=grid&page=2';
    rerender(<ResourceList resources={resources} />);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Search documents' })).toHaveValue('Document');
      expect(screen.getByRole('button', { name: 'Filter by Other Resources' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('combobox', { name: 'Sort documents' })).toHaveValue('date-desc');
      expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByText(/Page/).parentElement).toHaveTextContent('Page 2 of 2');
      expect(screen.getByText('Document 025')).toBeInTheDocument();
    });
  });
});
