import { describe, expect, it } from 'vitest';
import { getVariationAttributeValue } from './getVariationAttributeValue';

describe('getVariationAttributeValue', () => {
  it('fills the missing CO Rough Service %RH sales names', () => {
    expect(
      getVariationAttributeValue(
        'carbon-monoxide-rough-service-with-optional-bacnet',
        'BA/BBV-COV-H',
        'Configuration',
        ''
      )
    ).toBe('Rough Service CO Sensor with %RH Measurement and Flying Leads');

    expect(
      getVariationAttributeValue(
        'carbon-monoxide-rough-service-with-optional-bacnet',
        'BA/BBV-COV-H-TS',
        'configuration',
        null
      )
    ).toBe('Rough Service CO Sensor with %RH Measurement and Terminal Strip');
  });

  it('preserves values supplied by WooCommerce', () => {
    expect(
      getVariationAttributeValue(
        'carbon-monoxide-rough-service-with-optional-bacnet',
        'BA/BBV-COV-H',
        'Configuration',
        'Source value'
      )
    ).toBe('Source value');
  });

  it('does not infer values for other products or SKUs', () => {
    expect(getVariationAttributeValue('another-product', 'BA/BBV-COV-H', 'Configuration', '')).toBe(
      ''
    );
    expect(
      getVariationAttributeValue(
        'carbon-monoxide-rough-service-with-optional-bacnet',
        'ANOTHER-SKU',
        'Configuration',
        ''
      )
    ).toBe('');
  });
});