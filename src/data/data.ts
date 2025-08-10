import { data } from "../generated/data";
import { fromEntries } from "./fromEntries";

export type OilfieldName = keyof typeof data;
export const OilfieldValues = Object.keys(data) as OilfieldName[];
export type Slugify<S extends string> =
  Lowercase<S> extends infer L extends string
    ? L extends `${infer T} ${infer U}`
      ? `${T}-${Slugify<U>}`
      : L
    : never;

export function slugify<T extends string>(name: T): Slugify<T> {
  return name.toLowerCase().replace(/\s+/g, "-") as Slugify<T>;
}

export const oilfields = Object.keys(data).map((name) =>
  slugify(name),
) as Slugify<OilfieldName>[];
export const oilfieldNames = fromEntries(
  Object.keys(data).map((name) => [
    name.toLowerCase().replace(/\s+/g, "-"),
    name,
  ]),
) as Record<Slugify<OilfieldName>, OilfieldName>;
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Year = `19${Digit}${Digit}` | `20${Digit}${Digit}`;
export type PhaseOutSchedule = Partial<Record<OilfieldName, Year>>;
type DataValue = { value: number; estimate?: boolean };
export type YearlyDataset = Partial<Record<Year, DataValue>>;
type EstimatedYearlyDataset = Partial<
  Record<Year, DataValue & { estimate: true }>
>;

export type TimeSerieValue = [Year, number, { estimate: true }?];

export function yearsInRange(first: number, last: number) {
  return Array.from({ length: last - first + 1 }, (_, i) =>
    String(first + i),
  ) as Year[];
}

export const allYears = yearsInRange(1900, 2099);

export function measuredOilProduction(
  data: Record<Year, { productionOil?: number }>,
): YearlyDataset {
  const result: YearlyDataset = {};
  for (let y = 1990; y < 2040; y++) {
    const year = y.toString() as Year;
    const { productionOil } = data[year] || {};
    if (productionOil) result[year] = { value: productionOil };
  }
  return result;
}

export function estimatedOilProduction(
  measured: YearlyDataset,
  phaseOut: Year | undefined,
): EstimatedYearlyDataset {
  const values = [...allYears]
    .reverse()
    .map((y) => [y, measured[y]?.value])
    .filter(([_, v]) => v)
    .slice(0, 5) as [Year, number][];

  if (values.length == 0) return {};
  const average = computeAverage(values);

  const result: EstimatedYearlyDataset = {};
  let current = average;
  for (let y = parseInt(values[0][0]) + 1; y < 2040; y++) {
    const year = y.toString() as Year;
    if (year === phaseOut) {
      result[year] = { value: 0, estimate: true };
      break;
    }
    current *= 0.9;
    if (current < 0.2) {
      current = 0;
    }
    result[year] = { value: current, estimate: true };
  }
  return result;
}

export function oilProduction(
  value: Record<Year, { productionOil?: number }>,
  phaseOut: PhaseOutSchedule,
  key: string,
): YearlyDataset {
  return {
    ...estimatedOilProduction(measuredOilProduction(value), phaseOut[key]),
    ...measuredOilProduction(value),
  };
}

export function calculateGasProduction(
  data: Record<Year, { productionGas?: number }>,
  phaseOut: Year | undefined,
): TimeSerieValue[] {
  const result: TimeSerieValue[] = allYears
    .filter((y) => data[y]?.productionGas)
    .map((y) => [y, data[y]?.productionGas!, undefined]);

  if (result.length == 0) return result;
  let current = computeAverage([...result].reverse().slice(0, 5));
  for (let y = parseInt(result[result.length - 1]![0]) + 1; y < 2040; y++) {
    const year = y.toString() as Year;
    if (year === phaseOut) {
      result.push([year, 0, { estimate: true }]);
      break;
    }
    current *= 0.9;
    if (current < 0.2) {
      current = 0;
    }
    result.push([year, Math.round(current * 100) / 100, { estimate: true }]);
  }
  return result;
}

export function calculateOilProduction(
  dataset: Record<Year, { productionOil?: number }>,
  phaseOut: Year | undefined,
): TimeSerieValue[] {
  const result: TimeSerieValue[] = allYears
    .filter((y) => dataset[y]?.productionOil)
    .map((y) => [y, dataset[y]?.productionOil!, undefined]);

  if (result.length == 0) return result;
  let current = computeAverage([...result].reverse().slice(0, 5));
  for (let y = parseInt(result[result.length - 1]![0]) + 1; y < 2040; y++) {
    const year = y.toString() as Year;
    if (year === phaseOut) {
      result.push([year, 0, { estimate: true }]);
      break;
    }
    current *= 0.9;
    if (current < 0.2) {
      current = 0;
    }
    result.push([year, Math.round(current * 100) / 100, { estimate: true }]);
  }
  return result;
}

export function calculateEmissions(
  dataset: Record<Year, { emission?: number }>,
  phaseOut: Year | undefined,
): TimeSerieValue[] {
  const result: TimeSerieValue[] = allYears
    .filter((y) => dataset[y]?.emission)
    .map((y) => [y, dataset[y]?.emission!, undefined]);

  if (result.length == 0) return result;
  let average = Math.round(computeAverage([...result].reverse().slice(0, 5)));

  for (let y = parseInt(result[result.length - 1]![0]) + 1; y < 2040; y++) {
    average *= 0.97; // yearly decline of 3%
    const year = y.toString() as Year;
    if (year === phaseOut) {
      result.push([year, 0, { estimate: true }]);
      break;
    }
    result.push([year, Math.round(average), { estimate: true }]);
  }
  return result;
}

function computeAverage(values: TimeSerieValue[]) {
  return values.map(([_, v]) => v).reduce((a, b) => a + b, 0) / values.length;
}

export function computeSumForYears(
  production: TimeSerieValue[],
  years: Set<Year>,
) {
  let result = 0;
  for (const [year, value] of production) {
    if (years.has(year)) result += value;
  }
  return result;
}
