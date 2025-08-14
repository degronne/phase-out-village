type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Year = `19${Digit}${Digit}` | `20${Digit}${Digit}`;

export type DataValue = { value: number; estimate?: boolean };
export type FieldDataValues = {
  productionOil: DataValue | undefined;
  productionGas: DataValue | undefined;
  emission: DataValue | undefined;
  emissionIntensity: DataValue | undefined;
  totalProduction: DataValue | undefined;
};
export type DataField = keyof FieldDataValues;
export type DatasetForSingleField = Partial<Record<Year, FieldDataValues>>;

export type DataPoint = Partial<Record<DataField, number | undefined>>;
export type YearlyDataSeries = Partial<Record<Year, DataPoint>>;
export type OilFieldDataset = Record<string, YearlyDataSeries>;
