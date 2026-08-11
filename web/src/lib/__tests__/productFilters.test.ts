import { describe, expect, it } from 'vitest';
import { formatProductAttributeLabel } from '../productFilters';

describe('formatProductAttributeLabel', () => {
  it.each([
    ['thermistor-or-rtd-temperature-output', 'Thermistor or RTD Temperature Output'],
    ['bapi-stat-quantum', 'BAPI Stat Quantum'],
    ['4-20ma-0-5v-temperature-output', '4-20mA 0-5V Temperature Output'],
    ['display', 'Display'],
    ['HVAC', 'HVAC'],
  ])('formats %s as %s', (value, expected) => {
    expect(formatProductAttributeLabel(value)).toBe(expected);
  });
});