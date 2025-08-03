import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";

export function ApplicationHeader({ reset }: { reset(): void }) {
  const { phaseOut, year, proceed } = useContext(ApplicationContext);
  const navigate = useNavigate();
  return (
    <header>
      <div>
        År: {year}
        <div>
          <button onClick={proceed} disabled={year === "2040"}>
            Neste
          </button>
        </div>
        <div>
          <button onClick={reset}>Start på nytt</button>
        </div>
      </div>
      <div>
        {Object.keys(phaseOut).length} <Link to="/map">oljefelter</Link>{" "}
        avviklet
        <div>
          <button
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
