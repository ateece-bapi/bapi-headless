// Semiconductor output table data extracted from BAPI datasheets
// Each entry format TBD based on PDF content

export type SemiconductorData = [number, number, number, number][]; // [°F, °C, μA, V] or similar

export const ad592Standard: SemiconductorData = [
  // Data to be populated from Semiconductor_AD592.pdf
];

export const ad59210K: SemiconductorData = [
  // Data to be populated from Semiconductor_AD592_10K.pdf
];
