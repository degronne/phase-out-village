import { OilFieldDataset } from "../types/types";
import { OilfieldName, yearsInRange } from "./data";
import { GameData } from "./gameData";
import { calculateFieldData } from "./calculateFieldData";

export function calculateGameData(data: OilFieldDataset): GameData {
  const allFields: OilfieldName[] = Object.keys(data);

  return {
    allFields,
    gameYears: yearsInRange(2000, 2040),
    gamePeriods: [
      { years: yearsInRange(2025, 2028) },
      { years: yearsInRange(2029, 2032) },
      { years: yearsInRange(2033, 2036) },
      { years: yearsInRange(2037, 2040) },
    ],
    data: Object.fromEntries(
      allFields.map((f) => [f, calculateFieldData(f, data[f])]),
    ),
  };
}
