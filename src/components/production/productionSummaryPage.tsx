import React, { useContext } from "react";
import { YearlyTotalProductionChart } from "./yearlyTotalProductionChart";
import { ProductionReductionChart } from "./productionReductionChart";
import { ApplicationContext } from "../../applicationContext";

export function ProductionSummaryPage() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div className={"charts"}>
      <div>
        <YearlyTotalProductionChart />
      </div>
      <div>
        <ProductionReductionChart phaseOut={phaseOut} />
      </div>
    </div>
  );
}
