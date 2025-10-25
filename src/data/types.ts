/** A string literal type representing all possible digits (0–9). */
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/** Represents a valid year string in the range 1900–2099 (e.g., "1985", "2024"). */
export type Year = `19${Digit}${Digit}` | `20${Digit}${Digit}`;

/** Represents a numeric data value, optionally flagged as an estimate. */
export type DataValue = { 
  value: number;
  estimate?: boolean 
};

/**
 * Represents yearly production and emission metrics for an oil or gas field.
 * 
 * Each property contains a {@link DataValue} object, which may include metadata
 * such as whether the number is estimated. This type is intended for **rich or
 * detailed data**, usually used for storage or API communication.
 *
 * @example
 * {
 *   productionOil: { value: 1500, estimate: true },
 *   productionGas: { value: 200 },
 *   emission: { value: 75 }
 * }
 *
 * @see DataPoint — a simplified form that stores only numeric values (without metadata).
 */
export type FieldDataValues = {
  /**
   * Annual crude oil production volume.
   * @unit million standard cubic meters (mill. Sm³)
   * @example 0.19 — representing 190,000 Sm³ of oil produced in a given year.
   */
  productionOil: DataValue | undefined;

  /**
   * Annual natural gas production volume.
   * @unit billion standard cubic meters (bill. Sm³)
   * @example 8.75 — representing 8.75 billion Sm³ of gas produced in a given year.
   */
  productionGas: DataValue | undefined;
  
  /**
   * Total greenhouse gas emissions from the field in the given year.
   * Typically includes direct CO₂ emissions from combustion, flaring, and venting.
   * @unit tonnes CO₂ equivalent (tCO₂e)
   * @example 194842 — representing 194,842 tonnes of CO₂e emitted in 2020.
   */
  emission: DataValue | undefined;

  /**
   * Emission intensity — emissions per unit of total hydrocarbon production.
   * Calculated approximately as `emission / totalProduction`.
   * Provides a measure of carbon efficiency.
   * @unit tonnes CO₂e per million Sm³ of total production
   * @example 3.46 — meaning 3.46 tonnes CO₂e per million Sm³ produced.
   */
  emissionIntensity: DataValue | undefined;

  /**
   * Total combined hydrocarbon production for the field (oil + gas),
   * converted to a common energy or volume unit.
   * Used as the denominator for emission intensity.
   * @unit million Sm³ oil equivalent (mill. Sm³ o.e.)
   * @example 8.94 — representing total production across all hydrocarbons.
   */
  totalProduction: DataValue | undefined;
};

/** A union of all field names in {@link FieldDataValues}. */
export type DataField = keyof FieldDataValues;

/**
 * Represents a dataset indexed by year, where each year maps to one or more {@link FieldDataValues}.
 * 
 * Despite its name, this type is **not restricted to a single field** — it can technically contain
 * multiple fields per year (e.g., both oil and gas production), because each entry stores a full
 * {@link FieldDataValues} object.
 *
 * It is *typically intended* to represent one field’s dataset across years,
 * but that convention is not enforced by the type system.
 *
 * @example
 * // Common (intended) usage — single field across years
 * {
 *   "2020": { productionOil: { value: 1500 } },
 *   "2021": { productionOil: { value: 1600, estimate: true } }
 * }
 *
 * @example
 * // Technically valid, though not the intended use — multiple fields per year
 * {
 *   "2020": { productionOil: { value: 1500 }, productionGas: { value: 200 } },
 *   "2021": { productionOil: { value: 1600 }, emission: { value: 80 } }
 * }
 */
export type DatasetForSingleField = Partial<Record<Year, FieldDataValues>>;

/**
 * Represents a simplified data point for a single year, containing only **numeric values**.
 * 
 * Unlike {@link FieldDataValues}, which includes full {@link DataValue} objects (with metadata),
 * this type only keeps the raw numbers. It’s often used in UI layers, calculations, or visualizations
 * where metadata like "estimate" is not needed.
 *
 * In other words:
 * - Use {@link FieldDataValues} for **data storage** and API representation (rich format).
 * - Use {@link DataPoint} for **display and computation** (lightweight format).
 *
 * @example
 * // Simplified numeric version of FieldDataValues
 * {
 *   productionOil: 1500,
 *   productionGas: 200,
 *   emission: 75
 * }
 */
export type DataPoint = Partial<Record<DataField, number | undefined>>;

/**
 * Represents time series data across multiple years,
 * where each year maps to a {@link DataPoint} containing numeric values for multiple fields.
 * 
 * In contrast to {@link DatasetForSingleField}, which stores full {@link DataValue} objects
 * (with metadata like `estimate`), this type stores only the numeric values for simplicity.
 * 
 * @example
 * {
 *   "2020": { productionOil: 1500, productionGas: 200, emission: 75 },
 *   "2021": { productionOil: 1600, productionGas: 210 },
 *   "2022": { productionOil: 1700, emission: 70 }
 * }
 */
export type YearlyDataSeries = Partial<Record<Year, DataPoint>>;

/**
 * Represents a full dataset across multiple oil fields,
 * where each field has its own yearly data series.
 * 
 * @example
 * {
 *   "Troll": {
 *     "2020": { productionOil: 1500 },
 *     "2021": { productionOil: 1600 }
 *   },
 *   "Ekofisk": {
 *     "2020": { productionOil: 800 }
 *   }
 * }
 */
export type OilFieldDataset = Record<string, YearlyDataSeries>;
