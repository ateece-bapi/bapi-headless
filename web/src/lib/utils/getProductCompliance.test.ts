import { describe, it, expect } from 'vitest';
import { shouldHideComplianceBadge } from './getProductCompliance';

describe('shouldHideComplianceBadge', () => {
  it('returns false for unknown or missing slugs with no categories', () => {
    expect(shouldHideComplianceBadge('some-other-product')).toBe(false);
    expect(shouldHideComplianceBadge(null)).toBe(false);
    expect(shouldHideComplianceBadge(undefined)).toBe(false);
  });

  it('returns true for products confirmed to lack CE/RoHS certification', () => {
    expect(shouldHideComplianceBadge('thermowell-2')).toBe(true);
    expect(shouldHideComplianceBadge('DIFFERENTIAL-PRESSURE-SWITCH')).toBe(true);
  });

  it('returns true when the product belongs to a fully non-certified category', () => {
    expect(shouldHideComplianceBadge('some-accessory', ['wireless-accessories'])).toBe(true);
    expect(shouldHideComplianceBadge('some-eta-product', ['eta-line'])).toBe(true);
  });

  it('returns false when neither the slug nor categories match', () => {
    expect(shouldHideComplianceBadge('some-other-product', ['temperature-sensors'])).toBe(false);
  });

  it('returns false for CE-certified accessories even when the category is otherwise hidden', () => {
    expect(
      shouldHideComplianceBadge('water-leak-detector-with-a-rope-sensor', ['wireless-accessories'])
    ).toBe(false);
    expect(
      shouldHideComplianceBadge('DOOR-MONITOR-ALARM-DMA', ['wireless-accessories'])
    ).toBe(false);
  });
});
