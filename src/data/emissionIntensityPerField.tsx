import { Year } from "../data";
import { fullData } from "./projections";
import { oilEquivalentToBarrel } from "./calculations";

export function emissionIntensityPerField(year: Year): {
  fieldName: string;
  emissionIntensity: number;
  totalProduction: number;
}[] {
  return Object.entries(fullData)
    .map(([fieldName, yearMap]) => {
      const yearData = yearMap[year];
      if (!yearData || yearData.emissionIntensity == null) return null;

      const totalProduction =
        ((yearData.productionOil ?? 0) + (yearData.productionGas ?? 0)) *
        oilEquivalentToBarrel;

      return {
        fieldName,
        emissionIntensity: yearData.emissionIntensity,
        totalProduction,
      };
    })
    .filter((o) => o != null);
}
