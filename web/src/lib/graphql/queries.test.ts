import { describe, it, expect } from 'vitest';
import { getProductBySlug } from './queries';

describe('getProductBySlug', () => {
  it('throws a descriptive error when called with an empty slug', async () => {
    await expect(getProductBySlug('' as any)).rejects.toThrow(
      'getProductBySlug called without a valid `slug` (received empty value)'
    );
  });
});
