import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";

export function ApplicationHeader() {
  const { phaseOut, year, proceed, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const gameEnded = year === "2040";
  return (
    <header>
      <div>
        År: {year}
        <div>
          <button onClick={proceed} disabled={gameEnded}>
            Neste
          </button>
        </div>
        <div>
          <button onClick={restart}>Start på nytt</button>
        </div>
      </div>
      <div>
        {Object.keys(phaseOut).length} <Link to="/map">oljefelter</Link>{" "}
        avviklet
        <div>
          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
          >
            Velg felter for avvikling
          </button>
        </div>
      </div>
      <EmissionSummaryCard />
      <ProductionSummaryCard />
    </header>
  );
}
