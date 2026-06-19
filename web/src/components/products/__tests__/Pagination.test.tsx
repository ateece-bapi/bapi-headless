/**
 * Pagination Component Tests
 *
 * Tests page navigation logic and rendering:
 * - Returns null when totalPages <= 1
 * - Renders page info (Page X of Y)
 * - Renders Previous / Next buttons
 * - Previous button is disabled on page 1
 * - Next button is disabled on the last page
 * - Clicking a page number pushes correct URL
 * - Clicking Next increments the page
 * - Clicking Previous decrements the page
 * - Page 1 removes the `page` param from URL (clean URL)
 * - Ellipsis displayed when totalPages > 7
 * - Always shows first and last page numbers
 * - Shows pages around current page in the middle
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '../Pagination';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockPush, mockSearchParams } = vi.hoisted(() => {
  const mockPush = vi.fn();
  const mockSearchParams = { toString: () => '', get: vi.fn(), getAll: vi.fn() };
  return { mockPush, mockSearchParams };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Null render guards ───────────────────────────────────────────────────────

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} totalProducts={10} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} totalProducts={0} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  // ─── Page info ────────────────────────────────────────────────────────────────

  it('shows current page and total pages in the info label', () => {
    render(<Pagination currentPage={2} totalPages={5} totalProducts={50} />);
    // The page info reads "Page 2 of 5"
    expect(screen.getByText(/page/i).closest('div')).toHaveTextContent('2');
    expect(screen.getByText(/page/i).closest('div')).toHaveTextContent('5');
  });

  // ─── Navigation buttons ───────────────────────────────────────────────────────

  it('renders Previous and Next buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} totalProducts={50} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} totalProducts={50} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} totalProducts={50} />);
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('enables both Previous and Next when on a middle page', () => {
    render(<Pagination currentPage={3} totalPages={5} totalProducts={50} />);
    expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
  });

  // ─── Click navigation ─────────────────────────────────────────────────────────

  it('pushes ?page=2 when clicking page 2 button', () => {
    render(<Pagination currentPage={1} totalPages={5} totalProducts={50} />);
    // Page buttons use aria-label="Go to page N"
    fireEvent.click(screen.getByRole('button', { name: /go to page 2/i }));
    expect(mockPush).toHaveBeenCalledWith('?page=2', expect.any(Object));
  });

  it('removes page param when navigating to page 1 (clean URL)', () => {
    render(<Pagination currentPage={2} totalPages={5} totalProducts={50} />);
    fireEvent.click(screen.getByRole('button', { name: /go to page 1/i }));
    const call = mockPush.mock.calls[0][0];
    expect(call).not.toContain('page=1');
  });

  it('navigates to next page when Next is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} totalProducts={50} />);
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(mockPush).toHaveBeenCalledWith('?page=3', expect.any(Object));
  });

  it('navigates to previous page when Previous is clicked', () => {
    render(<Pagination currentPage={3} totalPages={5} totalProducts={50} />);
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(mockPush).toHaveBeenCalledWith('?page=2', expect.any(Object));
  });

  it('navigates to page 1 (clean URL) when Previous clicked on page 2', () => {
    render(<Pagination currentPage={2} totalPages={5} totalProducts={50} />);
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    const call = mockPush.mock.calls[0][0];
    expect(call).not.toContain('page=1');
  });

  // ─── Page number display ─────────────────────────────────────────────────────

  it('shows all page number buttons when totalPages is 7 or fewer', () => {
    render(<Pagination currentPage={1} totalPages={5} totalProducts={50} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: new RegExp(`go to page ${i}`, 'i') })).toBeInTheDocument();
    }
  });

  it('shows ellipsis when totalPages > 7 and current page is far from edges', () => {
    render(<Pagination currentPage={5} totalPages={10} totalProducts={100} />);
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('always shows page 1 button when totalPages > 7', () => {
    render(<Pagination currentPage={8} totalPages={10} totalProducts={100} />);
    // Use exact label to avoid matching "Go to page 10"
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
  });

  it('always shows last page button when totalPages > 7', () => {
    render(<Pagination currentPage={2} totalPages={10} totalProducts={100} />);
    expect(screen.getByRole('button', { name: /go to page 10/i })).toBeInTheDocument();
  });

  // ─── Scroll behaviour ─────────────────────────────────────────────────────────

  it('passes scroll: true to router.push for page navigation', () => {
    render(<Pagination currentPage={1} totalPages={5} totalProducts={50} />);
    fireEvent.click(screen.getByRole('button', { name: /go to page 2/i }));
    expect(mockPush).toHaveBeenCalledWith('?page=2', { scroll: true });
  });
});
