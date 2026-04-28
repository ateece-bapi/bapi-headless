// Pressure Transmitter output table data
// Format matches legacy site: [W.C., Pascals, 4-20mA, 0-5V, 0-10V]
// 1 inch W.C. = 249.089 Pascals

export type PressureData = [number, number, number, number, number][];

// Helper constants and functions for computed pressure values
const PASCALS_PER_INCH_WC = 249.089;

const roundTo2 = (value: number): number => Math.round(value * 100) / 100;
const roundTo3 = (value: number): number => Math.round(value * 1000) / 1000;

/**
 * Create a pressure table row with computed output values
 * @param wc - Water column pressure in inches
 * @param fullScaleWc - Full scale range in inches W.C.
 * @param minWc - Minimum range for bidirectional sensors (default 0)
 * @returns Tuple of [W.C., Pascals, 4-20mA, 0-5V, 0-10V]
 */
const createPressureRow = (
  wc: number,
  fullScaleWc: number,
  minWc: number = 0,
): [number, number, number, number, number] => {
  const range = fullScaleWc - minWc;
  const ratio = (wc - minWc) / range;

  return [
    roundTo3(wc),
    roundTo2(wc * PASCALS_PER_INCH_WC),
    roundTo2(4 + ratio * 16), // 4-20mA
    roundTo2(ratio * 5),       // 0-5V
    roundTo2(ratio * 10),      // 0-10V
  ];
};

/**
 * Create a complete pressure table for a given range
 * @param fullScaleWc - Full scale range in inches W.C.
 * @param wcValues - Array of W.C. sample points
 * @param minWc - Minimum range for bidirectional sensors (default 0)
 */
const createPressureTable = (
  fullScaleWc: number,
  wcValues: number[],
  minWc: number = 0,
): PressureData => wcValues.map((wc) => createPressureRow(wc, fullScaleWc, minWc));

// Unidirectional Water Column ranges (0 to X" W.C.)
export const pressure_0_01_WC: PressureData = createPressureTable(0.1, [
  0.0, 0.002, 0.008, 0.012, 0.016, 0.02, 0.024, 0.028, 0.032, 0.036,
  0.04, 0.044, 0.048, 0.052, 0.056, 0.06, 0.064, 0.068, 0.072, 0.076,
  0.08, 0.084, 0.086, 0.088, 0.092, 0.096, 0.1,
]);

export const pressure_0_025_WC: PressureData = createPressureTable(0.25, [
  0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09,
  0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19,
  0.2, 0.21, 0.215, 0.22, 0.23, 0.24, 0.25,
]);

export const pressure_0_05_WC: PressureData = createPressureTable(0.5, [
  0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18,
  0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38,
  0.4, 0.42, 0.43, 0.44, 0.46, 0.48, 0.5,
]);

export const pressure_0_075_WC: PressureData = createPressureTable(0.75, [
  0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.27,
  0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.57,
  0.6, 0.63, 0.645, 0.66, 0.69, 0.72, 0.75,
]);

export const pressure_0_1_WC: PressureData = createPressureTable(1.0, [
  0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36,
  0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.76,
  0.8, 0.84, 0.86, 0.88, 0.92, 0.96, 1.0,
]);

export const pressure_0_2_WC: PressureData = createPressureTable(2.0, [
  0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72,
  0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.52,
  1.6, 1.68, 1.72, 1.76, 1.84, 1.92, 2.0,
]);

export const pressure_0_25_WC: PressureData = createPressureTable(2.5, [
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
  1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9,
  2.0, 2.1, 2.15, 2.2, 2.3, 2.4, 2.5,
]);

export const pressure_0_3_WC: PressureData = createPressureTable(3.0, [
  0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 0.96, 1.08,
  1.2, 1.32, 1.44, 1.56, 1.68, 1.8, 1.92, 2.04, 2.16, 2.28,
  2.4, 2.52, 2.58, 2.64, 2.76, 2.88, 3.0,
]);

export const pressure_0_5_WC: PressureData = createPressureTable(5.0, [
  0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8,
  2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8,
  4.0, 4.2, 4.3, 4.4, 4.6, 4.8, 5.0,
]);

export const pressure_0_10_WC: PressureData = createPressureTable(10.0, [
  0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6,
  4.0, 4.4, 4.8, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2, 7.6,
  8.0, 8.4, 8.6, 8.8, 9.2, 9.6, 10.0,
]);

export const pressure_0_15_WC: PressureData = createPressureTable(15.0, [
  0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8, 5.4,
  6.0, 6.6, 7.2, 7.8, 8.4, 9.0, 9.6, 10.2, 10.8, 11.4,
  12.0, 12.6, 12.9, 13.2, 13.8, 14.4, 15.0,
]);

export const pressure_0_25inch_WC: PressureData = createPressureTable(25.0, [
  0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0,
  10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0,
  20.0, 21.0, 21.5, 22.0, 23.0, 24.0, 25.0,
]);

export const pressure_0_30_WC: PressureData = createPressureTable(30.0, [
  0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8,
  12.0, 13.2, 14.4, 15.6, 16.8, 18.0, 19.2, 20.4, 21.6, 22.8,
  24.0, 25.2, 25.8, 26.4, 27.6, 28.8, 30.0,
]);

// Bidirectional Water Column ranges (-X to +X" W.C.)
export const pressure_neg01_to_01_WC: PressureData = createPressureTable(0.1, [
  -0.1, -0.092, -0.084, -0.076, -0.068, -0.06, -0.052, -0.044, -0.036, -0.028,
  -0.02, -0.012, -0.004, 0, 0.004, 0.012, 0.02, 0.028, 0.036, 0.044,
  0.052, 0.06, 0.068, 0.076, 0.084, 0.092, 0.1,
], -0.1);

export const pressure_neg025_to_025_WC: PressureData = createPressureTable(0.25, [
  -0.25, -0.23, -0.21, -0.19, -0.17, -0.15, -0.13, -0.11, -0.09, -0.07,
  -0.05, -0.03, -0.01, 0, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11,
  0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25,
], -0.25);

export const pressure_neg05_to_05_WC: PressureData = createPressureTable(0.5, [
  -0.5, -0.46, -0.42, -0.38, -0.34, -0.3, -0.26, -0.22, -0.18, -0.14,
  -0.1, -0.06, -0.02, 0, 0.02, 0.06, 0.1, 0.14, 0.18, 0.22,
  0.26, 0.3, 0.34, 0.38, 0.42, 0.46, 0.5,
], -0.5);

export const pressure_neg075_to_075_WC: PressureData = createPressureTable(0.75, [
  -0.75, -0.69, -0.63, -0.57, -0.51, -0.45, -0.39, -0.33, -0.27, -0.21,
  -0.15, -0.09, -0.03, 0, 0.03, 0.09, 0.15, 0.21, 0.27, 0.33,
  0.39, 0.45, 0.51, 0.57, 0.63, 0.69, 0.75,
], -0.75);

export const pressure_neg1_to_1_WC: PressureData = createPressureTable(1.0, [
  -1.0, -0.92, -0.84, -0.76, -0.68, -0.6, -0.52, -0.44, -0.36, -0.28,
  -0.2, -0.12, -0.04, 0, 0.04, 0.12, 0.2, 0.28, 0.36, 0.44,
  0.52, 0.6, 0.68, 0.76, 0.84, 0.92, 1.0,
], -1.0);

export const pressure_neg2_to_2_WC: PressureData = createPressureTable(2.0, [
  -2.0, -1.84, -1.68, -1.52, -1.36, -1.2, -1.04, -0.88, -0.72, -0.56,
  -0.4, -0.24, -0.08, 0, 0.08, 0.24, 0.4, 0.56, 0.72, 0.88,
  1.04, 1.2, 1.36, 1.52, 1.68, 1.84, 2.0,
], -2.0);

export const pressure_neg25_to_25_WC: PressureData = createPressureTable(2.5, [
  -2.5, -2.3, -2.1, -1.9, -1.7, -1.5, -1.3, -1.1, -0.9, -0.7,
  -0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.1,
  1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5,
], -2.5);

export const pressure_neg3_to_3_WC: PressureData = createPressureTable(3.0, [
  -3.0, -2.76, -2.52, -2.28, -2.04, -1.8, -1.56, -1.32, -1.08, -0.84,
  -0.6, -0.36, -0.12, 0, 0.12, 0.36, 0.6, 0.84, 1.08, 1.32,
  1.56, 1.8, 2.04, 2.28, 2.52, 2.76, 3.0,
], -3.0);

export const pressure_neg5_to_5_WC: PressureData = createPressureTable(5.0, [
  -5.0, -4.6, -4.2, -3.8, -3.4, -3.0, -2.6, -2.2, -1.8, -1.4,
  -1.0, -0.6, -0.2, 0, 0.2, 0.6, 1.0, 1.4, 1.8, 2.2,
  2.6, 3.0, 3.4, 3.8, 4.2, 4.6, 5.0,
], -5.0);

// Pressure range metadata for UI tabs and descriptions
export interface PressureRange {
  id: string;
  label: string;
  unit: 'WC';
  data: PressureData;
  isBidirectional: boolean;
}

export const pressureRanges: PressureRange[] = [
  // Unidirectional ranges
  { id: '0-0.10', label: '0 to 0.10"', unit: 'WC', data: pressure_0_01_WC, isBidirectional: false },
  { id: '0-0.25', label: '0 to 0.25"', unit: 'WC', data: pressure_0_025_WC, isBidirectional: false },
  { id: '0-0.50', label: '0 to 0.50"', unit: 'WC', data: pressure_0_05_WC, isBidirectional: false },
  { id: '0-0.75', label: '0 to 0.75"', unit: 'WC', data: pressure_0_075_WC, isBidirectional: false },
  { id: '0-1.00', label: '0 to 1.00"', unit: 'WC', data: pressure_0_1_WC, isBidirectional: false },
  { id: '0-2.00', label: '0 to 2.00"', unit: 'WC', data: pressure_0_2_WC, isBidirectional: false },
  { id: '0-2.50', label: '0 to 2.50"', unit: 'WC', data: pressure_0_25_WC, isBidirectional: false },
  { id: '0-3.00', label: '0 to 3.00"', unit: 'WC', data: pressure_0_3_WC, isBidirectional: false },
  { id: '0-5.00', label: '0 to 5.00"', unit: 'WC', data: pressure_0_5_WC, isBidirectional: false },
  { id: '0-10.00', label: '0 to 10.00"', unit: 'WC', data: pressure_0_10_WC, isBidirectional: false },
  { id: '0-15.00', label: '0 to 15.00"', unit: 'WC', data: pressure_0_15_WC, isBidirectional: false },
  { id: '0-25.00', label: '0 to 25.00"', unit: 'WC', data: pressure_0_25inch_WC, isBidirectional: false },
  { id: '0-30.00', label: '0 to 30.00"', unit: 'WC', data: pressure_0_30_WC, isBidirectional: false },
  
  // Bidirectional ranges
  { id: '-0.10-0.10', label: '-0.10 to 0.10"', unit: 'WC', data: pressure_neg01_to_01_WC, isBidirectional: true },
  { id: '-0.25-0.25', label: '-0.25 to 0.25"', unit: 'WC', data: pressure_neg025_to_025_WC, isBidirectional: true },
  { id: '-0.50-0.50', label: '-0.50 to 0.50"', unit: 'WC', data: pressure_neg05_to_05_WC, isBidirectional: true },
  { id: '-0.75-0.75', label: '-0.75 to 0.75"', unit: 'WC', data: pressure_neg075_to_075_WC, isBidirectional: true },
  { id: '-1.00-1.00', label: '-1.00 to 1.00"', unit: 'WC', data: pressure_neg1_to_1_WC, isBidirectional: true },
  { id: '-2.00-2.00', label: '-2.00 to 2.00"', unit: 'WC', data: pressure_neg2_to_2_WC, isBidirectional: true },
  { id: '-2.50-2.50', label: '-2.50 to 2.50"', unit: 'WC', data: pressure_neg25_to_25_WC, isBidirectional: true },
  { id: '-3.00-3.00', label: '-3.00 to 3.00"', unit: 'WC', data: pressure_neg3_to_3_WC, isBidirectional: true },
  { id: '-5.00-5.00', label: '-5.00 to 5.00"', unit: 'WC', data: pressure_neg5_to_5_WC, isBidirectional: true },
];
