/**
 * auth/roles.ts tests
 *
 * Pure RBAC utility functions — no mocking needed.
 *
 * Covers every exported function:
 * - isAdmin: administrator, shop_manager → true; others → false; null/no-roles → false
 * - isCustomer: customer → true; others → false; null/no-roles → false
 * - hasRole: any role match → true; no match → false; edge cases
 * - isAuthenticated: any role present → true; empty/null → false
 * - getPrimaryRole: returns first role; null when none
 * - hasPermission: view_admin, manage_orders, manage_products, view_analytics
 */

import { describe, it, expect } from 'vitest';
import {
  isAdmin,
  isCustomer,
  hasRole,
  isAuthenticated,
  getPrimaryRole,
  hasPermission,
  type User,
} from '../../auth/roles';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeUser(roles: string[]): User {
  return { id: '1', email: 'test@example.com', displayName: 'Test', username: 'test', roles };
}

const admin = makeUser(['administrator']);
const shopManager = makeUser(['shop_manager']);
const customer = makeUser(['customer']);
const subscriber = makeUser(['subscriber']);
const editor = makeUser(['editor']);
const noRoles = makeUser([]);
const multiRole = makeUser(['administrator', 'customer']);

// ─── isAdmin ─────────────────────────────────────────────────────────────────

describe('isAdmin', () => {
  it('returns true for administrator role', () => {
    expect(isAdmin(admin)).toBe(true);
  });

  it('returns true for shop_manager role', () => {
    expect(isAdmin(shopManager)).toBe(true);
  });

  it('returns false for customer role', () => {
    expect(isAdmin(customer)).toBe(false);
  });

  it('returns false for subscriber role', () => {
    expect(isAdmin(subscriber)).toBe(false);
  });

  it('returns false for editor role', () => {
    expect(isAdmin(editor)).toBe(false);
  });

  it('returns false for user with no roles array', () => {
    const user: User = { id: '1', email: 'x@x.com', displayName: 'X', username: 'x' };
    expect(isAdmin(user)).toBe(false);
  });

  it('returns false for user with empty roles array', () => {
    expect(isAdmin(noRoles)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAdmin(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isAdmin(undefined)).toBe(false);
  });

  it('returns true when administrator is one of multiple roles', () => {
    expect(isAdmin(multiRole)).toBe(true);
  });
});

// ─── isCustomer ──────────────────────────────────────────────────────────────

describe('isCustomer', () => {
  it('returns true for customer role', () => {
    expect(isCustomer(customer)).toBe(true);
  });

  it('returns false for administrator', () => {
    expect(isCustomer(admin)).toBe(false);
  });

  it('returns false for subscriber', () => {
    expect(isCustomer(subscriber)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isCustomer(null)).toBe(false);
  });

  it('returns false for empty roles', () => {
    expect(isCustomer(noRoles)).toBe(false);
  });

  it('returns true when customer is one of multiple roles', () => {
    expect(isCustomer(makeUser(['subscriber', 'customer']))).toBe(true);
  });
});

// ─── hasRole ─────────────────────────────────────────────────────────────────

describe('hasRole', () => {
  it('returns true when user has a role in the list', () => {
    expect(hasRole(admin, ['administrator', 'editor'])).toBe(true);
  });

  it('returns true with single-role list matching', () => {
    expect(hasRole(customer, ['customer'])).toBe(true);
  });

  it('returns false when user has none of the given roles', () => {
    expect(hasRole(subscriber, ['administrator', 'shop_manager'])).toBe(false);
  });

  it('returns false for empty role list', () => {
    expect(hasRole(admin, [])).toBe(false);
  });

  it('returns false for null user', () => {
    expect(hasRole(null, ['administrator'])).toBe(false);
  });

  it('returns false for undefined user', () => {
    expect(hasRole(undefined, ['customer'])).toBe(false);
  });

  it('returns false for user with no roles property', () => {
    const user: User = { id: '1', email: 'x@x.com', displayName: 'X', username: 'x' };
    expect(hasRole(user, ['customer'])).toBe(false);
  });

  it('returns false for user with empty roles array', () => {
    expect(hasRole(noRoles, ['customer'])).toBe(false);
  });
});

// ─── isAuthenticated ─────────────────────────────────────────────────────────

describe('isAuthenticated', () => {
  it('returns true for user with at least one role', () => {
    expect(isAuthenticated(subscriber)).toBe(true);
  });

  it('returns true for admin', () => {
    expect(isAuthenticated(admin)).toBe(true);
  });

  it('returns false for user with empty roles array', () => {
    expect(isAuthenticated(noRoles)).toBe(false);
  });

  it('returns false for user with no roles property', () => {
    const user: User = { id: '1', email: 'x@x.com', displayName: 'X', username: 'x' };
    expect(isAuthenticated(user)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAuthenticated(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isAuthenticated(undefined)).toBe(false);
  });
});

// ─── getPrimaryRole ───────────────────────────────────────────────────────────

describe('getPrimaryRole', () => {
  it('returns the first role for a single-role user', () => {
    expect(getPrimaryRole(admin)).toBe('administrator');
  });

  it('returns the first role for a multi-role user', () => {
    expect(getPrimaryRole(makeUser(['editor', 'subscriber']))).toBe('editor');
  });

  it('returns null for empty roles array', () => {
    expect(getPrimaryRole(noRoles)).toBeNull();
  });

  it('returns null for user with no roles property', () => {
    const user: User = { id: '1', email: 'x@x.com', displayName: 'X', username: 'x' };
    expect(getPrimaryRole(user)).toBeNull();
  });

  it('returns null for null user', () => {
    expect(getPrimaryRole(null)).toBeNull();
  });

  it('returns null for undefined user', () => {
    expect(getPrimaryRole(undefined)).toBeNull();
  });
});

// ─── hasPermission ────────────────────────────────────────────────────────────

describe('hasPermission', () => {
  const permissions = ['view_admin', 'manage_orders', 'manage_products', 'view_analytics'] as const;

  for (const permission of permissions) {
    it(`grants ${permission} to administrator`, () => {
      expect(hasPermission(admin, permission)).toBe(true);
    });

    it(`grants ${permission} to shop_manager`, () => {
      expect(hasPermission(shopManager, permission)).toBe(true);
    });

    it(`denies ${permission} to customer`, () => {
      expect(hasPermission(customer, permission)).toBe(false);
    });

    it(`denies ${permission} to subscriber`, () => {
      expect(hasPermission(subscriber, permission)).toBe(false);
    });
  }

  it('returns false for null user', () => {
    expect(hasPermission(null, 'view_admin')).toBe(false);
  });

  it('returns false for user with no roles', () => {
    expect(hasPermission(noRoles, 'manage_orders')).toBe(false);
  });
});
