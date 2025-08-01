import fs from "fs";

const data = JSON.parse(fs.readFileSync("tmp/data.json") as any);

const [firstHeader, secondHeader, ...rows] = data as (number | string)[][];

const result: Record<
  string,
  Record<
    number,
    {
      productionOil?: number;
      productionGas?: number;
      emission?: number;
      emissionIntensity?: number;
    }
  >
> = {};

for (const [
  field,
  year,
  gwh,
  productionOil,
  productionLiquidGas,
  productionGas,
  emission,
  _2,
  emissionIntensity,
] of rows) {
  const totalOilRaw =
    (typeof productionOil === "number" ? productionOil : 0) +
    (typeof productionLiquidGas === "number" ? productionLiquidGas : 0);

  const totalOil = totalOilRaw ? parseFloat(totalOilRaw.toFixed(2)) : undefined;

  const dataPoint = {
    productionOil: totalOil || undefined,
    productionGas,
    emission,
    emissionIntensity,
  };
  for (const k of Object.keys(dataPoint)) {
    if (!(dataPoint as any)[k]) delete (dataPoint as any)[k];
  }
  if (Object.keys(dataPoint)) ((result[field] as any) ||= {})[year] = dataPoint;
}

const compactJson = JSON.stringify(result, null, 2).replace(
  /{([^{}]+)}/g,
  (match, contents) =>
    `{ ${(contents as string)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")} }`,
);

console.log(
  "export const data: Record<string, Record<string, { productionOil?: number; productionGas?: number; emission?: number; emissionIntensity?: number; }>> = " +
    compactJson +
    " as const",
);
