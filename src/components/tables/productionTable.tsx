import { data } from "../../generated/data";
import React, { useContext } from "react";
import { useState } from "react";
import { productionProjections } from "../../utils/projections";
import { YearlyTotalGasProductionChart } from "../charts/yearlyTotalGasProduction";
import { YearlyTotalProductionChart } from "../production/yearlyOilAndGasProductionBarChart";
import {
  calculateTotalYearlyGasProduction,
  calculateTotalYearlyOilProduction,
} from "../../utils/calculations";
import { ShutdownMap } from "../../types/types";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { YearlyTotalOilProductionChart } from "../production/yearlyTotalOilProduction";

export function ProductionTable() {
  const debug = localStorage.getItem("debug") === "true";
  const [view, setView] = useState<"oil" | "gas" | "both">("oil");
  const { fullData } = useContext(ApplicationContext);

  const oilFields = Object.keys(data);
  const projections = productionProjections(data);

  const shutdowns: ShutdownMap = {};
  const totalOilProduction = calculateTotalYearlyOilProduction(
    fullData,
    shutdowns,
  );
  const totalGasProduction = calculateTotalYearlyGasProduction(
    fullData,
    shutdowns,
  );

  const years = new Set<string>();
  for (const oilField of oilFields) {
    Object.keys(data[oilField]).forEach((y) => years.add(y));
  }

  for (const proj of projections) {
    years.add(proj.year.toString());
  }

  const allYears = [...years].sort();

  return (
    <div>
      <nav>
        <Link to={"./totalOil"}>Total produksjon olje</Link>
        <Link to={"./oilPerField"}>Oljeproduksjon per felt</Link>
      </nav>
      <YearlyTotalOilProductionChart />
      <YearlyTotalGasProductionChart data={totalGasProduction} />
      <YearlyTotalProductionChart />
      <h2>Årlige produksjonstall</h2>
      <div className="production-view-toggle-button">
        <button
          className={view === "oil" ? "active" : ""}
          onClick={() => setView("oil")}
        >
          Olje
        </button>
        <button
          className={view === "gas" ? "active" : ""}
          onClick={() => setView("gas")}
        >
          Gass
        </button>
      </div>
      {debug && <button>Last ned</button>}
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>År</th>
            {oilFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allYears.map((year) => (
            <tr key={year}>
              <td className="year">{year}</td>
              {oilFields.map((field, idx) => {
                const raw = data[field]?.[year];
                const proj = projections.find(
                  (p) => p.oilFieldName === field && p.year.toString() === year,
                );

                const production =
                  view === "oil"
                    ? (raw?.productionOil ?? proj?.productionOil ?? "-")
                    : (raw?.productionGas ?? proj?.productionGas ?? "-");

                const emission = raw?.emission ?? proj?.emission ?? "-";

                return (
                  <td
                    key={field}
                    className={`${idx > 0 ? "field-separator" : ""} sub-separator ${
                      Number(year) >= 2023 &&
                      raw?.[
                        view === "oil" ? "productionOil" : "productionGas"
                      ] === undefined &&
                      proj?.[
                        view === "oil" ? "productionOil" : "productionGas"
                      ] !== null
                        ? "projected"
                        : ""
                    }`}
                  >
                    {production}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
