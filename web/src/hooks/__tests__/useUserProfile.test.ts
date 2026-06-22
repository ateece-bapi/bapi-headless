/**
 * useUserProfile hook tests
 *
 * useUserProfile is a thin wrapper over useAuth() that conditionally
 * injects mock profile data when isMockDataEnabled() returns true.
 *
 * Strategy: mock @/hooks/useAuth and @/lib/mock-user-data.
 *
 * Covers:
 * - Not loaded → isLoaded false, profile null
 * - Loaded but not signed in → isSignedIn false, profile null
 * - Signed in, mock data enabled, user has mock profile → profile populated, isMockData true
 * - Signed in, mock data enabled, user has NO mock profile → profile null, isMockData false
 * - Signed in, mock data disabled → profile null, isMockData false
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserProfile } from '../useUserProfile';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mockUseAuth() }));

const mockIsMockDataEnabled = vi.fn();
const mockGetMockUserData = vi.fn();
vi.mock('@/lib/mock-user-data', () => ({
  isMockDataEnabled: () => mockIsMockDataEnabled(),
  getMockUserData: (id: string) => mockGetMockUserData(id),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_AUTH_USER = {
  id: 'user-1',
  email: 'jane@example.com',
  displayName: 'Jane Doe',
  username: 'janedoe',
  customerGroups: ['reseller'],
};

const MOCK_PROFILE = {
  userId: 'user-1',
  companyName: 'Acme Corp',
  accountNumber: 'ACC-001',
  billingAddress: { street: '1 Main St', city: 'Anytown', state: 'CA', zip: '90210', country: 'US' },
  shippingAddresses: [],
  paymentMethods: [],
  orderHistory: [],
  preferences: { currency: 'USD', language: 'en', measurementSystem: 'imperial' },
};

// ─── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => { vi.clearAllMocks(); });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useUserProfile – not yet loaded', () => {
  it('returns isLoaded false and profile null while auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoaded: false, isSignedIn: false });
    mockIsMockDataEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.isMockData).toBe(false);
  });
});

describe('useUserProfile – loaded, not signed in', () => {
  it('returns isSignedIn false and profile null', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoaded: true, isSignedIn: false });
    mockIsMockDataEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.profile).toBeNull();
  });
});

describe('useUserProfile – signed in with mock data', () => {
  it('returns mock profile and isMockData true when mock data is enabled', () => {
    mockUseAuth.mockReturnValue({ user: MOCK_AUTH_USER, isLoaded: true, isSignedIn: true });
    mockIsMockDataEnabled.mockReturnValue(true);
    mockGetMockUserData.mockReturnValue(MOCK_PROFILE);

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.user).toEqual(MOCK_AUTH_USER);
    expect(result.current.profile).toEqual(MOCK_PROFILE);
    expect(result.current.isMockData).toBe(true);
  });

  it('calls getMockUserData with the user id', () => {
    mockUseAuth.mockReturnValue({ user: MOCK_AUTH_USER, isLoaded: true, isSignedIn: true });
    mockIsMockDataEnabled.mockReturnValue(true);
    mockGetMockUserData.mockReturnValue(MOCK_PROFILE);

    renderHook(() => useUserProfile());

    expect(mockGetMockUserData).toHaveBeenCalledWith('user-1');
  });
});

describe('useUserProfile – signed in, mock enabled, no mock profile for user', () => {
  it('falls through to real data path (profile null, isMockData false)', () => {
    mockUseAuth.mockReturnValue({ user: MOCK_AUTH_USER, isLoaded: true, isSignedIn: true });
    mockIsMockDataEnabled.mockReturnValue(true);
    mockGetMockUserData.mockReturnValue(null); // no mock data for this user

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.isMockData).toBe(false);
  });
});

describe('useUserProfile – signed in, mock data disabled', () => {
  it('returns profile null and isMockData false in production mode', () => {
    mockUseAuth.mockReturnValue({ user: MOCK_AUTH_USER, isLoaded: true, isSignedIn: true });
    mockIsMockDataEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.profile).toBeNull();
    expect(result.current.isMockData).toBe(false);
    expect(mockGetMockUserData).not.toHaveBeenCalled();
  });
});
