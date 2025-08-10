import { OilFieldDataset } from "../types/types";
import {
  allYears,
  OilfieldName,
  TimeSerieValue,
  Year,
  yearsInRange,
} from "./data";
import { DataField, GameData } from "./gameData";
import { oilEquivalentToBarrel } from "./calculations";

type DataValue = { value: number; estimate?: boolean };
export type YearlyDataset = Partial<Record<Year, DataValue>>;
type EstimatedYearlyDataset = Partial<
  Record<Year, DataValue & { estimate: true }>
>;
type FieldDataValues = Record<
  string,
  Record<Exclude<DataField, "totalProduction">, number | undefined>
>;

function sumDataPoints(a: DataValue | undefined, b: DataValue | undefined) {
  if (!a) return b;
  if (!b) return a;
  return { value: a.value + b.value, estimate: a.estimate || b.estimate };
}

function sumYearlyDataset(a: YearlyDataset, b: YearlyDataset): YearlyDataset {
  const combinedYears = [
    ...new Set<string>([...Object.keys(a), ...Object.keys(b)]),
  ].toSorted() as Year[];
  return Object.fromEntries(
    combinedYears.map((y) => [y, sumDataPoints(a[y], b[y])]),
  );
}

function sumDatasets(
  a: Record<OilfieldName, YearlyDataset>,
  b: Record<OilfieldName, YearlyDataset>,
): Record<OilfieldName, YearlyDataset> {
  return Object.fromEntries(
    Object.keys(a).map((field) => [
      field,
      sumYearlyDataset(a[field], b[field]),
    ]),
  );
}

function emissionIntensityForDataPoint(
  emission: DataValue | undefined,
  productionOil: DataValue | undefined,
  productionGas: DataValue | undefined,
) {
  const oilBoe =
    (productionOil?.value || 0) * 1_000_000 * oilEquivalentToBarrel;
  const gasBoe =
    (productionGas?.value || 0) * 1_000_000 * 1.1 * oilEquivalentToBarrel;
  const totalBoe = oilBoe + gasBoe;
  if (!emission || totalBoe === 0) return undefined;

  const emissionKg = emission.value * 1000;

  return {
    value: emissionKg / totalBoe,
    estimate:
      emission.estimate || productionGas?.estimate || productionOil?.estimate,
  };
}

function emissionIntensityDataset(
  emission: YearlyDataset,
  productionGas: YearlyDataset,
  productionOil: YearlyDataset,
) {
  return Object.fromEntries(
    (Object.keys(emission) as Year[]).map((y) => [
      y,
      emissionIntensityForDataPoint(
        emission[y],
        productionGas[y],
        productionOil[y],
      ),
    ]),
  );
}

function calculateEmissionIntensity(
  emission: Record<OilfieldName, YearlyDataset>,
  productionGas: Record<OilfieldName, YearlyDataset>,
  productionOil: Record<OilfieldName, YearlyDataset>,
) {
  return Object.fromEntries(
    Object.keys(emission).map((field) => [
      field,
      emissionIntensityDataset(
        emission[field],
        productionGas[field],
        productionOil[field],
      ),
    ]),
  );
}

export function calculateGameData(data: OilFieldDataset): GameData {
  const allFields: OilfieldName[] = Object.keys(data);

  function computeAverage(values: TimeSerieValue[]) {
    return values.map(([_, v]) => v).reduce((a, b) => a + b, 0) / values.length;
  }

  function calculateOilProduction(datum: FieldDataValues): YearlyDataset {
    const measuredValues = allYears
      .map((y) => [y, datum[y]?.productionOil])
      .filter(([_, v]) => v);
    if (measuredValues.length === 0) return {};

    const average = computeAverage(
      measuredValues.toReversed().slice(0, 5) as [Year, number][],
    );

    const result: EstimatedYearlyDataset = {};
    let current = average;
    for (
      let y = parseInt(measuredValues.at(-1)![0] as Year) + 1;
      y < 2040;
      y++
    ) {
      const year = y.toString() as Year;
      current *= 0.9;
      if (current < 0.2) {
        current = 0;
      }
      result[year] = { value: current, estimate: true };
    }
    return {
      ...result,
      ...Object.fromEntries(measuredValues.map(([k, value]) => [k, { value }])),
    };
  }

  function calculateGasProduction(datum: FieldDataValues): YearlyDataset {
    const measuredValues = allYears
      .map((y) => [y, datum[y]?.productionGas])
      .filter(([_, v]) => v);
    if (measuredValues.length === 0) return {};

    const average = computeAverage(
      measuredValues.toReversed().slice(0, 5) as [Year, number][],
    );

    const result: EstimatedYearlyDataset = {};
    let current = average;
    for (
      let y = parseInt(measuredValues.at(-1)![0] as Year) + 1;
      y < 2040;
      y++
    ) {
      const year = y.toString() as Year;
      current *= 0.9;
      if (current < 0.2) {
        current = 0;
      }
      result[year] = { value: current, estimate: true };
    }
    return {
      ...result,
      ...Object.fromEntries(measuredValues.map(([k, value]) => [k, { value }])),
    };
  }

  function calculateEmissions(datum: FieldDataValues): YearlyDataset {
    const measuredValues = allYears
      .map((y) => [y, datum[y]?.emission])
      .filter(([_, v]) => v);
    if (measuredValues.length === 0) return {};

    const average = computeAverage(
      measuredValues.toReversed().slice(0, 5) as [Year, number][],
    );

    const result: EstimatedYearlyDataset = {};
    let current = average;
    for (
      let y = parseInt(measuredValues.at(-1)![0] as Year) + 1;
      y < 2040;
      y++
    ) {
      current *= 0.97; // yearly decline of 3%
      const year = y.toString() as Year;
      result[year] = { value: Math.round(current), estimate: true };
    }
    return {
      ...result,
      ...Object.fromEntries(measuredValues.map(([k, value]) => [k, { value }])),
    };
  }

  function toDataset(
    calculate: (data: FieldDataValues) => YearlyDataset,
  ): Record<OilfieldName, YearlyDataset> {
    return Object.fromEntries(
      allFields.map((f) => [f, calculate(data[f] as FieldDataValues)]),
    );
  }

  const productionOil = toDataset(calculateOilProduction);
  const productionGas = toDataset(calculateGasProduction);
  const totalProduction = sumDatasets(productionOil, productionGas);
  const emission = toDataset(calculateEmissions);

  const emissionIntensity = calculateEmissionIntensity(
    emission,
    productionGas,
    productionGas,
  );
  return {
    allFields,
    gameYears: yearsInRange(2000, 2040),
    gamePeriods: [
      { years: yearsInRange(2025, 2028) },
      { years: yearsInRange(2029, 2032) },
      { years: yearsInRange(2033, 2036) },
      { years: yearsInRange(2037, 2040) },
    ],
    data: {
      emission,
      productionOil,
      productionGas,
      totalProduction,
      emissionIntensity,
    },
  };
}
