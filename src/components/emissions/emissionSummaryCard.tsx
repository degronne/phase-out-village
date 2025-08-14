import React, { useContext } from "react";
import { yearsInRange } from "../../data/data";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { gameData, sumOverYears, totalProduction } from "../../data/gameData";

export function EmissionSummaryCard() {
  const { phaseOut } = useContext(ApplicationContext);

  const years = yearsInRange(2025, 2040);
  const baseline = sumOverYears(years, totalProduction(), "emission");
  const result = sumOverYears(years, totalProduction(phaseOut), "emission");
  const reduction = Math.round(((baseline - result) / baseline) * 100);

  return (
    <div>
      <Link to="/emissions">
        Utslipp {years[0]}-{years[years.length - 1]}:
      </Link>{" "}
      {Math.round(result / 1_000_000)}
      &nbsp;millioner&nbsp;tonn&nbsp;CO₂{" "}
      <span title={baseline.toString()}> (-{reduction}%)</span>
    </div>
  );
}
