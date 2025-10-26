import React, { useContext } from "react";
import { Dialog } from "../ui/dialog";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { ApplicationContext } from "../../applicationContext";
import { mdgPlan } from "../../generated/dataMdg";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

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
  const isSmall = useIsSmallScreen();
  const from = location.state?.from?.pathname || "/map";

  return (
    <Dialog open={true} onClose={() => navigate(from)}>
      <div className={"game-over"} style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>

        <div style={{ display: isSmall ? "block" : "none", position: "fixed", top: "0.5rem", right: "0.5rem", zIndex: "3" }}>
          <button
            onClick={() => navigate("/map", { state: { from: location } })}
            title="Tilbake"
          >
            X
          </button>
        </div>

        <h2 style={{ marginBottom: "0.5rem" }}>Hvordan gikk det?</h2>

        <h3 style={{ marginBottom: "0.5rem" }}>Din plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={phaseOut} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={phaseOut} />
          </div>
        </div>

        <div style={{ height: "1px", backgroundColor: "grey", opacity: "0.5", marginTop: "0.5rem", marginBottom: "0.5rem" }}></div>

        <h3 style={{ marginBottom: "0.5rem" }}>MDG sin plan</h3>
        <div className={"charts"} style={{ backgroundColor: ''}}>
          <div>
            <ProductionReductionChart phaseOut={mdgPlan} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={mdgPlan} />
          </div>
        </div>

        <div style={{ display: isSmall ? "block" : "none", height: "1px", backgroundColor: "grey", opacity: "0.5", marginTop: "1rem", marginBottom: "0.5rem" }}></div>

        <div className="button-row" style={{ marginBottom: "0.5rem", marginTop: "1rem" }}>
          <div>
            <button onClick={() => navigate("/map")} style={{ fontSize: "1.25em" }}>🔍 Se over din plan</button>
          </div>
          <div>
            <button onClick={restart} style={{ fontSize: "1.25em" }}>↺ Prøv på nytt</button>
          </div>
        </div>

      </div>
    </Dialog>
  );
}
