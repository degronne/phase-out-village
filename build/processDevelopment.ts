import fs from "fs";
import { OilfieldName, PhaseOutSchedule, Year } from "../src/data/data";

const data = JSON.parse(
  fs.readFileSync("tmp/development.json") as any,
) as string[][];

const result: Record<
  OilfieldName,
  {
    oil: number;
    gas: number;
    emissions: number;
  }
> = {};

const [, ...rows] = data;

for (const row of rows) {
  result[row[0]] = {
    oil: parseFloat(row[1]),
    gas: parseFloat(row[2]),
    emissions: parseFloat(row[3]),
  };
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

console.log(`import { OilfieldName } from "../data/data";

export const development: Record<
  OilfieldName,
  {
    oil: number;
    gas: number;
    emissions: number;
  }
> = ${compactJson} as const;`);
