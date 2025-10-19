import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { ProductionPerFieldPage } from "./productionPerFieldPage";
import { YearlyTotalProductionChart } from "./yearlyTotalProductionChart";
import { ProductionSummaryPage } from "./productionSummaryPage";

/**
 * Defines the routing for the production section of the app.
 * - "/" -> Production summary page
 * - "/composition" -> Yearly total production chart with navigation links
 * - "/oilPerField" -> Production per field page
 */
export function ProductionRoute() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<ProductionSummaryPage />} />
        <Route
          path={"/composition"}
          element={
            <div className="production-chart">
              <nav className="production-nav">
                <Link to={"/production/"}>Din plan</Link>
                <Link to={"/production/composition"}>Inndeling produksjon</Link>
                <Link to={"/production/oilPerField"}>Produksjon per felt</Link>
              </nav>
              <YearlyTotalProductionChart />
            </div>
          }
        />
        <Route path={"/oilPerField"} element={<ProductionPerFieldPage />} />
      </Routes>
    </div>
  );
}
