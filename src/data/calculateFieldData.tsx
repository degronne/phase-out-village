import { yearsInRange } from "./data";
import { calculateAverage, oilEquivalentToBarrel } from "./calculations";
import { development } from "../generated/development";
import {
  DataField,
  DatasetForSingleField,
  FieldDataValues,
  OilfieldName,
  Year,
} from "./types";

export function calculateFieldData(
  field: OilfieldName,
  data: Record<
    string,
    Partial<Record<Exclude<DataField, "totalProduction">, number>>
  >,
): DatasetForSingleField {
  const dataset: DatasetForSingleField = {};

  const years = [
    ...new Set(
      Object.entries(data)
        .filter(([, data]) => data.productionGas || data.productionOil)
        .map(([year]) => year as Year),
    ),
  ].sort();

  function createDataValues({
    productionOil,
    productionGas,
    emission,
  }: Pick<
    FieldDataValues,
    "productionGas" | "productionOil" | "emission"
  >): FieldDataValues {
    const totalProduction = {
      value: (productionGas?.value || 0) + (productionOil?.value || 0),
    };
    const emissionIntensity = emission
      ? {
          value:
            (emission.value * 1000) /
            (totalProduction.value * oilEquivalentToBarrel * 1_000_000),
        }
      : undefined;
    return {
      totalProduction,
      productionGas,
      productionOil,
      emission,
      emissionIntensity,
    };
  }

  for (const year of years) {
    const productionGas = { value: data[year].productionGas || 0 };
    const productionOil = { value: data[year].productionOil || 0 };
    const emission = data[year].emission
      ? { value: data[year].emission }
      : undefined;

    dataset[year] = createDataValues({
      productionGas,
      productionOil,
      emission,
    });
  }

  const annualOilDevelopment = development[field]?.oil || 0.9;
  const annualGasDevelopment = development[field]?.gas || 0.9;
  const annualEmissionDevelopment = development[field]?.emissions || 0.97;

  let currentOil = calculateAverage(data, "productionOil") || 0;
  let currentGas = calculateAverage(data, "productionGas") || 0;
  let currentEmission = calculateAverage(data, "emission") || 0;
  for (const year of yearsInRange(
    parseInt(years[years.length - 1]) + 1,
    2040,
  )) {
    currentOil = Math.round(currentOil * annualOilDevelopment * 100) / 100;
    if (currentOil < 0.2) currentOil = 0;
    currentGas = Math.round(currentGas * annualGasDevelopment * 100) / 100;
    if (currentGas < 0.2) currentGas = 0;
    if (currentGas === 0 && currentOil === 0) break;
    currentEmission = Math.round(currentEmission * annualEmissionDevelopment);
    dataset[year] = createDataValues({
      productionGas: { value: currentGas / 100, estimate: true },
      productionOil: { value: currentOil, estimate: true },
      emission: { value: currentEmission, estimate: true },
    });
  }

  return dataset;
}
