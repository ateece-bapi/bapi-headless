import { describe, it, expect } from 'vitest';
import { canUseEasyOrderForm, EASY_ORDER_FORM_CUSTOMER_GROUPS } from '../easyOrderForm';

describe('canUseEasyOrderForm', () => {
  it('returns true when a user has an allowed customer group', () => {
    expect(canUseEasyOrderForm(['lennox'])).toBe(true);
  });

  it('returns true when the allowed group is among several groups', () => {
    expect(canUseEasyOrderForm(['end-user', 'lennox'])).toBe(true);
  });

  it('returns false when the user has no matching group', () => {
    expect(canUseEasyOrderForm(['end-user'])).toBe(false);
  });

  it('returns false for undefined customer groups', () => {
    expect(canUseEasyOrderForm(undefined)).toBe(false);
  });

  it('returns false for null customer groups', () => {
    expect(canUseEasyOrderForm(null)).toBe(false);
  });

  it('returns false for an empty array', () => {
    expect(canUseEasyOrderForm([])).toBe(false);
  });

  it('exposes lennox as an allowed group', () => {
    expect(EASY_ORDER_FORM_CUSTOMER_GROUPS).toContain('lennox');
  });
});
