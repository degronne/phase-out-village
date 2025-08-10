import { OilFieldDataset } from "../types/types";
import {
  calculateEmissions,
  PhaseOutSchedule,
  TimeSerieValue,
  Year,
} from "./data";

export function calculateTotalEmissions(
  allFields: string[],
  data: OilFieldDataset,
  phaseOut: PhaseOutSchedule,
): TimeSerieValue[] {
  const emissionDataSeries = allFields.map((field) =>
    calculateEmissions(data[field], phaseOut[field]),
  );
  const years = emissionDataSeries.reduce((acc, serie) => {
    return acc.concat(serie.map(([year]) => year));
  }, [] as Year[]);
  const allYearsSet = [...new Set<Year>([...years])].sort();

  return allYearsSet.map((year) => [
    year,
    emissionDataSeries
      .flatMap((o) => o)
      .filter(([y]) => y === year)
      .map(([, value]) => value)
      .reduce((a, b) => a + b, 0),
  ]);
}
