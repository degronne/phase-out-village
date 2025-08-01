import React from "react";
import { ProductionTable } from "../tables/productionTable";
import { Route, Routes } from "react-router-dom";
import { ProductionPerFieldChart } from "./productionPerFieldChart";
import { YearlyTotalOilProductionChart } from "./yearlyTotalOilProduction";
import { TotalProduction } from "./totalProduction";
import { ProductionReductionChart } from "./productionReductionChart";
import { YearlyTotalProductionChart } from "./yearlyOilAndGasProductionBarChart";

export function ProductionRoute() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<TotalProduction />} />
        <Route path={"/old"} element={<ProductionTable />} />
        <Route path={"/totalOil"} element={<YearlyTotalOilProductionChart />} />
        <Route path={"/oilPerField"} element={<ProductionPerFieldChart />} />
      </Routes>
      <div className="production-chart-container">
        <ProductionReductionChart />
        <YearlyTotalProductionChart />
      </div>
    </div>
  );
}
