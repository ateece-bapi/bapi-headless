import { describe, expect, it } from 'vitest';
import {
  thermistor22K,
  thermistor325K,
  thermistor33K,
  thermistor10K2,
  thermistor10K3,
  thermistor10K4,
  thermistor20K,
  thermistor47K,
  thermistor50K,
  thermistor100K,
  type ThermistorData,
} from './thermistorTables';

const correctedTables: Record<
  string,
  { data: ThermistorData; rows: number; nominalOhms: number; resistanceTotal: number }
> = {
  '2.2K': { data: thermistor22K, rows: 114, nominalOhms: 2252, resistanceTotal: 1146245 },
  '3.25K': {
    data: thermistor325K,
    rows: 114,
    nominalOhms: 3245.47,
    resistanceTotal: 610261.54,
  },
  '3.3K': { data: thermistor33K, rows: 114, nominalOhms: 3303, resistanceTotal: 1682167 },
  '10K-2': { data: thermistor10K2, rows: 114, nominalOhms: 10000, resistanceTotal: 5096444 },
  '10K-3': { data: thermistor10K3, rows: 114, nominalOhms: 10000, resistanceTotal: 4089971 },
  '10K-4': {
    data: thermistor10K4,
    rows: 99,
    nominalOhms: 10000,
    resistanceTotal: 2418875.86,
  },
  '20K': { data: thermistor20K, rows: 114, nominalOhms: 20001, resistanceTotal: 11639084 },
  '47K': { data: thermistor47K, rows: 114, nominalOhms: 46998, resistanceTotal: 24238626 },
  '50K': { data: thermistor50K, rows: 114, nominalOhms: 50000, resistanceTotal: 29228635 },
  '100K': {
    data: thermistor100K,
    rows: 114,
    nominalOhms: 100000,
    resistanceTotal: 58484750,
  },
};

describe('thermistor output tables', () => {
  it.each(Object.entries(correctedTables))(
    '%s matches the legacy BAPI output table',
    (_name, { data, rows, nominalOhms, resistanceTotal }) => {
      expect(data).toHaveLength(rows);
      expect(data.every((row, index) => index === 0 || row[0] > data[index - 1][0])).toBe(true);
      expect(data.find(([tempF]) => tempF === 77)?.[2]).toBe(nominalOhms);
      expect(Number(data.reduce((total, row) => total + row[2], 0).toFixed(2))).toBe(
        resistanceTotal
      );
    }
  );
});
