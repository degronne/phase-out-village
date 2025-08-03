import React, { useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { MapRoute } from "../map/mapRoute";
import { generateCompleteData } from "../../utils/projections";
import { data } from "../../generated/data";
import { ApplicationContext } from "../../applicationContext";
import { FrontPage } from "./frontPage";
import { PhaseOutRoute } from "../phaseout/phaseOutRoute";
import { ProductionRoute } from "../production/productionRoute";
import { PhaseOutSchedule, Year } from "../../data";
import { useSessionState } from "../../hooks/useSessionState";
import { EmissionRoute } from "../emissions/emissionRoute";
import { ApplicationHeader } from "./applicationHeader";

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<FrontPage />} />
      <Route path={"/phaseout"} element={<PhaseOutRoute />} />
      <Route path={"/map/*"} element={<MapRoute />} />
      <Route path={"/emissions/*"} element={<EmissionRoute />} />
      <Route path={"/production/*"} element={<ProductionRoute />} />
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
  const fullData = useMemo(() => generateCompleteData(data), [data]);
  const navigate = useNavigate();

  function proceed() {
    setYear((y) => {
      const year = parseInt(y);
      const nextYear = Math.min(year + 4 - (year % 4), 2040);
      return nextYear.toString() as Year;
    });
  }

  function reset() {
    setYear("2025");
    setPhaseOut({});
    navigate("/");
  }

  return (
    <ApplicationContext
      value={{ year, proceed, fullData, data, phaseOut, setPhaseOut }}
    >
      <ApplicationHeader reset={reset} />
      <main>
        <ApplicationRoutes />
      </main>
      <footer>
        <a href="https://mdg.no/politikk/utfasing">
          <img
            src={
              "https://d1nizz91i54auc.cloudfront.net/_service/505811/display/img_version/8880781/t/1750686348/img_name/68683_505811_ba2eeb201a.png.webp"
            }
            alt={"MDG - det ER mulig"}
          />
        </a>
      </footer>
    </ApplicationContext>
  );
}
