import { gameData, PhaseOutSchedule } from "../../data/gameData";

export function dataFieldToExcel(
  dataField: "productionOil" | "productionGas" | "emission",
) {
  return gameData.gameYears.map((year) => ({
    År: year,
    ...Object.fromEntries(
      Object.entries(gameData.data).map(([field, data]) => [
        field,
        data?.[year]?.[dataField]?.value || undefined,
      ]),
    ),
  }));
}

export function oilFieldToExcel(field: string, phaseOut: PhaseOutSchedule) {
  return Object.entries(gameData.data[field]).map(([year, data]) => ({
    year,
    Olje: data.productionOil?.value || undefined,
    Gass: data.productionGas?.value || undefined,
    Utslipp: data.emission?.value || undefined,
    Utslippsintensitet: data.emissionIntensity?.value || undefined,
  }));
}
