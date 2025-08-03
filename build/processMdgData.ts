import fs from "fs";
import { PhaseOutSchedule, Year } from "../src/data";

const data = JSON.parse(fs.readFileSync("tmp/dataMdg.json") as any);

const result: PhaseOutSchedule = {};

for (let i = 1; i < data.length; i++) {
  const [field, year] = data[i];
  if (typeof field === "string" && typeof year === "number") {
    result[field] = String(year) as Year;
  }
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

console.log(`
import { PhaseOutSchedule } from "../data";

export const mdgPlan: PhaseOutSchedule = ${compactJson} as const;`);
