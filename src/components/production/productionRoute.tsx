import React from "react";
import { Route, Routes } from "react-router-dom";
import { ProductionPerFieldChart } from "./productionPerFieldChart";
import { ProductionReductionRoute } from "./productionReductionRoute";
import { YearlyTotalProductionChart } from "./yearlyOilAndGasProductionBarChart";

export function ProductionRoute() {
  return (
    <div>
      <Routes>
        <Route path={"/"} element={<ProductionReductionRoute />} />
        <Route path={"/composition"} element={<YearlyTotalProductionChart />} />
        <Route path={"/oilPerField"} element={<ProductionPerFieldChart />} />
      </Routes>
    </div>
  );
}
