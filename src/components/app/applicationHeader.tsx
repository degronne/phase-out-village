import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";

function ActionCard() {
  const { year, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const gameEnded = year === "2040";

  if (gameEnded)
    return (
      <div>
        År: 2040
        <div>
          <button
            onClick={() => navigate("/summary", { state: { from: location } })}
          >
            Vis oppsummering
          </button>
        </div>
        <div>
          <button onClick={restart}>Start på nytt</button>
        </div>
      </div>
    );

  return (
    <div>
      Periode: {year}-{parseInt(year) + 3}
      <div>
        {gameEnded || (
          <button
            disabled={gameEnded}
            onClick={() => navigate("/phaseout", { state: { from: location } })}
          >
            Velg felter for avvikling
          </button>
        )}
      </div>
      <div>
        <button onClick={restart}>Start på nytt</button>
      </div>
    </div>
  );
}

export function ApplicationHeader() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <header>
      <ActionCard />
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
