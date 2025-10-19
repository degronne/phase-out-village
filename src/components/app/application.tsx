import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { MapRoute } from "../map/mapRoute";
import { ApplicationContext } from "../../applicationContext";
import { FrontPage } from "./frontPage";
import { PhaseOutRoute } from "../phaseout/phaseOutRoute";
import { ProductionRoute } from "../production/productionRoute";
import { useSessionState } from "../../hooks/useSessionState";
import { EmissionRoute } from "../emissions/emissionRoute";
import { ApplicationHeader } from "./applicationHeader";
import { ApplicationFooter } from "./applicationFooter";
import { GameOverDialog } from "./gameOverDialog";
import { PlanRoute } from "../plan/planRoute";
import { Year } from "../../data/types";
import { DataViewRoute } from "../dataView/dataViewRoute";
import { PhaseOutSchedule } from "../../data/gameData";
import { TutorialRoute } from "./tutorialRoute";

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<FrontPage />} />
      <Route path={"/phaseout"} element={<PhaseOutRoute />} />
      <Route path={"/map/*"} element={<MapRoute />} />
      <Route path={"/plan/*"} element={<PlanRoute />} />
      <Route path={"/emissions/*"} element={<EmissionRoute />} />
      <Route path={"/production/*"} element={<ProductionRoute />} />
      <Route path={"/tutorial"} element={<TutorialRoute />} />
      <Route path={"/summary"} element={<GameOverDialog />} />
      <Route path={"/data/*"} element={<DataViewRoute />} />
      <Route path={"*"} element={<h2>Not Found</h2>} />
    </Routes>
  );
}

/**
 * The root component for the entire application.
 * 
 * It manages global state such as the current year and phase-out schedule
 * using sessionStorage (via useSessionState), and provides these values
 * through ApplicationContext to all child components.
 *
 * This component also defines logic for progressing through the game/simulation timeline
 * and restarting the simulation entirely.
 *
 * Structure:
 * - <ApplicationHeader /> → top navigation/header
 * - <main> → contains routed pages via <ApplicationRoutes />
 * - <ApplicationFooter /> → bottom navigation/footer
 */
export function Application() {
  // Persist the current year across sessions (initially "2025")
  const [year, setYear] = useSessionState<Year>("year", "2025");
  // Persist the current phase-out schedule (initially empty)
  const [phaseOut, setPhaseOut] = useSessionState<PhaseOutSchedule>(
    "phaseOutSchedule",
    {},
  );
  // Persist the current phase-out draft selection
  const [phaseOutDraft, setPhaseOutDraft] = useSessionState<PhaseOutSchedule>(
    "phaseOutDraftSchedule",
    {},
  );
  const navigate = useNavigate();

  /**
   * Advances the simulation to the next 4-year period.
   * 
   * Example: 2025 → 2028 → 2032 → ... → 2040.
   * 
   * When 2040 is reached, the app navigates to the "/summary" route.
   */
  function proceed() {
    setYear((y) => {
      const year = parseInt(y);
      // Move forward to the next multiple of 4, capped at 2040
      const nextYear = Math.min(year + 4 - (year % 4), 2040);
      if (nextYear === 2040) navigate("/summary");
      return nextYear.toString() as Year; // Return as string type Year
    });
  }

 /**
   * Resets the entire simulation back to its starting state:
   * - Year is reset to 2025
   * - All phase-out data is cleared
   * - User is navigated back to the root ("/")
   */
  function restart() {
    setYear("2025");
    setPhaseOut({});
    navigate("/");
  }

  return (
    // Context provider: makes the app state and control functions available to children
    <ApplicationContext
      value={{ year, proceed, restart, phaseOut, setPhaseOut, phaseOutDraft, setPhaseOutDraft }}
    >
      <ApplicationHeader />
      <main>
        <ApplicationRoutes />
      </main>
      <ApplicationFooter />
    </ApplicationContext>
  );
}
