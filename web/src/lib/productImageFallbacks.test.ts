import { describe, expect, it } from 'vitest';
import { getProductImage } from './productImageFallbacks';

describe('getProductImage', () => {
  it('returns the CO duct image when WordPress has no featured image', () => {
    expect(getProductImage('co-duct-and-rough-service-carbon-monoxide-sensor', null)).toEqual({
      sourceUrl: new URL(
        '/wp-content/uploads/CO-Duct-Rough-Main.png',
        process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL
      ).toString(),
      altText: 'CO duct and rough service carbon monoxide sensor',
    });
  });

  it('prefers the WordPress featured image when one is available', () => {
    expect(
      getProductImage('co-duct-and-rough-service-carbon-monoxide-sensor', {
        sourceUrl: 'https://example.com/cms-image.png',
        altText: 'CMS image',
      })
    ).toEqual({
      sourceUrl: 'https://example.com/cms-image.png',
      altText: 'CMS image',
    });
  });

  it('does not add a fallback for other products', () => {
    expect(getProductImage('another-product', null)).toBeNull();
  });

  it('does not use a fallback when the WordPress endpoint is unavailable', () => {
    const wordpressEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
    delete process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

    try {
      expect(getProductImage('co-duct-and-rough-service-carbon-monoxide-sensor', null)).toBeNull();
    } finally {
      process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = wordpressEndpoint;
    }
  });
});
