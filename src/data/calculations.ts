export const oilEquivalentToBarrel = 6.2898;

export function calculateAverage(
  yearlyData: Record<
    string,
    {
      productionOil?: number;
      productionGas?: number;
      emission?: number;
      emissionIntensity?: number;
    }
  >,
  resourceKey:
    | "productionOil"
    | "productionGas"
    | "emission"
    | "emissionIntensity",
): number | null {
  const years = Object.keys(yearlyData)
    .map(Number)
    .filter((year) => yearlyData[year]?.[resourceKey] !== undefined)
    .sort((a, b) => b - a)
    .slice(0, 5);

  const values = years.map((year) => yearlyData[year]![resourceKey]!);

  if (values.length === 0) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return avg;
}
