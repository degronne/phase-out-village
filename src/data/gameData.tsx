import {
  allYears,
  OilfieldName,
  PhaseOutSchedule,
  Year,
  yearsInRange,
} from "./data";
import { data } from "../generated/data";
import { calculateGameData } from "./calculateGameData";

type DataValue = { value: number; estimate?: boolean };

export type FieldDataValues = {
  productionOil: DataValue | undefined;
  productionGas: DataValue | undefined;
  emission: DataValue | undefined;
  emissionIntensity: DataValue | undefined;
  totalProduction: DataValue | undefined;
};
type FieldData = {
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

export const gameData: GameData = calculateGameData(data);
console.log(gameData);

export function fieldDataForYear(
  fieldName: OilfieldName,
  year: Year,
  phaseOut: PhaseOutSchedule = {},
): FieldData {
  if (isPhasedOut(fieldName, phaseOut, year)) {
    return {
      fieldName,
      data: {
        emission: undefined,
        productionOil: undefined,
        productionGas: undefined,
        totalProduction: undefined,
        emissionIntensity: undefined,
      },
    };
  }
  function getDataValue(field: DataField) {
    const dataForYear = gameData.data[fieldName][year];
    return dataForYear ? dataForYear[field] : undefined;
  }

  return {
    fieldName,
    data: {
      productionOil: getDataValue("productionOil"),
      productionGas: getDataValue("productionGas"),
      totalProduction: getDataValue("totalProduction"),
      emission: getDataValue("emission"),
      emissionIntensity: getDataValue("emissionIntensity"),
    },
  };
}

export function isPhasedOut(
  fieldName: OilfieldName,
  phaseOut: PhaseOutSchedule,
  year: Year,
) {
  return (
    (phaseOut[fieldName] && parseInt(phaseOut[fieldName]) <= parseInt(year)) ||
    false
  );
}

export function fieldDataset(
  fieldName: OilfieldName,
  phaseOut: PhaseOutSchedule,
): Partial<Record<Year, FieldData>> {
  return Object.fromEntries(
    allYears
      .map((y) => [y, fieldDataForYear(fieldName, y, phaseOut)])
      .filter((o) => !!o[1]),
  );
}

export function totalProduction(
  phaseOut: PhaseOutSchedule,
  years: Year[] = yearsInRange(1971, 2040),
): Partial<
  Record<Year, Record<Exclude<DataField, "emissionIntensity">, number>>
> {
  function sumSeries(
    dataSeries: DatasetForAllFields,
    dataField: DataField,
    year: Year,
  ) {
    return Object.entries(dataSeries)
      .map(([name, v]) => {
        if (isPhasedOut(name, phaseOut, year)) return 0;
        const yearlyValues = v[year];
        return (yearlyValues ? yearlyValues[dataField]?.value : 0) || 0;
      })
      .reduce((a, b) => a + b, 0);
  }

  return Object.fromEntries(
    years.map((year) => [
      year,
      {
        productionOil: sumSeries(gameData.data, "productionOil", year),
        productionGas: sumSeries(gameData.data, "productionGas", year),
        totalProduction: sumSeries(gameData.data, "totalProduction", year),
        emission: sumSeries(gameData.data, "emission", year),
      },
    ]),
  );
}
