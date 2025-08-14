import { gameData } from "../../data/gameData";
import { fromEntries } from "../../data/fromEntries";

export function dataFieldToExcel(
  dataField: "productionOil" | "productionGas" | "emission",
) {
  return gameData.allYears.map((year) => ({
    År: year,
    ...fromEntries(
      Object.entries(gameData.data).map(([field, data]) => [
        field,
        data?.[year]?.[dataField]?.value || undefined,
      ]),
    ),
  }));
}

export function oilFieldToExcel(field: string) {
  return Object.entries(gameData.data[field]).map(([year, data]) => ({
    year,
    Olje: data.productionOil?.value || undefined,
    Gass: data.productionGas?.value || undefined,
    Utslipp: data.emission?.value || undefined,
    Utslippsintensitet: data.emissionIntensity?.value || undefined,
  }));
}
