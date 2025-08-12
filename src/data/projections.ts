import { Projection } from "../types/interface";
import { calculateAverage } from "./calculations";
import { data } from "../generated/data";
import { DataPoint, OilFieldDataset, Year } from "./types";

export function isStillProducing(
  yearlyData: Record<
    string,
    { productionOil?: number; productionGas?: number; emission?: number }
  >,
  resourceKey: "productionOil" | "productionGas",
): boolean {
  const years = Object.keys(yearlyData)
    .map(Number)
    .sort((a, b) => b - a);
  const latestYear = years[0];
  return yearlyData[latestYear]?.[resourceKey] !== undefined;
}

function findLatestYear(dataset: OilFieldDataset): number {
  let latestYear = 0;

  for (const fieldData of Object.values(dataset)) {
    for (const yearStr of Object.keys(fieldData)) {
      const year = parseInt(yearStr);
      if (!isNaN(year) && year > latestYear) {
        latestYear = year;
      }
    }
  }

  return latestYear;
}

export function productionProjections(data: OilFieldDataset): Projection[] {
  const projections: Projection[] = [];
  const projectionStart = findLatestYear(data) + 1;
  console.log(projectionStart);
  const projectionEnd = 2040;
  const annualDeclineRate = 0.1;

  for (const [fieldName, yearlyData] of Object.entries(data)) {
    const oilActive = isStillProducing(yearlyData, "productionOil");
    const gasActive = isStillProducing(yearlyData, "productionGas");
    const shouldProjectEmission = oilActive || gasActive;

    let projectedOil = oilActive
      ? calculateAverage(yearlyData, "productionOil")
      : null;
    let projectedGas = gasActive
      ? calculateAverage(yearlyData, "productionGas")
      : null;
    let projectedEmission = shouldProjectEmission
      ? calculateAverage(yearlyData, "emission")
      : null;

    for (let year = projectionStart; year <= projectionEnd; year++) {
      let projectedEmissionIntensity: number | null = null;

      if (
        shouldProjectEmission &&
        projectedEmission !== null &&
        (projectedOil !== null || projectedGas !== null)
      ) {
        const oilBoe = projectedOil ? projectedOil * 1_000_000 * 6.29 : 0;
        const gasBoe = projectedGas ? projectedGas * 1_000_000 * 1.1 * 6.29 : 0;
        const totalBoe = oilBoe + gasBoe;
        const emissionKg = projectedEmission * 1000;

        projectedEmissionIntensity =
          totalBoe > 0 ? emissionKg / totalBoe : null;
      }

      projections.push({
        oilFieldName: fieldName,
        year,
        productionOil:
          projectedOil !== null ? parseFloat(projectedOil.toFixed(2)) : null,
        productionGas:
          projectedGas !== null ? parseFloat(projectedGas.toFixed(2)) : null,
        emission:
          projectedEmission !== null
            ? parseFloat(projectedEmission.toFixed(2))
            : null,
        emissionIntensity:
          projectedEmissionIntensity !== null
            ? parseFloat(projectedEmissionIntensity?.toFixed(2))
            : null,
      });

      if (projectedOil !== null) {
        projectedOil *= 1 - annualDeclineRate;
        if (projectedOil < 0.2) projectedOil = 0;
      }

      if (projectedGas !== null) {
        projectedGas *= 1 - annualDeclineRate;
        if (projectedGas < 0.2) projectedGas = 0;
      }
    }
  }

  return projections;
}

export const fullData = generateCompleteData(data);

export function generateCompleteData(data: OilFieldDataset): OilFieldDataset {
  const projections = productionProjections(data);

  const combined: OilFieldDataset = JSON.parse(JSON.stringify(data));

  for (const proj of projections) {
    const {
      oilFieldName,
      year,
      productionOil,
      productionGas,
      emission,
      emissionIntensity,
    } = proj;

    if (!combined[oilFieldName]) {
      combined[oilFieldName] = {};
    }

    combined[oilFieldName][year.toString() as Year] = {
      productionOil:
        productionOil !== null
          ? parseFloat(productionOil.toFixed(2))
          : undefined,
      productionGas:
        productionGas !== null
          ? parseFloat(productionGas.toFixed(2))
          : undefined,
      emission: emission !== null ? parseFloat(emission.toFixed(2)) : undefined,
      emissionIntensity:
        emissionIntensity !== null
          ? parseFloat(emissionIntensity.toFixed(2))
          : undefined,
    };
  }

  return combined;
}
