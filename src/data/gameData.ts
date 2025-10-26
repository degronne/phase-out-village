import { data } from "../generated/data";
import {
  DataField,
  DatasetForSingleField,
  DataValue,
  FieldDataValues,
  OilFieldDataset,
  Year,
} from "./types";
import { calculateFieldData } from "./calculateFieldData";
import { fromEntries } from "./fromEntries";

// Is "generated" derived from Excel files? (can try to confirm it later)

/**
 * Conversion factor between oil equivalent and barrels.
 * 
 * 1 Sm³ of oil equivalent ≈ 6.2898 barrels of oil.
 * Used to convert total energy production to barrels for emission intensity calculations.
 */
export const oilEquivalentToBarrel = 6.2898;

/**
 * Name of a registered oil or gas field.
 * 
 * Derived from the keys of the imported `data` object.
 */
export type OilfieldName = keyof typeof data;

/**
 * A mapping of oilfield names to the year they are phased out.
 * 
 * Fields not present in the record are considered active.
 * Example:
 * ```ts
 * {
 *   "Aasta Hansteen": "2032",
 *   "Alvheim": "2035"
 * }
 * ```
 */
export type PhaseOutSchedule = Partial<Record<OilfieldName, Year>>;

/**
 * Complete dataset for all oilfields.
 * 
 * Each field’s data is represented as a `DatasetForSingleField`,
 * which contains production, emission, and derived values per year.
 */
export type DatasetForAllFields = Record<OilfieldName, DatasetForSingleField>;

/**
 * Structure representing all precomputed data used in the game or simulation.
 */
export type GameData = {
  /** List of all oilfield names included in the dataset */
  allFields: OilfieldName[];
  /** All years available in the dataset */
  allYears: Year[];
  /** Years relevant for the gameplay (e.g. 2025–2040) */
  gameYears: Year[];
  /** Grouped year periods for gameplay segments or rounds */
  gamePeriods: { years: Year[] }[];
  /** Core dataset containing per-field, per-year data */
  data: DatasetForAllFields;
};

/**
 * Builds a comprehensive `GameData` object from raw field data.
 * 
 * It:
 * - Generates all year ranges used in the game (2000–2040)
 * - Defines game periods (2025–2040, divided into 4 intervals)
 * - Computes derived per-field datasets via `calculateFieldData()`
 *
 * @param data - Raw oilfield dataset with production and emission info.
 * @returns A structured `GameData` object ready for use in the game.
 */
function calculateGameData(data: OilFieldDataset): GameData {
  // Extract all oilfield names from the dataset keys
  const allFields: OilfieldName[] = Object.keys(data);

  // Return a structured game data object
  return {
    allFields,
    allYears: yearsInRange(2000, 2040), // All possible years in the dataset
    gameYears: yearsInRange(2025, 2040), // Subset of years used for gameplay
    gamePeriods: [
      { years: yearsInRange(2025, 2028) },
      { years: yearsInRange(2029, 2032) },
      { years: yearsInRange(2033, 2036) },
      { years: yearsInRange(2037, 2040) },
    ],
    // Compute derived data for each oilfield
    // `fromEntries` turns an array of [key, value] pairs into an object
    data: fromEntries(
      allFields.map((f) => [f, calculateFieldData(f, data[f])]),
    ),
  };
}

/** Global instance of precomputed game data. */
export const gameData: GameData = calculateGameData(data);

/**
 * Returns an array of consecutive year strings between `first` and `last` (inclusive).
 *
 * @example
 * yearsInRange(2025, 2028);
 * // → ["2025", "2026", "2027", "2028"]
 */
export function yearsInRange(first: number, last: number) {
  // Create an array of specified length: e.g. 2028 - 2025 + 1 = 4 years
  // The `+1` is because both endpoints are included.
  // Array.from({ length: N }, (_, i) => ...) generates an array with `N` items,
  // where `i` is the current index (starting from 0).
  // So here it produces ["2025", "2026", "2027", "2028"].
  return Array.from({ length: last - first + 1 }, (_, i) =>
    String(first + i),
  ) as Year[];
}

/**
 * Determines whether a given oilfield is phased out by a specific year.
 *
 * @param fieldName - Name of the oilfield.
 * @param phaseOut - Map of field names (key) to their phase-out years (value).
 * @param year - The year to check.
 * @returns `true` if the field is phased out by the given year, otherwise `false`.
 */
export function isPhasedOut(
  fieldName: OilfieldName,
  phaseOut: PhaseOutSchedule,
  year: Year,
) {
  // Returns true if the given field has been phased out by (or before) the given year.
  return (
    (
      phaseOut[fieldName] // Quick-check whether field name is defined in phase-out map
      && parseInt(phaseOut[fieldName]) <= parseInt(year))  // True if phase-out year is less than input year
      || false // Fallback, if no phase-out year is defined
  );
}

/**
 * Calculates total production and emissions across all fields per year.
 * 
 * Optionally accounts for field phase-outs (using `PhaseOutSchedule`).
 *
 * @param phaseOut - Optional map of fields phased out by year.
 * @param years - Optional list of years to include (defaults to `gameData.gameYears`).
 * @returns A record of yearly totals for oil, gas, total production, and emissions.
 */
export function totalProduction(
  phaseOut: PhaseOutSchedule = {},
  years: Year[] = gameData.gameYears,
): Partial<Record<Year, Omit<FieldDataValues, "emissionIntensity">>> {
  /**
   * Helper function that sums a specific data field (e.g. "productionOil")
   * across all oilfields for a given year.
   */
  function sumSeries(
    dataSeries: DatasetForAllFields,
    dataField: DataField,
    year: Year,
  ): DataValue | undefined {
    return Object.entries(dataSeries)
      // For each field, include its value only if it's not phased out
      .map(([name, v]) => {
        return isPhasedOut(name, phaseOut, year)
          ? undefined
          : v[year]?.[dataField];
      })
      // Combine all field values for that year
      .reduce((a, b) => {
        if (!a && !b) return undefined;
        // Otherwise sum the numeric values and flag estimates
        return {
          value: (a?.value || 0) + (b?.value || 0),
          estimate: a?.estimate || false || b?.estimate || false,
        };
      });
  }

  // Build a per-year summary object
  return fromEntries(
    years.map((year) => {
      // Sum up each relevant metric for this year
      const value: Omit<FieldDataValues, "emissionIntensity"> = {
        productionOil: sumSeries(gameData.data, "productionOil", year),
        productionGas: sumSeries(gameData.data, "productionGas", year),
        totalProduction: sumSeries(gameData.data, "totalProduction", year),
        emission: sumSeries(gameData.data, "emission", year),
      };
      // Return [year, value] so `fromEntries` can build the object
      return [year, value];
    }),
  );
}

/**
 * Returns a version of the dataset where all values after a certain year
 * are set to zero (marked as estimates).
 *
 * @param data - The dataset for a single oilfield.
 * @param lastYear - The final active year; later years are truncated.
 * @returns A truncated dataset with zeroed-out values after `lastYear`.
 */
export function truncatedDataset(
  data: DatasetForSingleField,
  lastYear: Year | undefined,
): DatasetForSingleField {
  if (!lastYear) return data;
  return fromEntries(
    Object.entries(data).map((data) => {
      // Keep years before lastYear unchanged
      if (parseInt(data[0]) < parseInt(lastYear)) return data;
      // Years after lastYear become undefined (removed)
      if (parseInt(data[0]) > parseInt(lastYear)) return [data[0], undefined];
      // Exactly lastYear → set all values to 0, mark as estimated
      return [
        data[0],
        {
          productionOil: { value: 0, estimate: true },
          productionGas: { value: 0, estimate: true },
          emission: { value: 0, estimate: true },
          totalProduction: { value: 0, estimate: true },
          emissionIntensity: { value: 0, estimate: true },
        },
      ];
    }),
  );
}

/**
 * Converts a dataset into an (x, y) coordinate series for charting or visualization.
 *
 * @param dataset - Partial yearly dataset for one or more fields.
 * @param dataField - Field name (e.g., `"productionOil"`, `"emission"`).
 * @returns An array of `{ x: Year, y: number, estimate?: boolean }` points.
 */
export function xyDataSeries<T extends string>(
  dataset: Partial<Record<Year, Record<T, DataValue | undefined>>>,
  dataField: T,
): {
  x: Year;
  y: number | undefined;
  estimated?: boolean;
}[] {
  return Object.entries(dataset)
    // Only include years where the given field has data
    .filter(([, dataPoint]) => !!dataPoint?.[dataField])
    // Transform each valid entry into an (x, y) object
    .map(([year, dataPoint]) => ({
      x: year as Year,
      y: dataPoint?.[dataField]?.value,
      estimate: dataPoint?.[dataField]?.estimate,
    }));
}

/**
 * Converts yearly data for a specific field into a timeseries array.
 * 
 * Suitable for line charts or year-based analytics.
 *
 * @param dataset - Dataset for a single field.
 * @param datafield - The data field to extract (e.g., `"emission"`).
 * @param years - Optional list of years (defaults to dataset keys).
 * @returns An array of `[Year, value, { estimated }]` tuples.
 */
export function toTimeseries(
  dataset: DatasetForSingleField,
  datafield: DataField,
  years: Year[] = Object.keys(dataset) as Year[],
): [Year, number, { estimated: boolean }?][] {
  return years.map(
    (year) =>
      [
        year, // X-axis
        dataset[year]?.[datafield]?.value, // Y-axis value
        dataset[year]?.[datafield]?.estimate, // Optional estimate
      ] as [Year, number, { estimated: boolean }?],
  );
}

/**
 * Extracts a simple number array from a dataset for a specific field.
 * 
 * @param dataset - Partial dataset.
 * @param field - Field name to extract (e.g., `"productionOil"`).
 * @returns Array of numeric values or `undefined` where missing.
 */
export function numberSeries<KEYS extends string>(
  dataset: Partial<Record<Year, Record<KEYS, DataValue | undefined>>>,
  field: KEYS,
): (number | undefined)[] {
  // Convert dataset object into an array of values and extract the selected field
  return Object.values(dataset).map((data) => data[field]?.value);
}

/**
 * Computes the total (sum) across all years for a given data field.
 *
 * @param result - Record of yearly values.
 * @param datafield - The field to sum (e.g., `"emission"` or `"totalProduction"`).
 * @returns The numeric sum across all years.
 */
export function sumOverYears<T extends string>(
  result: Partial<Record<Year, Record<T, DataValue | undefined>>>,
  datafield: T,
) {
  return Object.values(result)
    // Extract the numeric value for each year, fallback to 0 if missing
    .map((value) => (value ? value[datafield]?.value || 0 : 0))
    // Sum all yearly values
    .reduce((a, b) => a + b, 0);
}
