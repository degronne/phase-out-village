import {
  calculateEmissions,
  calculateGasProduction,
  calculateOilProduction,
  yearsInRange,
} from "../../data/data";
import { fullData } from "../../data/projections";
import { PhaseOutSchedule } from "../../data/types";
import { data } from "../../generated/data";

export function dataFieldToExcel(
  dataField: "productionOil" | "productionGas" | "emission",
) {
  return yearsInRange(2000, 2040).map((year) => ({
    År: year,
    ...Object.fromEntries(
      Object.keys(fullData).map((field) => [
        field,
        fullData[field][year]?.[dataField] || undefined,
      ]),
    ),
  }));
}

export function oilFieldToExcel(field: string, phaseOut: PhaseOutSchedule) {
  const oil = calculateOilProduction(data[field], phaseOut[field]);
  const gas = calculateGasProduction(data[field], phaseOut[field]);
  const emissions = calculateEmissions(data[field], phaseOut[field]);
  const years = [
    ...new Set([...gas.map(([y]) => y), ...emissions.map(([y]) => y)]),
  ].sort();
  return years.map((year) => ({
    year,
    productionOil: (oil.find(([y]) => y === year) || [])[1] ?? null,
    productionGas: (gas.find(([y]) => y === year) || [])[1] ?? null,
    emission: (emissions.find(([y]) => y === year) || [])[1] ?? null,
  }));
}
