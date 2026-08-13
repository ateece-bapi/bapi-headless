import { describe, expect, it } from 'vitest';
import { getProductCategorySupplement } from '../productCategorySupplements';

describe('getProductCategorySupplement', () => {
  it('maps the wall plates category to its two legacy room products', () => {
    expect(getProductCategorySupplement('temp-wall-plates')).toEqual({
      sourceCategorySlug: 'temp-room',
      productSlugs: [
        'wall-plate-temperature-sensor-with-optional-override-pushbutton',
        'wall-plate-temperature-sensor-with-rotary-setpoint-2',
      ],
    });
  });

  it('does not supplement categories without legacy assignments', () => {
    expect(getProductCategorySupplement('temp-duct')).toBeUndefined();
  });
});