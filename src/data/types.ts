import { data } from "../generated/data";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Year = `19${Digit}${Digit}` | `20${Digit}${Digit}`;

export type OilfieldName = keyof typeof data;
export type DataValue = { value: number; estimate?: boolean };
export type FieldDataValues = {
  productionOil: DataValue | undefined;
  productionGas: DataValue | undefined;
  emission: DataValue | undefined;
  emissionIntensity: DataValue | undefined;
  totalProduction: DataValue | undefined;
};
export type FieldData = {
  fieldName: OilfieldName;
  data: FieldDataValues;
};
export type DataField = keyof FieldDataValues;
export type DatasetForSingleField = Partial<Record<Year, FieldDataValues>>;
export type DatasetForAllFields = Record<OilfieldName, DatasetForSingleField>;
export type GameData = {
  allFields: OilfieldName[];
  gameYears: Year[];
  gamePeriods: { years: Year[] }[];
  data: DatasetForAllFields;
};

export type PhaseOutSchedule = Partial<Record<OilfieldName, Year>>;
