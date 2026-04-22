/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import {
  extractCustomerGroupFromTitle,
  getProductCustomerGroups,
  canUserViewProduct,
  filterProductsByCustomerGroup,
  getProductCountsByGroup,
  type ProductWithCustomerGroup,
} from './filterProductsByCustomerGroup';

describe('extractCustomerGroupFromTitle', () => {
  it('extracts customer group from (ALC) prefix', () => {
    expect(extractCustomerGroupFromTitle('(ALC) BAPI-Stat 4 Room Temperature Transmitter')).toBe('alc');
  });

  it('extracts customer group from (ACS) prefix', () => {
    expect(extractCustomerGroupFromTitle('(ACS) Duct Averaging Temperature Sensor')).toBe('acs');
  });

  it('extracts customer group from (EMC) prefix', () => {
    expect(extractCustomerGroupFromTitle('(EMC) Test Product')).toBe('emc');
  });

  it('extracts customer group from (CCG) prefix', () => {
    expect(extractCustomerGroupFromTitle('(CCG) Test Product')).toBe('ccg');
  });

  it('extracts customer group from CCG/ prefix (slash pattern)', () => {
    expect(extractCustomerGroupFromTitle('CCG/H205-B4X-Z-CG-WMW')).toBe('ccg');
  });

  it('extracts customer group from ALC/ prefix (slash pattern)', () => {
    expect(extractCustomerGroupFromTitle('ALC/Product-Name')).toBe('alc');
  });

  it('extracts customer group from ACS/ prefix (slash pattern)', () => {
    expect(extractCustomerGroupFromTitle('ACS/Product-Name')).toBe('acs');
  });

  it('extracts customer group from EMC/ prefix (slash pattern)', () => {
    expect(extractCustomerGroupFromTitle('EMC/Product-Name')).toBe('emc');
  });

  it('extracts customer group from CCGA/ prefix (slash pattern - 4 letters)', () => {
    expect(extractCustomerGroupFromTitle('CCGA/Product-Name')).toBe('ccga');
  });

  it('extracts customer group from (CCGA) prefix (parentheses - 4 letters)', () => {
    expect(extractCustomerGroupFromTitle('(CCGA) Test Product')).toBe('ccga');
  });

  it('returns null for standard product without prefix', () => {
    expect(extractCustomerGroupFromTitle('BA/10K-3 Temperature Sensor')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractCustomerGroupFromTitle('')).toBeNull();
  });

  it('returns null for product with ( ) in middle of name', () => {
    expect(extractCustomerGroupFromTitle('Temperature Sensor (Digital)')).toBeNull();
  });

  it('normalizes to lowercase', () => {
    expect(extractCustomerGroupFromTitle('(ALC) Test')).toBe('alc');
    expect(extractCustomerGroupFromTitle('(alc) Test')).toBe('alc');
  });
});

describe('getProductCustomerGroups', () => {
  it('returns customer group from customerGroup1 field when available', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) Test Product',
      customerGroup1: 'alc',
    };

    expect(getProductCustomerGroups(product)).toEqual(['alc']);
  });

  it('combines multiple customer group fields', () => {
    const product: ProductWithCustomerGroup = {
      name: 'Test Product',
      customerGroup1: 'alc',
      customerGroup2: 'acs',
    };

    expect(getProductCustomerGroups(product)).toEqual(['alc', 'acs']);
  });

  it('falls back to title parsing when GraphQL fields empty', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) Test Product',
      customerGroup1: null,
      customerGroup2: null,
      customerGroup3: null,
    };

    expect(getProductCustomerGroups(product)).toEqual(['alc']);
  });

  it('returns empty array for standard product', () => {
    const product: ProductWithCustomerGroup = {
      name: 'BA/10K-3 Temperature Sensor',
      customerGroup1: null,
      customerGroup2: null,
      customerGroup3: null,
    };

    expect(getProductCustomerGroups(product)).toEqual([]);
  });

  it('deduplicates customer groups', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) Test',
      customerGroup1: 'alc',
      customerGroup2: 'alc',
    };

    expect(getProductCustomerGroups(product)).toEqual(['alc']);
  });

  it('normalizes to lowercase', () => {
    const product: ProductWithCustomerGroup = {
      name: 'Test',
      customerGroup1: 'ALC',
      customerGroup2: 'ACS',
    };

    expect(getProductCustomerGroups(product)).toEqual(['alc', 'acs']);
  });
});

describe('canUserViewProduct', () => {
  it('allows anyone to view standard products', () => {
    const product: ProductWithCustomerGroup = {
      name: 'BA/10K-3 Temperature Sensor',
      customerGroups: null,
    };

    expect(canUserViewProduct(product, ['end user'])).toBe(true);
    expect(canUserViewProduct(product, ['alc'])).toBe(true);
    expect(canUserViewProduct(product, ['END USER'])).toBe(true);
  });

  it('blocks guest users from restricted products', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) BAPI-Stat 4',
      customerGroups: null,
    };

    expect(canUserViewProduct(product, ['end user'])).toBe(false);
    expect(canUserViewProduct(product, ['END USER'])).toBe(false);
  });

  it('allows matching customer group users to view restricted products', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) BAPI-Stat 4',
      customerGroups: null,
    };

    expect(canUserViewProduct(product, ['alc'])).toBe(true);
  });

  it('blocks non-matching customer group users', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) BAPI-Stat 4',
      customerGroups: null,
    };

    expect(canUserViewProduct(product, ['acs'])).toBe(false);
    expect(canUserViewProduct(product, ['emc'])).toBe(false);
  });

  it('handles case-insensitive matching', () => {
    const product: ProductWithCustomerGroup = {
      name: '(ALC) Test',
      customerGroups: null,
    };

    expect(canUserViewProduct(product, ['ALC'])).toBe(true);
    expect(canUserViewProduct(product, ['alc'])).toBe(true);
    expect(canUserViewProduct(product, ['Alc'])).toBe(true);
  });
});

describe('filterProductsByCustomerGroup', () => {
  const products: ProductWithCustomerGroup[] = [
    { name: 'BA/10K-3 Temperature Sensor', customerGroup1: null, customerGroup2: null, customerGroup3: null },
    { name: '(ALC) BAPI-Stat 4', customerGroup1: null, customerGroup2: null, customerGroup3: null },
    { name: '(ACS) Duct Sensor', customerGroup1: null, customerGroup2: null, customerGroup3: null },
    { name: '(EMC) Test Product', customerGroup1: null, customerGroup2: null, customerGroup3: null },
    { name: 'BA-H2 Humidity Sensor', customerGroup1: null, customerGroup2: null, customerGroup3: null },
  ];

  it('guest users see only standard products', () => {
    const filtered = filterProductsByCustomerGroup(products, ['end user']);

    expect(filtered).toHaveLength(2);
    expect(filtered.map((p) => p.name)).toEqual([
      'BA/10K-3 Temperature Sensor',
      'BA-H2 Humidity Sensor',
    ]);
  });

  it('ALC users see standard + ALC products', () => {
    const filtered = filterProductsByCustomerGroup(products, ['alc']);

    expect(filtered).toHaveLength(3);
    expect(filtered.map((p) => p.name)).toEqual([
      'BA/10K-3 Temperature Sensor',
      '(ALC) BAPI-Stat 4',
      'BA-H2 Humidity Sensor',
    ]);
  });

  it('ACS users see standard + ACS products', () => {
    const filtered = filterProductsByCustomerGroup(products, ['acs']);

    expect(filtered).toHaveLength(3);
    expect(filtered.map((p) => p.name)).toEqual([
      'BA/10K-3 Temperature Sensor',
      '(ACS) Duct Sensor',
      'BA-H2 Humidity Sensor',
    ]);
  });

  it('preserves product order', () => {
    const filtered = filterProductsByCustomerGroup(products, ['alc']);

    expect(filtered[0].name).toBe('BA/10K-3 Temperature Sensor');
    expect(filtered[1].name).toBe('(ALC) BAPI-Stat 4');
    expect(filtered[2].name).toBe('BA-H2 Humidity Sensor');
  });

  it('returns empty array when no products', () => {
    const filtered = filterProductsByCustomerGroup([], ['alc']);

    expect(filtered).toEqual([]);
  });
});

describe('getProductCountsByGroup', () => {
  const products: ProductWithCustomerGroup[] = [
    { name: 'Standard Product 1', customerGroups: null },
    { name: 'Standard Product 2', customerGroups: null },
    { name: '(ALC) Product 1', customerGroups: null },
    { name: '(ALC) Product 2', customerGroups: null },
    { name: '(ALC) Product 3', customerGroups: null },
    { name: '(ACS) Product 1', customerGroups: null },
    { name: '(EMC) Product 1', customerGroups: null },
    { name: '(CCG) Product 1', customerGroups: null },
  ];

  it('counts products by customer group', () => {
    const counts = getProductCountsByGroup(products);

    expect(counts).toEqual({
      public: 2,
      alc: 3,
      acs: 1,
      emc: 1,
      ccg: 1,
      ccga: 0,
    });
  });

  it('handles empty product list', () => {
    const counts = getProductCountsByGroup([]);

    expect(counts).toEqual({
      public: 0,
      alc: 0,
      acs: 0,
      emc: 0,
      ccg: 0,
      ccga: 0,
    });
  });
});
