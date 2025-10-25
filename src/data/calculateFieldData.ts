import {
  DataField,
  DatasetForSingleField,
  FieldDataValues,
  Year,
} from "./types";
import { oilEquivalentToBarrel, OilfieldName } from "./gameData";
import { development } from "../generated/development";

/**
 * Generates a yearly dataset for a given oil field, including historical data
 * and projected estimates up to 2040.
 *
 * For each year, the returned dataset contains:
 * - `productionOil`: Annual oil production
 * - `productionGas`: Annual gas production
 * - `emission`: Annual CO₂e emissions
 * - `totalProduction`: Sum of oil + gas production
 * - `emissionIntensity`: Emissions per unit of production
 *
 * Historical years are populated using the provided `data`. Future years
 * (after the last year in the dataset) are estimated using field-specific
 * development factors from the `development` object.
 *
 * The `estimate` property is set to `true` for all projected values.
 * If the projected combined production falls below 0.2 million Sm³, 
 * the forecast stops early.
 *
 * @param field - The oil field name to calculate data for.
 * @param data - Historical yearly data for the field.
 *               Keys are years as strings.
 *               Values are partial numeric data for the year (`productionOil`, `productionGas`, `emission`).
 *               `totalProduction` and `emissionIntensity` are computed automatically.
 *
 * @returns A `DatasetForSingleField` object mapping each year to a `FieldDataValues` object.
 *          Historical years use actual data; future years use estimated values with `estimate: true`.
 *
 * @example
 * const historicalData = {
 *   "2018": { productionGas: 0.03, emission: 74384 },
 *   "2019": { productionOil: 0.17, productionGas: 6.75, emission: 180261, emissionIntensity: 4.14 },
 *   "2020": { productionOil: 0.19, productionGas: 8.75, emission: 194842, emissionIntensity: 3.46 }
 * };
 *
 * const dataset = calculateFieldData("Aasta Hansteen", historicalData);
 * // dataset["2020"] contains actual data
 * // dataset["2025"] contains estimated data with `estimate: true`
 */
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

/**
 * Creates a complete `FieldDataValues` object for a given year.
 *
 * Calculates:
 * - `totalProduction` as the sum of oil and gas production.
 * - `emissionIntensity` as emissions per unit of production (if emissions are available).
 * 
 * For years after 2024, all values are marked as estimates (`estimate: true`).
 *
 * @param year - The year for which to create data values.
 * @param productionData - Partial data for the year:
 *   - `productionOil`: oil production (DataValue or undefined)
 *   - `productionGas`: gas production (DataValue or undefined)
 *   - `emission`: CO₂e emissions (DataValue or undefined)
 *
 * @returns A `FieldDataValues` object containing:
 *   - `productionOil`
 *   - `productionGas`
 *   - `emission`
 *   - `totalProduction` (oil + gas)
 *   - `emissionIntensity` (emission / totalProduction)
 *   Each property may include `estimate: true` if applicable.
 *
 * @example
 * const yearData = createDataValues("2025", {
 *   productionOil: { value: 0.2 },
 *   productionGas: { value: 9 },
 *   emission: { value: 200000 }
 * });
 * // yearData.productionOil.estimate === true
 * // yearData.emissionIntensity.value is calculated automatically
 */
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
      averageYears
        .map((y) => data[y].productionOil || 0)
        .reduce((a, b) => a + b, 0) / averageYears.length;
    currentGas =
      averageYears
        .map((y) => data[y].productionGas || 0)
        .reduce((a, b) => a + b, 0) / averageYears.length;
    currentEmission =
      averageYears
        .map((y) => data[y].emission || 0)
        .reduce((a, b) => a + b, 0) / averageYears.length;
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
