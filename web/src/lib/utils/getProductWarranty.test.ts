import { describe, it, expect } from 'vitest';
import { getProductWarrantyType } from './getProductWarranty';

describe('getProductWarrantyType', () => {
  it('returns standard for unknown or missing slugs', () => {
    expect(getProductWarrantyType('some-other-product')).toBe('standard');
    expect(getProductWarrantyType(null)).toBe('standard');
    expect(getProductWarrantyType(undefined)).toBe('standard');
  });

  it('returns lifetime for confirmed lifetime-warranty products', () => {
    expect(getProductWarrantyType('surface-temperature-sensor')).toBe('lifetime');
    expect(getProductWarrantyType('SURFACE-TEMPERATURE-SENSOR')).toBe('lifetime');
    expect(getProductWarrantyType('thermowell-2')).toBe('lifetime');
  });

  it('returns two-year for confirmed 2-year-warranty products', () => {
    expect(getProductWarrantyType('refrigerant-leak-detector-and-transmitter')).toBe('two-year');
  });
});
