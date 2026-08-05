import { describe, expect, it } from 'vitest';
import { getMegaMenuItems } from './config';

describe('getMegaMenuItems', () => {
  it('links to the Blü-Test landing page under Test Instruments', () => {
    const bluTestDescription =
      'A suite of test probes for temperature, humidity, dew point, differential pressure, and K-Factor';
    const translate = (key: string) =>
      key === 'products.testInstruments.bluTestDesc' ? bluTestDescription : key;
    const productsMenu = getMegaMenuItems(translate)[0];
    const testInstruments = productsMenu.megaMenu?.columns.find(
      (column) => column.slug === 'test-instruments'
    );

    expect(testInstruments?.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Blü-Test',
          href: '/blu-test',
          description: bluTestDescription,
        }),
      ])
    );
  });
});
