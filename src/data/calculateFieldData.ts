import {
  DataField,
  DatasetForSingleField,
  FieldDataValues,
  Year,
} from "./types";
import { oilEquivalentToBarrel, OilfieldName } from "./gameData";

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
            Math.round(
              ((emission.value * 1000) /
                (totalProduction.value * oilEquivalentToBarrel * 1_000_000)) *
                100,
            ) / 100,
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

  const annualOilDevelopment = 0.9;
  const annualGasDevelopment = 0.9;
  const annualEmissionDevelopment = 0.97;

  let currentOil = calculateAverage(data, "productionOil") || 0;
  let currentGas = calculateAverage(data, "productionGas") || 0;
  let currentEmission = calculateAverage(data, "emission") || 0;
  for (let year = parseInt(years[years.length - 1]) + 1; year <= 2040; year++) {
    currentOil = Math.round(currentOil * annualOilDevelopment * 100) / 100;
    if (currentOil < 0.2) currentOil = 0;
    currentGas = Math.round(currentGas * annualGasDevelopment * 100) / 100;
    if (currentGas < 0.2) currentGas = 0;
    if (currentGas === 0 && currentOil === 0) break;
    currentEmission = Math.round(currentEmission * annualEmissionDevelopment);
    dataset[year.toString() as Year] = createDataValues({
      productionGas:
        currentGas !== 0 ? { value: currentGas, estimate: true } : undefined,
      productionOil:
        currentOil !== 0 ? { value: currentOil, estimate: true } : undefined,
      emission: { value: currentEmission, estimate: true },
    });
  }

  return dataset;
}

export function calculateAverage(
  yearlyData: Record<
    string,
    Partial<Record<Exclude<DataField, "totalProduction">, number>>
  >,
  resourceKey: Exclude<DataField, "totalProduction">,
): number | null {
  const values = Object.keys(yearlyData)
    .map(Number)
    .filter((year) => yearlyData[year]?.[resourceKey] !== undefined)
    .sort((a, b) => b - a)
    .map((year) => yearlyData[year]![resourceKey]!)
    .slice(0, 5);

  if (values.length === 0) return null;

  return values.reduce((a, b) => a + b, 0) / values.length;
}
