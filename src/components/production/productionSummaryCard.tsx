import React, { useContext } from "react";
import {
  calculateOilProduction,
  computeSumForYears,
  yearsInRange,
} from "../../data";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";

export function ProductionSummaryCard() {
  const years = yearsInRange(2025, 2040);

  const { data, phaseOut } = useContext(ApplicationContext);

  const yearSet = new Set(years);
  const result = Object.entries(data)
    .map(([key, value]) =>
      computeSumForYears(calculateOilProduction(value, phaseOut[key]), yearSet),
    )
    .reduce((a, b) => a + b, 0);
  const baseline = Object.entries(data)
    .map(([_, value]) =>
      computeSumForYears(calculateOilProduction(value, undefined), yearSet),
    )
    .reduce((a, b) => a + b, 0);
  const reduction = Math.round(((baseline - result) / baseline) * 100);
  return (
    <div>
      <Link to="/production">Produksjon</Link> {years.at(0)}-{years.at(-1)}:{" "}
      {result.toFixed(2)}{" "}
      <span title={baseline.toFixed(2)}>({reduction}% redusjon)</span>
    </div>
  );
}
