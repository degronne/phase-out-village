import { TimeSerieValue } from "./data";
import { Year } from "./types";

export function toXYDataSeries(allEmissions: TimeSerieValue[]): {
  x: Year;
  y: number;
}[] {
  const allYearsSet = new Set<Year>();
  allEmissions.forEach(([year]) => {
    allYearsSet.add(year);
  });
  const allYearsSorted = Array.from(allYearsSet).sort();

  return allYearsSorted.map((year) => {
    const total = allEmissions
      .filter(([y]) => y === year)
      .map(([, value]) => value)
      .reduce((acc, curr) => acc + curr, 0);

    return {
      x: year,
      y: total,
    };
  });
}
