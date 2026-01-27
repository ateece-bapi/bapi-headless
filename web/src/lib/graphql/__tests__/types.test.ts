import { describe, it, expect } from 'vitest';
import {
  isSimpleProduct,
  isVariableProduct,
  isExternalProduct,
  isGroupProduct,
  getProductPrice,
  getProductStockStatus,
  isProductOnSale,
  type SimpleProduct,
  type VariableProduct,
} from '../types';
import { StockStatusEnum } from '../generated';

describe('GraphQL Type Utilities', () => {
  describe('Type Guards', () => {
    describe('isSimpleProduct', () => {
      it('returns true for SimpleProduct', () => {
        const product = {
          __typename: 'SimpleProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isSimpleProduct(product)).toBe(true);
      });

      it('returns false for VariableProduct', () => {
        const product = {
          __typename: 'VariableProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isSimpleProduct(product)).toBe(false);
      });

      it('returns false for null', () => {
        expect(isSimpleProduct(null)).toBe(false);
      });

      it('returns false for undefined', () => {
        expect(isSimpleProduct(undefined)).toBe(false);
      });
    });

    describe('isVariableProduct', () => {
      it('returns true for VariableProduct', () => {
        const product = {
          __typename: 'VariableProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isVariableProduct(product)).toBe(true);
      });

      it('returns false for SimpleProduct', () => {
        const product = {
          __typename: 'SimpleProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isVariableProduct(product)).toBe(false);
      });

      it('returns false for null', () => {
        expect(isVariableProduct(null)).toBe(false);
      });

      it('returns false for undefined', () => {
        expect(isVariableProduct(undefined)).toBe(false);
      });
    });

    describe('isExternalProduct', () => {
      it('returns true for ExternalProduct', () => {
        const product = {
          __typename: 'ExternalProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isExternalProduct(product)).toBe(true);
      });

      it('returns false for SimpleProduct', () => {
        const product = {
          __typename: 'SimpleProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isExternalProduct(product)).toBe(false);
      });

      it('returns false for null', () => {
        expect(isExternalProduct(null)).toBe(false);
      });
    });

    describe('isGroupProduct', () => {
      it('returns true for GroupProduct', () => {
        const product = {
          __typename: 'GroupProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isGroupProduct(product)).toBe(true);
      });

      it('returns false for SimpleProduct', () => {
        const product = {
          __typename: 'SimpleProduct' as const,
          id: '1',
          databaseId: 1,
          name: 'Test Product',
        };
        expect(isGroupProduct(product)).toBe(false);
      });

      it('returns false for null', () => {
        expect(isGroupProduct(null)).toBe(false);
      });
    });
  });

  describe('getProductPrice', () => {
    it('extracts price from SimpleProduct', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        price: '$19.99',
      };
      expect(getProductPrice(product)).toBe('$19.99');
    });

    it('extracts formatted price with commas', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        price: '$1,234.56',
      };
      expect(getProductPrice(product)).toBe('$1,234.56');
    });

    it('extracts price range for VariableProduct', () => {
      const product = {
        __typename: 'VariableProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        price: '$10.00 - $25.00',
      };
      expect(getProductPrice(product)).toBe('$10.00 - $25.00');
    });

    it('returns null for product without price', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
      };
      expect(getProductPrice(product as any)).toBe(null);
    });

    it('returns null for null product', () => {
      expect(getProductPrice(null)).toBe(null);
    });

    it('returns null for undefined product', () => {
      expect(getProductPrice(undefined)).toBe(null);
    });

    it('returns null for empty price string', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        price: '',
      };
      expect(getProductPrice(product)).toBe(null);
    });
  });

  describe('getProductStockStatus', () => {
    it('extracts IN_STOCK status', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        stockStatus: StockStatusEnum.InStock,
      };
      expect(getProductStockStatus(product)).toBe('IN_STOCK');
    });

    it('extracts OUT_OF_STOCK status', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        stockStatus: StockStatusEnum.OutOfStock,
      };
      expect(getProductStockStatus(product)).toBe('OUT_OF_STOCK');
    });

    it('extracts ON_BACKORDER status', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        stockStatus: StockStatusEnum.OnBackorder,
      };
      expect(getProductStockStatus(product)).toBe('ON_BACKORDER');
    });

    it('returns null for product without stockStatus', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
      };
      expect(getProductStockStatus(product as any)).toBe(null);
    });

    it('returns null for null product', () => {
      expect(getProductStockStatus(null)).toBe(null);
    });

    it('returns null for undefined product', () => {
      expect(getProductStockStatus(undefined)).toBe(null);
    });

    it('returns null for empty stockStatus string', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        stockStatus: '' as any,
      };
      expect(getProductStockStatus(product)).toBe(null);
    });
  });

  describe('isProductOnSale', () => {
    it('returns true when product is on sale', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        onSale: true,
      };
      expect(isProductOnSale(product)).toBe(true);
    });

    it('returns false when product is not on sale', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
        onSale: false,
      };
      expect(isProductOnSale(product)).toBe(false);
    });

    it('returns false for product without onSale field', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        databaseId: 1,
        name: 'Test Product',
      };
      expect(isProductOnSale(product as any)).toBe(false);
    });

    it('returns false for null product', () => {
      expect(isProductOnSale(null)).toBe(false);
    });

    it('returns false for undefined product', () => {
      expect(isProductOnSale(undefined)).toBe(false);
    });

    it('handles onSale as null', () => {
      const product = {
        __typename: 'SimpleProduct' as const,
        id: '1',
        name: 'Test Product',
        onSale: null,
      };
      expect(isProductOnSale(product as any)).toBe(false);
    });
  });
});
