import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import {
  oilEquivalentToBarrel,
  sumOverYears,
  totalProduction,
} from "../../data/gameData";
import { yearsInRange } from "../../data/data";

export function ProductionSummaryCard() {
  const { phaseOut } = useContext(ApplicationContext);

  const years = yearsInRange(2025, 2040);
  const baseline = sumOverYears(years, totalProduction(), "totalProduction");

  const result = sumOverYears(
    years,
    totalProduction(phaseOut),
    "totalProduction",
  );

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
