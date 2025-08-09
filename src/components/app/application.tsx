import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { MapRoute } from "../map/mapRoute";
import { ApplicationContext } from "../../applicationContext";
import { FrontPage } from "./frontPage";
import { PhaseOutRoute } from "../phaseout/phaseOutRoute";
import { ProductionRoute } from "../production/productionRoute";
import { PhaseOutSchedule, Year } from "../../data/data";
import { useSessionState } from "../../hooks/useSessionState";
import { EmissionRoute } from "../emissions/emissionRoute";
import { ApplicationHeader } from "./applicationHeader";
import { ApplicationFooter } from "./applicationFooter";
import { GameOverDialog } from "./gameOverDialog";
import { PlanRoute } from "../plan/planRoute";

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<FrontPage />} />
      <Route path={"/phaseout"} element={<PhaseOutRoute />} />
      <Route path={"/map/*"} element={<MapRoute />} />
      <Route path={"/plan/*"} element={<PlanRoute />} />
      <Route path={"/emissions/*"} element={<EmissionRoute />} />
      <Route path={"/production/*"} element={<ProductionRoute />} />
      <Route path={"/summary"} element={<GameOverDialog />} />
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
      return nextYear.toString() as Year;
    });
  }

  useEffect(() => {
    if (year === "2040") navigate("/summary");
  }, [year]);

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
