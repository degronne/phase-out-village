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
        Periode: {year}-{parseInt(year) + 3}
        <div>
          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
          >
            Velg felter for avvikling
          </button>
        </div>
        <div>
          <button onClick={restart}>Start på nytt</button>
        </div>
      </div>
      <div>
        <strong>
          <Link to={"/plan"}>Din plan:</Link>
        </strong>
        <div>
          {Object.keys(phaseOut).length} <Link to="/map">oljefelter</Link>{" "}
          avviklet
        </div>
      </div>
      <EmissionSummaryCard />
      <ProductionSummaryCard />
    </header>
  );
}
