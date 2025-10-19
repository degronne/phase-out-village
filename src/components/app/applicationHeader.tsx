import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";

/**
 * ActionCard component renders a card with actions depending on the current game year.
 * Shows different buttons depending on whether the game has ended (year 2040) or not.
 *
 * Uses ApplicationContext to access current year and restart function.
 * Uses React Router's `useNavigate` and `useLocation` to navigate between routes.
 */
function ActionCard() {
  const { year, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const gameEnded = year === "2040";

  // // If the game has ended, show summary and restart buttons
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

  // Otherwise, show current period, buttons to select phase-out fields, tutorial, and restart
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
        <button
          onClick={() => navigate("/tutorial", { state: { from: location } })}
        >
          Hvordan spiller jeg?
        </button>
      </div>
      <div>
        <button onClick={restart}>Start på nytt</button>
      </div>
    </div>
  );
}

/**
 * ApplicationHeader component renders the top section of the app.
 * Includes:
 * - ActionCard with available actions
 * - Summary of fields phased out (from phaseOut schedule)
 * - EmissionSummaryCard and ProductionSummaryCard
 *
 * Uses ApplicationContext to get `phaseOut` data.
 */
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
