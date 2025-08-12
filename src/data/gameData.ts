import { data } from "../generated/data";
import {
  DataField,
  DatasetForSingleField,
  DataValue,
  OilFieldDataset,
  Year,
} from "./types";
import { calculateFieldData } from "./calculateFieldData";

export const oilEquivalentToBarrel = 6.2898;
export const allYears = yearsInRange(1900, 2099);

export type OilfieldName = keyof typeof data;
export type DatasetForAllFields = Record<OilfieldName, DatasetForSingleField>;
export type GameData = {
  allFields: OilfieldName[];
  gameYears: Year[];
  gamePeriods: { years: Year[] }[];
  data: DatasetForAllFields;
};

function calculateGameData(data: OilFieldDataset): GameData {
  const allFields: OilfieldName[] = Object.keys(data);

  return {
    allFields,
    gameYears: yearsInRange(2000, 2040),
    gamePeriods: [
      { years: yearsInRange(2025, 2028) },
      { years: yearsInRange(2029, 2032) },
      { years: yearsInRange(2033, 2036) },
      { years: yearsInRange(2037, 2040) },
    ],
    data: Object.fromEntries(
      allFields.map((f) => [f, calculateFieldData(f, data[f])]),
    ),
  };
}

export const gameData: GameData = calculateGameData(data);
console.log(gameData);

export function yearsInRange(first: number, last: number) {
  return Array.from({ length: last - first + 1 }, (_, i) =>
    String(first + i),
  ) as Year[];
}

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
export type PhaseOutSchedule = Partial<Record<OilfieldName, Year>>;

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
  phaseOut: PhaseOutSchedule = {},
  years: Year[] = yearsInRange(1971, 2040),
): Partial<Record<Year, FieldDataValues>> {
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
export function truncatedDataset(
  data: DatasetForSingleField,
  lastYear: Year | undefined,
): DatasetForSingleField {
  if (!lastYear) return data;
  return Object.fromEntries(
    Object.entries(data).filter(([y]) => parseInt(y) < parseInt(lastYear)),
  );
}

export function xyDataSeries<T extends string>(
  dataset: Partial<Record<Year, Record<T, DataValue | undefined>>>,
  dataField: T,
): { x: Year; y: number | undefined; estimate: boolean | undefined }[] {
  return Object.entries(dataset).map(([year, dataPoint]) => ({
    x: year as Year,
    y: dataPoint[dataField]?.value,
    estimate: dataPoint[dataField]?.estimate,
  }));
}

export function toTimeseries(
  dataset: DatasetForSingleField,
  datafield: DataField,
): [Year, number, { estimated: boolean }?][] {
  return Object.entries(dataset).map(
    ([year, datapoint]) =>
      [
        year as Year,
        datapoint[datafield]?.value,
        datapoint[datafield]?.estimate,
      ] as [Year, number, { estimated: boolean }?],
  );
}

export type Slugify<S extends string> =
  Lowercase<S> extends infer L extends string
    ? L extends `${infer T} ${infer U}`
      ? `${T}-${Slugify<U>}`
      : L
    : never;

export function slugify<T extends string>(name: T): Slugify<T> {
  return name.toLowerCase().replace(/\s+/g, "-") as Slugify<T>;
}

export function sumOverYears<T extends string>(
  years: Year[],
  result: Partial<Record<Year, Record<T, DataValue | undefined>>>,
  datafield: T,
) {
  return years
    .map((year) => (result[year] ? result[year][datafield]?.value || 0 : 0))
    .reduce((a, b) => a + b, 0);
}
