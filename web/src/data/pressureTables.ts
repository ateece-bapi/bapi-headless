// Pressure Transmitter output table data
// Each table: [pressure, 0-5VDC, 0-10VDC, mA]

export type PressureData = [number, number, number, number][];

// Water Column ranges (inches W.C.)
export const pressure_0_01_WC: PressureData = [];
export const pressure_0_025_WC: PressureData = [];
export const pressure_0_05_WC: PressureData = [];
export const pressure_0_1_WC: PressureData = [];
export const pressure_0_25_WC: PressureData = [];
export const pressure_0_5_WC: PressureData = [];
export const pressure_0_10_WC: PressureData = [];
export const pressure_0_25_WC_2: PressureData = [];
export const pressure_0_50_WC: PressureData = [];

// Mercury ranges (inches Hg)
export const pressure_0_1_Hg: PressureData = [];
export const pressure_0_25_Hg: PressureData = [];
export const pressure_0_5_Hg: PressureData = [];
export const pressure_0_10_Hg: PressureData = [];
export const pressure_0_30_Hg: PressureData = [];

// PSI ranges
export const pressure_0_01_PSI: PressureData = [];
export const pressure_0_1_PSI: PressureData = [];
export const pressure_0_5_PSI: PressureData = [];
export const pressure_0_10_PSI: PressureData = [];
export const pressure_0_15_PSI: PressureData = [];
export const pressure_0_30_PSI: PressureData = [];
export const pressure_0_100_PSI: PressureData = [];
export const pressure_0_300_PSI: PressureData = [];

export type PressureRangeType = 
  | '0-0.1-WC' | '0-0.25-WC' | '0-0.5-WC' | '0-1.0-WC' | '0-2.5-WC' | '0-5.0-WC' 
  | '0-10-WC' | '0-25-WC' | '0-50-WC'
  | '0-1.0-Hg' | '0-2.5-Hg' | '0-5.0-Hg' | '0-10-Hg' | '0-30-Hg'
  | '0-0.1-PSI' | '0-1.0-PSI' | '0-5-PSI' | '0-10-PSI' | '0-15-PSI' 
  | '0-30-PSI' | '0-100-PSI' | '0-300-PSI';

export const pressureRanges: { id: PressureRangeType; label: string; unit: string; data: PressureData }[] = [
  { id: '0-0.1-WC', label: '0-0.1" W.C.', unit: '" W.C.', data: pressure_0_01_WC },
  { id: '0-0.25-WC', label: '0-0.25" W.C.', unit: '" W.C.', data: pressure_0_025_WC },
  { id: '0-0.5-WC', label: '0-0.5" W.C.', unit: '" W.C.', data: pressure_0_05_WC },
  { id: '0-1.0-WC', label: '0-1.0" W.C.', unit: '" W.C.', data: pressure_0_1_WC },
  { id: '0-2.5-WC', label: '0-2.5" W.C.', unit: '" W.C.', data: pressure_0_25_WC },
  { id: '0-5.0-WC', label: '0-5.0" W.C.', unit: '" W.C.', data: pressure_0_5_WC },
  { id: '0-10-WC', label: '0-10" W.C.', unit: '" W.C.', data: pressure_0_10_WC },
  { id: '0-25-WC', label: '0-25" W.C.', unit: '" W.C.', data: pressure_0_25_WC_2 },
  { id: '0-50-WC', label: '0-50" W.C.', unit: '" W.C.', data: pressure_0_50_WC },
  { id: '0-1.0-Hg', label: '0-1.0" Hg', unit: '" Hg', data: pressure_0_1_Hg },
  { id: '0-2.5-Hg', label: '0-2.5" Hg', unit: '" Hg', data: pressure_0_25_Hg },
  { id: '0-5.0-Hg', label: '0-5.0" Hg', unit: '" Hg', data: pressure_0_5_Hg },
  { id: '0-10-Hg', label: '0-10" Hg', unit: '" Hg', data: pressure_0_10_Hg },
  { id: '0-30-Hg', label: '0-30" Hg', unit: '" Hg', data: pressure_0_30_Hg },
  { id: '0-0.1-PSI', label: '0-0.1 PSI', unit: ' PSI', data: pressure_0_01_PSI },
  { id: '0-1.0-PSI', label: '0-1.0 PSI', unit: ' PSI', data: pressure_0_1_PSI },
  { id: '0-5-PSI', label: '0-5 PSI', unit: ' PSI', data: pressure_0_5_PSI },
  { id: '0-10-PSI', label: '0-10 PSI', unit: ' PSI', data: pressure_0_10_PSI },
  { id: '0-15-PSI', label: '0-15 PSI', unit: ' PSI', data: pressure_0_15_PSI },
  { id: '0-30-PSI', label: '0-30 PSI', unit: ' PSI', data: pressure_0_30_PSI },
  { id: '0-100-PSI', label: '0-100 PSI', unit: ' PSI', data: pressure_0_100_PSI },
  { id: '0-300-PSI', label: '0-300 PSI', unit: ' PSI', data: pressure_0_300_PSI },
];
