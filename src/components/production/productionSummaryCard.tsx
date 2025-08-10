import React, { useContext } from "react";
import {
  calculateOilProduction,
  computeSumForYears,
  yearsInRange,
} from "../../data/data";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { oilEquivalentToBarrel } from "../../data/calculations";
import { data } from "../../generated/data";

export function ProductionSummaryCard() {
  const years = yearsInRange(2025, 2040);

  const { phaseOut } = useContext(ApplicationContext);

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
      <Link to="/production">
        Produksjon {years[0]}-{years[years.length - 1]}:
      </Link>{" "}
      {Math.round(result * oilEquivalentToBarrel)}&nbsp;millioner&nbsp;fat{" "}
      <span title={baseline.toFixed(2)}>(-{reduction}%)</span>
    </div>
  );
}
