/**
 * FavoriteButton component tests
 *
 * Covers:
 * - Unauthenticated: renders, redirects to sign-in on click
 * - Authenticated: checks status on mount, toggles favorite, optimistic update, rollback
 * - Size + variant prop rendering
 * - Accessibility (aria-label, aria-pressed, disabled)
 * - onToggle callback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockUseAuth, mockPush, mockUseParams, mockFetch, mockToast } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockPush: vi.fn(),
  mockUseParams: vi.fn(),
  mockFetch: vi.fn(),
  mockToast: {
    info: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuth', () => ({ useAuth: mockUseAuth }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: mockUseParams,
}));
vi.mock('sonner', () => ({ toast: mockToast }));
vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));
vi.mock('@/lib/icons', () => ({
  HeartIcon: ({ className }: { className?: string }) => (
    <svg data-testid="heart-icon" className={className} />
  ),
  HeartOutlineIcon: ({ className }: { className?: string }) => (
    <svg data-testid="heart-outline-icon" className={className} />
  ),
}));

import FavoriteButton from '../FavoriteButton';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AUTHED_USER = { id: 'user-123', email: 'test@bapi.com', displayName: 'Test User' };

const DEFAULT_PROPS = {
  productId: 'prod-1',
  productName: 'BAPI-Stat 4',
  productSlug: 'bapi-stat-4',
  productImage: 'https://example.com/img.jpg',
  productPrice: '$99.00',
};

function mockFetchResponse(data: object, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ locale: 'en' });
    // Default: unauthenticated
    mockUseAuth.mockReturnValue({ user: null, isLoaded: true });
    // Default fetch returns empty favorites
    mockFetch.mockReturnValue(mockFetchResponse({ favorites: [] }));
    vi.stubGlobal('fetch', mockFetch);
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders a button', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the heart icon', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders in button variant with Save label', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} variant="button" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows Saved label in button variant when favorited', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch.mockReturnValue(
      mockFetchResponse({ favorites: [{ productId: 'prod-1' }] }),
    );
    render(<FavoriteButton {...DEFAULT_PROPS} variant="button" />);
    await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());
  });

  // ── Aria ───────────────────────────────────────────────────────────────────

  it('has correct aria-label when not favorited', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Add BAPI-Stat 4 to favorites',
    );
  });

  it('has aria-pressed=false when not favorited', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true when favorited', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch.mockReturnValue(
      mockFetchResponse({ favorites: [{ productId: 'prod-1' }] }),
    );
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );
  });

  it('has correct aria-label when favorited', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch.mockReturnValue(
      mockFetchResponse({ favorites: [{ productId: 'prod-1' }] }),
    );
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Remove BAPI-Stat 4 from favorites',
      ),
    );
  });

  // ── Unauthenticated behavior ───────────────────────────────────────────────

  it('does not fetch favorites when user is not authenticated', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('redirects to sign-in when unauthenticated user clicks', async () => {
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockToast.info).toHaveBeenCalledWith('Please sign in to save favorites');
    expect(mockPush).toHaveBeenCalledWith('/en/sign-in');
  });

  it('uses locale from useParams in the sign-in redirect URL', async () => {
    mockUseParams.mockReturnValue({ locale: 'de' });
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/de/sign-in');
  });

  // ── Authenticated: checking status on mount ────────────────────────────────

  it('fetches favorites on mount when authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/api/favorites'));
  });

  it('sets isFavorited=true when product is in favorites list', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch.mockReturnValue(
      mockFetchResponse({ favorites: [{ productId: 'prod-1' }, { productId: 'prod-2' }] }),
    );
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );
  });

  it('leaves isFavorited=false when product is NOT in favorites list', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch.mockReturnValue(
      mockFetchResponse({ favorites: [{ productId: 'prod-99' }] }),
    );
    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  // ── Add to favorites ───────────────────────────────────────────────────────

  it('calls POST /api/favorites when adding', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    // Fetch sequence: mount check (GET), then add (POST)
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [] }))
      .mockReturnValueOnce(mockFetchResponse({ success: true, favorite: { productId: 'prod-1' } }));

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/favorites'));

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/favorites',
        expect.objectContaining({ method: 'POST' }),
      ),
    );
  });

  it('shows success toast after adding', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [] }))
      .mockReturnValueOnce(mockFetchResponse({ success: true, favorite: {} }));

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(mockToast.success).toHaveBeenCalledWith('Added to favorites', expect.anything()),
    );
  });

  it('calls onToggle(true) after successful add', async () => {
    const onToggle = vi.fn();
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [] }))
      .mockReturnValueOnce(mockFetchResponse({ success: true, favorite: {} }));

    render(<FavoriteButton {...DEFAULT_PROPS} onToggle={onToggle} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true));
  });

  // ── Remove from favorites ──────────────────────────────────────────────────

  it('calls DELETE /api/favorites?productId=... when removing', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [{ productId: 'prod-1' }] })) // mount
      .mockReturnValueOnce(mockFetchResponse({ success: true })); // DELETE

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/favorites?productId=prod-1',
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
  });

  it('shows success toast after removing', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [{ productId: 'prod-1' }] }))
      .mockReturnValueOnce(mockFetchResponse({ success: true }));

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(mockToast.success).toHaveBeenCalledWith('Removed from favorites', expect.anything()),
    );
  });

  it('calls onToggle(false) after successful remove', async () => {
    const onToggle = vi.fn();
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [{ productId: 'prod-1' }] }))
      .mockReturnValueOnce(mockFetchResponse({ success: true }));

    render(<FavoriteButton {...DEFAULT_PROPS} onToggle={onToggle} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(false));
  });

  // ── Error rollback ─────────────────────────────────────────────────────────

  it('rolls back optimistic update when add fails', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [] }))        // mount GET
      .mockReturnValueOnce(mockFetchResponse({}, false, 500));           // POST fails

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockToast.error).toHaveBeenCalled());

    // Should have rolled back to not-favorited
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('rolls back optimistic update when remove fails', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [{ productId: 'prod-1' }] })) // mount
      .mockReturnValueOnce(mockFetchResponse({}, false, 500));                            // DELETE fails

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() =>
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'),
    );
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockToast.error).toHaveBeenCalled());

    // Should have rolled back to favorited
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('is disabled while loading (click in flight)', async () => {
    mockUseAuth.mockReturnValue({ user: AUTHED_USER, isLoaded: true });
    // Never resolves so we can inspect mid-flight state
    let resolve: (v: Response) => void;
    const pending = new Promise<Response>((res) => { resolve = res; });
    mockFetch
      .mockReturnValueOnce(mockFetchResponse({ favorites: [] }))
      .mockReturnValueOnce(pending);

    render(<FavoriteButton {...DEFAULT_PROPS} />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button'));
    // Immediately after click, button should be disabled
    expect(screen.getByRole('button')).toBeDisabled();

    // Cleanup
    resolve!(mockFetchResponse({ success: true, favorite: {} }) as unknown as Response);
  });

  // ── Size prop ──────────────────────────────────────────────────────────────

  it('applies sm size classes', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('w-8', 'h-8');
  });

  it('applies lg size classes', () => {
    render(<FavoriteButton {...DEFAULT_PROPS} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12');
  });
});
