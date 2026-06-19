/**
 * /api/cart route tests
 *
 * Covers:
 * - GET /api/cart: success with/without session token, 500 error
 * - POST /api/cart/add: validation, success, cookie set, 500 error
 * - DELETE /api/cart/remove: 401 no session, validation, success, 500 error
 * - PATCH /api/cart/update: 401 no session, validation (quantity ≥ 0), success, 500 error
 * - DELETE /api/cart/clear: 401 no session, success, 500 error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const { mockGetCart, mockAddToCart, mockRemoveItem, mockUpdateQuantity, mockEmptyCart } =
  vi.hoisted(() => ({
    mockGetCart: vi.fn(),
    mockAddToCart: vi.fn(),
    mockRemoveItem: vi.fn(),
    mockUpdateQuantity: vi.fn(),
    mockEmptyCart: vi.fn(),
  }));

vi.mock('@/lib/services/cart', () => ({
  CartService: {
    getCart: mockGetCart,
    addToCart: mockAddToCart,
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    emptyCart: mockEmptyCart,
  },
}));

vi.mock('@/lib/logger', () => ({
  default: { info: vi.fn(), error: vi.fn(), debug: vi.fn(), warn: vi.fn() },
}));

// ─── Import routes after mocks ────────────────────────────────────────────────

import { GET as cartGet } from '../route';
import { POST as cartAdd } from '../add/route';
import { DELETE as cartRemove } from '../remove/route';
import { PATCH as cartUpdate } from '../update/route';
import { DELETE as cartClear } from '../clear/route';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_CART = {
  isEmpty: false,
  total: '$150.00',
  subtotal: '$150.00',
  contents: { nodes: [{ key: 'abc123', quantity: 2, product: { node: { name: 'BAPI-Stat 4' } } }] },
};

function makeGet(path: string, cookies: Record<string, string> = {}) {
  const url = `http://localhost${path}`;
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method: 'GET',
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

function makePost(path: string, body: unknown, cookies: Record<string, string> = {}) {
  const url = `http://localhost${path}`;
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });
}

function makeDelete(path: string, body: unknown, cookies: Record<string, string> = {}) {
  const url = `http://localhost${path}`;
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });
}

function makePatch(path: string, body: unknown, cookies: Record<string, string> = {}) {
  const url = `http://localhost${path}`;
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });
}

// ─── GET /api/cart ─────────────────────────────────────────────────────────────

describe('GET /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCart.mockResolvedValue({ cart: MOCK_CART });
  });

  it('returns cart data on success', async () => {
    const req = makeGet('/api/cart');
    const res = await cartGet(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.cart).toEqual(MOCK_CART);
  });

  it('passes woo-session cookie to CartService', async () => {
    const req = makeGet('/api/cart', { 'woo-session': 'tok123' });
    await cartGet(req);
    expect(mockGetCart).toHaveBeenCalledWith('tok123');
  });

  it('passes woocommerce-session cookie when woo-session absent', async () => {
    const req = makeGet('/api/cart', { 'woocommerce-session': 'tok456' });
    await cartGet(req);
    expect(mockGetCart).toHaveBeenCalledWith('tok456');
  });

  it('passes undefined when no session cookie present', async () => {
    const req = makeGet('/api/cart');
    await cartGet(req);
    expect(mockGetCart).toHaveBeenCalledWith(undefined);
  });

  it('returns 500 when CartService throws', async () => {
    mockGetCart.mockRejectedValue(new Error('WooCommerce unreachable'));
    const req = makeGet('/api/cart');
    const res = await cartGet(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});

// ─── POST /api/cart/add ────────────────────────────────────────────────────────

describe('POST /api/cart/add', () => {
  const CART_RESULT = {
    addToCart: {
      cart: MOCK_CART,
      cartItem: { key: 'item-key-xyz' },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddToCart.mockResolvedValue(CART_RESULT);
  });

  it('returns 400 when productId is missing', async () => {
    const req = makePost('/api/cart/add', { quantity: 1 });
    const res = await cartAdd(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when productId is not a positive integer', async () => {
    const req = makePost('/api/cart/add', { productId: -5 });
    const res = await cartAdd(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when quantity is not positive', async () => {
    const req = makePost('/api/cart/add', { productId: 42, quantity: 0 });
    const res = await cartAdd(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 with cart and cartItem on success', async () => {
    const req = makePost('/api/cart/add', { productId: 42, quantity: 2 });
    const res = await cartAdd(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.cart).toEqual(MOCK_CART);
    expect(json.cartKey).toBe('item-key-xyz');
  });

  it('calls CartService.addToCart with correct args including variationId', async () => {
    const req = makePost('/api/cart/add', { productId: 10, quantity: 3, variationId: 99 });
    await cartAdd(req);
    expect(mockAddToCart).toHaveBeenCalledWith(10, 3, 99, undefined);
  });

  it('passes session token from woo-session cookie', async () => {
    const req = makePost('/api/cart/add', { productId: 1 }, { 'woo-session': 'sess-abc' });
    await cartAdd(req);
    expect(mockAddToCart).toHaveBeenCalledWith(1, 1, undefined, 'sess-abc');
  });

  it('sets woo-cart-key cookie when cartItem.key is returned', async () => {
    const req = makePost('/api/cart/add', { productId: 1 });
    const res = await cartAdd(req);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('woo-cart-key');
    expect(setCookie).toContain('item-key-xyz');
  });

  it('does NOT set woo-cart-key when no key returned', async () => {
    mockAddToCart.mockResolvedValue({ addToCart: { cart: MOCK_CART, cartItem: {} } });
    const req = makePost('/api/cart/add', { productId: 1 });
    const res = await cartAdd(req);
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeNull();
  });

  it('returns 500 when CartService throws', async () => {
    mockAddToCart.mockRejectedValue(new Error('GraphQL error'));
    const req = makePost('/api/cart/add', { productId: 1 });
    const res = await cartAdd(req);
    expect(res.status).toBe(500);
  });
});

// ─── DELETE /api/cart/remove ───────────────────────────────────────────────────

describe('DELETE /api/cart/remove', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRemoveItem.mockResolvedValue({ removeItemsFromCart: { cart: MOCK_CART } });
  });

  it('returns 401 when woocommerce-session cookie is absent', async () => {
    const req = makeDelete('/api/cart/remove', { key: 'abc123' });
    const res = await cartRemove(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when key is missing', async () => {
    const req = makeDelete('/api/cart/remove', {}, { 'woocommerce-session': 'sess' });
    const res = await cartRemove(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 with updated cart on success', async () => {
    const req = makeDelete('/api/cart/remove', { key: 'abc123' }, { 'woocommerce-session': 'sess' });
    const res = await cartRemove(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.cart).toEqual(MOCK_CART);
  });

  it('calls CartService.removeItem with correct key and session', async () => {
    const req = makeDelete('/api/cart/remove', { key: 'key-99' }, { 'woocommerce-session': 'sess-xyz' });
    await cartRemove(req);
    expect(mockRemoveItem).toHaveBeenCalledWith('key-99', 'sess-xyz');
  });

  it('returns 500 when CartService throws', async () => {
    mockRemoveItem.mockRejectedValue(new Error('network'));
    const req = makeDelete('/api/cart/remove', { key: 'abc' }, { 'woocommerce-session': 'sess' });
    const res = await cartRemove(req);
    expect(res.status).toBe(500);
  });
});

// ─── PATCH /api/cart/update ────────────────────────────────────────────────────

describe('PATCH /api/cart/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateQuantity.mockResolvedValue({ updateItemQuantities: { cart: MOCK_CART } });
  });

  it('returns 401 when woocommerce-session cookie is absent', async () => {
    const req = makePatch('/api/cart/update', { key: 'abc', quantity: 2 });
    const res = await cartUpdate(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when key is missing', async () => {
    const req = makePatch('/api/cart/update', { quantity: 2 }, { 'woocommerce-session': 'sess' });
    const res = await cartUpdate(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when quantity is negative', async () => {
    const req = makePatch('/api/cart/update', { key: 'abc', quantity: -1 }, { 'woocommerce-session': 'sess' });
    const res = await cartUpdate(req);
    expect(res.status).toBe(400);
  });

  it('allows quantity 0 (removes item)', async () => {
    const req = makePatch('/api/cart/update', { key: 'abc', quantity: 0 }, { 'woocommerce-session': 'sess' });
    const res = await cartUpdate(req);
    expect(res.status).toBe(200);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('abc', 0, 'sess');
  });

  it('returns 200 with updated cart on success', async () => {
    const req = makePatch('/api/cart/update', { key: 'abc', quantity: 5 }, { 'woocommerce-session': 'sess' });
    const res = await cartUpdate(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.cart).toEqual(MOCK_CART);
  });

  it('returns 500 when CartService throws', async () => {
    mockUpdateQuantity.mockRejectedValue(new Error('timeout'));
    const req = makePatch('/api/cart/update', { key: 'abc', quantity: 1 }, { 'woocommerce-session': 'sess' });
    const res = await cartUpdate(req);
    expect(res.status).toBe(500);
  });
});

// ─── DELETE /api/cart/clear ────────────────────────────────────────────────────

describe('DELETE /api/cart/clear', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmptyCart.mockResolvedValue({ emptyCart: { cart: { ...MOCK_CART, isEmpty: true, contents: { nodes: [] } } } });
  });

  it('returns 401 when woocommerce-session cookie is absent', async () => {
    const req = new NextRequest('http://localhost/api/cart/clear', { method: 'DELETE' });
    const res = await cartClear(req);
    expect(res.status).toBe(401);
  });

  it('returns 200 with empty cart on success', async () => {
    const req = makeDelete('/api/cart/clear', {}, { 'woocommerce-session': 'sess' });
    const res = await cartClear(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.cart.isEmpty).toBe(true);
  });

  it('calls CartService.emptyCart with session token', async () => {
    const req = makeDelete('/api/cart/clear', {}, { 'woocommerce-session': 'sess-abc' });
    await cartClear(req);
    expect(mockEmptyCart).toHaveBeenCalledWith('sess-abc');
  });

  it('returns 500 when CartService throws', async () => {
    mockEmptyCart.mockRejectedValue(new Error('WooCommerce error'));
    const req = makeDelete('/api/cart/clear', {}, { 'woocommerce-session': 'sess' });
    const res = await cartClear(req);
    expect(res.status).toBe(500);
  });
});
