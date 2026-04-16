import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ProductTabsAsync } from '../ProductTabsAsync';

// Mock the GraphQL client
vi.mock('@/lib/graphql', () => ({
  getProductDetailsDeferred: vi.fn(),
}));

// Mock the sanitization function
vi.mock('@/lib/sanitizeDescription', () => ({
  sanitizeDescription: vi.fn((html: string) => html.replace(/<script.*?>.*?<\/script>/gi, '')),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));

describe('ProductTabsAsync', () => {
  it('sanitizes product description before rendering', async () => {
    const { getProductDetailsDeferred } = await import('@/lib/graphql');
    const { sanitizeDescription } = await import('@/lib/sanitizeDescription');

    const maliciousDescription = `
      <p>Safe content</p>
      <script>alert('XSS')</script>
      <p>More safe content</p>
    `;

    (getProductDetailsDeferred as ReturnType<typeof vi.fn>).mockResolvedValue({
      product: {
        description: maliciousDescription,
      },
    });

    const { container } = render(await ProductTabsAsync({ productId: 'test-product-id' }));

    // Verify sanitizeDescription was called with the product description
    expect(sanitizeDescription).toHaveBeenCalledWith(maliciousDescription);

    // Verify the rendered HTML does not contain the script tag
    const renderedHtml = container.innerHTML;
    expect(renderedHtml).not.toContain('<script>');
    expect(renderedHtml).not.toContain("alert('XSS')");
    expect(renderedHtml).toContain('Safe content');
  });

  it('returns null when product has no description', async () => {
    const { getProductDetailsDeferred } = await import('@/lib/graphql');

    (getProductDetailsDeferred as ReturnType<typeof vi.fn>).mockResolvedValue({
      product: {
        description: null,
      },
    });

    const result = await ProductTabsAsync({ productId: 'test-product-id' });

    expect(result).toBeNull();
  });

  it('returns null and logs error when GraphQL fails', async () => {
    const { getProductDetailsDeferred } = await import('@/lib/graphql');
    const logger = await import('@/lib/logger');

    (getProductDetailsDeferred as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('GraphQL error')
    );

    const result = await ProductTabsAsync({ productId: 'test-product-id' });

    expect(result).toBeNull();
    expect(logger.default.error).toHaveBeenCalled();
  });
});
