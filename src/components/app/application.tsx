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
import { OnboardingRoute } from "./onboardingRoute";

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path={"/onboarding"} element={<OnboardingRoute />} />
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

export function Application() {
  const [year, setYear] = useSessionState<Year>("year", "2025");
  const [phaseOut, setPhaseOut] = useSessionState<PhaseOutSchedule>(
    "phaseOutSchedule",
    {},
  );
  const navigate = useNavigate();

  function proceed() {
    setYear((y) => {
      const year = parseInt(y);
      const nextYear = Math.min(year + 4 - (year % 4), 2040);
      if (nextYear === 2040) navigate("/summary");
      return nextYear.toString() as Year;
    });
  }

  function restart() {
    setYear("2025");
    setPhaseOut({});
    navigate("/");
  }

  return (
    <ApplicationContext
      value={{ year, proceed, restart, phaseOut, setPhaseOut }}
    >
      <ApplicationHeader />
      <main>
        <ApplicationRoutes />
      </main>
      <ApplicationFooter />
    </ApplicationContext>
  );
}
