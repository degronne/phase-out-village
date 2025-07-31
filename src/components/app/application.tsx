import React, { useMemo } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { MapRoute } from "../map/mapRoute";
import { generateCompleteData } from "../../utils/projections";
import { data } from "../../generated/data";
import { ApplicationContext } from "../../applicationContext";
import { FrontPage } from "./frontPage";
import { PhaseOutRoute } from "../phaseout/phaseOutRoute";
import { ProductionRoute } from "../production/productionRoute";
import { PhaseOutSchedule, Year } from "../../data";
import { useSessionState } from "../../hooks/useSessionState";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { ProductionSummaryCard } from "../production/productionSummaryCard";
import { EmissionRoute } from "../emissions/emissionRoute";

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<FrontPage />} />
      <Route path={"/phaseout"} element={<PhaseOutRoute />} />
      <Route path={"/map/*"} element={<MapRoute />} />
      <Route path={"/emissions"} element={<EmissionRoute />} />
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
  const location = useLocation();

  function nextYear() {
    setYear((y) => (parseInt(y) + 1).toString() as Year);
  }

  function reset() {
    setYear("2025");
    setPhaseOut({});
    navigate("/");
  }

  return (
    <ApplicationContext
      value={{ year, nextYear, fullData, data, phaseOut, setPhaseOut }}
    >
      <header>
        <div>
          År: {year}
          <div>
            <button onClick={nextYear}>Neste</button>
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
              onClick={() =>
                navigate("/phaseout", { state: { from: location } })
              }
            >
              Velg felter for avvikling
            </button>
          </div>
        </div>
        <EmissionSummaryCard />
        <ProductionSummaryCard />
      </header>
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
