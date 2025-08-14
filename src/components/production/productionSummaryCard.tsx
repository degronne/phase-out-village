import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import {
  gameData,
  oilEquivalentToBarrel,
  sumOverYears,
  totalProduction,
} from "../../data/gameData";

export function ProductionSummaryCard() {
  const { phaseOut } = useContext(ApplicationContext);

  const baseline = sumOverYears(
    totalProduction({}, gameData.gameYears),
    "totalProduction",
  );

  const result = sumOverYears(
    totalProduction(phaseOut, gameData.gameYears),
    "totalProduction",
  );

  const reduction = Math.round(((baseline - result) / baseline) * 100);
  return (
    <div>
      <Link to="/production">
        Produksjon {gameData.gameYears[0]}-
        {gameData.gameYears[gameData.gameYears.length - 1]}:
      </Link>{" "}
      {Math.round(result * oilEquivalentToBarrel)}&nbsp;millioner&nbsp;fat{" "}
      <span title={baseline.toFixed(2)}>(-{reduction}%)</span>
    </div>
  );
}
