import React, { useContext } from "react";
import { YearlyTotalProductionChart } from "./yearlyTotalProductionChart";
import { ProductionReductionChart } from "./productionReductionChart";
import { ApplicationContext } from "../../applicationContext";

/**
 * Displays the main production summary page.
 * Contains:
 * - Yearly total production chart
 * - Production reduction chart
 */
export function ProductionSummaryPage() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div className={"charts"} style={{ gap: "2rem",}}>
      <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
        <YearlyTotalProductionChart />
      </div>
      <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
        <ProductionReductionChart phaseOut={phaseOut} />
      </div>
    </div>
  );
}
