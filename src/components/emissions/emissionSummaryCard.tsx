import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { gameData, sumOverYears, totalProduction } from "../../data/gameData";

export function EmissionSummaryCard() {
  const { phaseOut } = useContext(ApplicationContext);

  const years = gameData.gameYears;
  const baseline = sumOverYears(totalProduction({}, years), "emission");
  const result = sumOverYears(totalProduction(phaseOut, years), "emission");
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
