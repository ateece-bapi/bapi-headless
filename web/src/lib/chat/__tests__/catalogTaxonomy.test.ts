import { describe, expect, it } from 'vitest';
import {
  findUnavailableCatalogProducts,
  formatUnavailableCatalogProducts,
} from '../catalogTaxonomy';

describe('chat catalog taxonomy', () => {
  it.each(['NO2 sensor', 'NO₂ transmitter', 'nitrogen dioxide detector'])(
    'allows available product query %s to use live catalog search',
    (query) => {
      expect(findUnavailableCatalogProducts(query)).toEqual([]);
    }
  );

  it.each(['current sensor', 'electrical current transducers', 'current switch'])(
    'classifies %s as unavailable',
    (query) => {
      expect(findUnavailableCatalogProducts(query).map((entry) => entry.id)).toEqual([
        'current-sensors',
      ]);
    }
  );

  it('does not confuse CO2 or generic current wording with unavailable products', () => {
    expect(findUnavailableCatalogProducts('CO2 sensors and current product options')).toEqual([]);
  });

  it('formats an authoritative catalog response for an unavailable family', () => {
    const matches = findUnavailableCatalogProducts('Do you sell current sensors?');

    expect(formatUnavailableCatalogProducts(matches)).toContain(
      'BAPI does not currently list electrical current sensors in its public catalog.'
    );
  });
});
