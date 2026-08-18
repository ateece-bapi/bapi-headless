import { describe, expect, it } from 'vitest';
import { BAPI_LOCATIONS, getMapLocations } from '../locations';

describe('BAPI_LOCATIONS', () => {
  it('includes the headquarters and every factory distribution center from the world map', () => {
    expect(
      BAPI_LOCATIONS.filter(({ type }) =>
        ['headquarters', 'manufacturing'].includes(type),
      ).map(({ id }) => id),
    ).toEqual([
      'headquarters-usa',
      'manufacturing-poland',
      'manufacturing-vietnam',
      'manufacturing-uk',
    ]);
  });

  it('shows only the headquarters marker at the Wisconsin location', () => {
    expect(
      getMapLocations()
        .filter(({ coordinates }) => coordinates.join(',') === '-90.8543,43.3297')
        .map(({ id }) => id),
    ).toEqual(['headquarters-usa']);
  });

  it('shows separate North and South India sales markers', () => {
    expect(
      getMapLocations()
        .filter(({ country }) => country === 'India')
        .map(({ id }) => id),
    ).toEqual(['sales-rep-india', 'sales-rep-north-india']);
  });

  it('visually separates facilities that share coordinates with sales markers', () => {
    const mapLocations = getMapLocations();
    const locationsByCoordinates = mapLocations.reduce((locations, location) => {
      const key = location.coordinates.join(',');
      locations.set(key, [...(locations.get(key) ?? []), location]);
      return locations;
    }, new Map<string, typeof BAPI_LOCATIONS>());
    const colocatedFacilities = mapLocations.filter(
      ({ type }) => type === 'headquarters' || type === 'manufacturing',
    ).filter(({ coordinates }) => (locationsByCoordinates.get(coordinates.join(','))?.length ?? 0) > 1);

    for (const facility of colocatedFacilities) {
      expect(facility.markerOffset, `${facility.id} should have a marker offset`).toBeDefined();

      const markerOffsets = locationsByCoordinates
        .get(facility.coordinates.join(','))
        ?.map(({ markerOffset }) => markerOffset?.join(','));

      expect(new Set(markerOffsets).size).toBe(markerOffsets?.length);
    }
  });
});