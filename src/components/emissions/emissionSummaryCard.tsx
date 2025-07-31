import React, { useContext } from "react";
import {
  calculateEmissions,
  computeSumForYears,
  yearsInRange,
} from "../../data";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";

export function EmissionSummaryCard() {
  const years = yearsInRange(2025, 2040);

  const { data, phaseOut } = useContext(ApplicationContext);

  const yearSet = new Set(years);
  const result = Object.entries(data)
    .map(([key, value]) =>
      computeSumForYears(calculateEmissions(value, phaseOut[key]), yearSet),
    )
    .reduce((a, b) => a + b, 0);
  const baseline = Object.entries(data)
    .map(([_, value]) =>
      computeSumForYears(calculateEmissions(value, undefined), yearSet),
    )
    .reduce((a, b) => a + b, 0);
  const reduction = Math.round(((baseline - result) / baseline) * 100);
  return (
    <div>
      <Link to="/emissions">Utslipp</Link> {years.at(0)}-{years.at(-1)}:{" "}
      {(result / 1_000_000).toFixed(2)} millioner tonn CO2e{" "}
      <span title={baseline.toString()}>({reduction}% redusjon)</span>
    </div>
  );
}
