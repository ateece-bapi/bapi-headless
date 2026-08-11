import { describe, expect, it } from 'vitest';
import { getProductImage } from './productImageFallbacks';

describe('getProductImage', () => {
  it('returns the CO duct image when WordPress has no featured image', () => {
    expect(getProductImage('co-duct-and-rough-service-carbon-monoxide-sensor', null)).toEqual({
      sourceUrl:
        'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/CO-Duct-Rough-Main.png',
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
});
