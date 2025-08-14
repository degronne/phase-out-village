import { data } from "../generated/data";
import {
  DataField,
  DatasetForSingleField,
  DataValue,
  OilFieldDataset,
  Year,
} from "./types";
import { calculateFieldData } from "./calculateFieldData";
import { fromEntries } from "./fromEntries";

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
    data: fromEntries(
      allFields.map((f) => [f, calculateFieldData(f, data[f])]),
    ),
  };
}

export const gameData: GameData = calculateGameData(data);

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
  return fromEntries(
    allYears
      .map<
        [string, FieldData]
      >((y) => [y, fieldDataForYear(fieldName, y, phaseOut)])
      .filter((o) => !!o[1]),
  );
}

export function totalProduction(
  phaseOut: PhaseOutSchedule = {},
  years: Year[] = yearsInRange(1971, 2040),
): Partial<Record<Year, Omit<FieldDataValues, "emissionIntensity">>> {
  function sumSeries(
    dataSeries: DatasetForAllFields,
    dataField: DataField,
    year: Year,
  ): DataValue | undefined {
    return Object.entries(dataSeries)
      .map(([name, v]) => {
        return isPhasedOut(name, phaseOut, year)
          ? undefined
          : v[year]?.[dataField];
      })
      .reduce((a, b) => {
        if (!a && !b) return undefined;
        return {
          value: (a?.value || 0) + (b?.value || 0),
          estimate: a?.estimate || false || b?.estimate || false,
        };
      });
  }

  return fromEntries(
    years.map((year) => {
      const value: Omit<FieldDataValues, "emissionIntensity"> = {
        productionOil: sumSeries(gameData.data, "productionOil", year),
        productionGas: sumSeries(gameData.data, "productionGas", year),
        totalProduction: sumSeries(gameData.data, "totalProduction", year),
        emission: sumSeries(gameData.data, "emission", year),
      };
      return [year, value];
    }),
  );
}
export function truncatedDataset(
  data: DatasetForSingleField,
  lastYear: Year | undefined,
): DatasetForSingleField {
  if (!lastYear) return data;
  return fromEntries(
    Object.entries(data).map((data) => {
      if (parseInt(data[0]) < parseInt(lastYear)) return data;
      if (parseInt(data[0]) > parseInt(lastYear)) return [data[0], undefined];
      return [
        data[0],
        {
          productionOil: { value: 0, estimate: true },
          productionGas: { value: 0, estimate: true },
          emission: { value: 0, estimate: true },
          totalProduction: { value: 0, estimate: true },
          emissionIntensity: { value: 0, estimate: true },
        },
      ];
    }),
  );
}

export function xyDataSeries<T extends string>(
  dataset: Partial<Record<Year, Record<T, DataValue | undefined>>>,
  dataField: T,
): {
  x: Year;
  y: number | undefined;
  estimated?: boolean;
}[] {
  return Object.entries(dataset)
    .filter(([, dataPoint]) => !!dataPoint?.[dataField])
    .map(([year, dataPoint]) => ({
      x: year as Year,
      y: dataPoint?.[dataField]?.value,
      estimate: dataPoint?.[dataField]?.estimate,
    }));
}

export function toTimeseries(
  dataset: DatasetForSingleField,
  datafield: DataField,
  years: Year[] = Object.keys(dataset) as Year[],
): [Year, number, { estimated: boolean }?][] {
  return years.map(
    (year) =>
      [
        year,
        dataset[year]?.[datafield]?.value,
        dataset[year]?.[datafield]?.estimate,
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
