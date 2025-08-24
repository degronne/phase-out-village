import {
  DataField,
  DatasetForSingleField,
  FieldDataValues,
  Year,
} from "./types";
import { oilEquivalentToBarrel, OilfieldName } from "./gameData";
import { development } from "../generated/development";

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

  function createDataValues(
    year: Year,
    {
      productionOil,
      productionGas,
      emission,
    }: Pick<FieldDataValues, "productionGas" | "productionOil" | "emission">,
  ): FieldDataValues {
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
    // Ugly: This code should be made more elegant, but this will have to do for now
    if (year.localeCompare("2024") > 0) {
      return {
        totalProduction: { value: totalProduction.value, estimate: true },
        productionGas: productionGas
          ? { value: productionGas.value, estimate: true }
          : undefined,
        productionOil: productionOil
          ? { value: productionOil.value, estimate: true }
          : undefined,
        emission: emission
          ? { value: emission.value, estimate: true }
          : undefined,
        emissionIntensity: emissionIntensity
          ? { value: emissionIntensity.value, estimate: true }
          : undefined,
      };
    }

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

    dataset[year] = createDataValues(year, {
      productionGas,
      productionOil,
      emission,
    });
  }

  const fieldDevelopment: (typeof development)[OilfieldName] | undefined =
    development[field];
  const annualOilDevelopment = fieldDevelopment?.oil || 0.9;
  const annualGasDevelopment = fieldDevelopment?.gas || 0.9;
  const annualEmissionDevelopment = fieldDevelopment?.emissions || 0.97;

  const averageYears = Object.keys(data)
    .filter((year) => data[year] !== undefined)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 5);

  if (averageYears.length === 0) return dataset;

  const lastYear = averageYears[0];

  let currentOil = data[lastYear].productionOil!;
  let currentGas = data[lastYear].productionGas || 0;
  let currentEmission = data[lastYear].emission || 0;

  if (lastYear === "2024") {
    currentOil =
      years.map((y) => data[y].productionOil || 0).reduce((a, b) => a + b, 0) /
      years.length;
    currentGas =
      years.map((y) => data[y].productionGas || 0).reduce((a, b) => a + b, 0) /
      years.length;
    currentEmission =
      years.map((y) => data[y].emission || 0).reduce((a, b) => a + b, 0) /
      years.length;
  }

  for (let year = parseInt(lastYear) + 1; year <= 2040; year++) {
    currentOil = Math.round(currentOil * annualOilDevelopment * 100) / 100;
    currentGas = Math.round(currentGas * annualGasDevelopment * 100) / 100;
    if (currentGas + currentOil < 0.2) break;
    currentEmission = Math.round(currentEmission * annualEmissionDevelopment);
    dataset[year.toString() as Year] = createDataValues(
      year.toString() as Year,
      {
        productionGas:
          currentGas !== 0 ? { value: currentGas, estimate: true } : undefined,
        productionOil:
          currentOil !== 0 ? { value: currentOil, estimate: true } : undefined,
        emission: { value: currentEmission, estimate: true },
      },
    );
  }

  return dataset;
}
