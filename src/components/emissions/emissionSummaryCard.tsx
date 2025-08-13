import React, { useContext } from "react";
import {
  calculateEmissions,
  computeSumForYears,
  yearsInRange,
} from "../../data/data";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { data } from "../../generated/data";

export function EmissionSummaryCard() {
  const years = yearsInRange(2025, 2040);

  const { phaseOut } = useContext(ApplicationContext);

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
      <Link to="/emissions">
        Utslipp {years[0]}-{years[years.length - 1]}:
      </Link>{" "}
      {Math.round(result / 1_000_000)}&nbsp;millioner&nbsp;tonn&nbsp;CO₂{" "}
      <span title={baseline.toString()}> (-{reduction}%)</span>
    </div>
  );
}
