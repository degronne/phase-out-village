import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";

export function PlanSummary() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <>
      <h2>Din plan</h2>
      <div className={"charts"}>
        <div>
          <ProductionReductionChart phaseOut={phaseOut} />
        </div>
        <div>
          <EmissionStackedBarChart phaseOut={phaseOut} />
        </div>
      </div>
    </>
  );
}
