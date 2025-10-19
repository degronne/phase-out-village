import React, { useContext } from "react";
import { Dialog } from "../ui/dialog";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { ApplicationContext } from "../../applicationContext";
import { mdgPlan } from "../../generated/dataMdg";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * GameOverDialog renders a modal shown at the end of the game.
 * 
 * Displays:
 * - The player's plan (fields phased out) with production and emission charts.
 * - MDG's plan for comparison (using predefined `mdgPlan` data).
 * 
 * Provides buttons to:
 * - Review your plan on the map.
 * - Restart the game.
 *
 * Uses:
 * - ApplicationContext to get `phaseOut` schedule and `restart` function.
 * - React Router `useNavigate` and `useLocation` for navigation.
 */
export function GameOverDialog() {
  const { phaseOut, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/map";

  return (
    <Dialog open={true} onClose={() => navigate(from)}>
      <div className={"game-over"}>
        <h2>Hvordan gikk det?</h2>
        <h3>Din plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={phaseOut} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={phaseOut} />
          </div>
        </div>
        <h3>MDG sin plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={mdgPlan} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={mdgPlan} />
          </div>
        </div>
        <div className="button-row">
          <div>
            <button onClick={() => navigate("/map")}>Se over din plan</button>
          </div>
          <div>
            <button onClick={restart}>Prøv på nytt</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
