import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { EmissionForAllFieldsPage } from "../emissions/emissionsForAllFieldsPage";
import { EmissionSummaryPage } from "../emissions/emissionSummaryPage";
import { ProductionSummaryPage } from "../production/productionSummaryPage";

/**
 * Displays a summary of the user's plan, including charts for
 * production reduction and emission over time based on the phase-out schedule.
 */
export function PlanSummary() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem", }}>
      <h2>
        Din plan
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        <div className={"charts"} style={{ gap: "2rem", }}>
          <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
            <ProductionReductionChart phaseOut={phaseOut} />
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
            <EmissionStackedBarChart phaseOut={phaseOut} />
          </div>
        </div>
        <div style={{ height: "1px", backgroundColor: "grey", opacity: "0.5" }}></div>
        <h2>
          Utslipp
        </h2>
        <div>
          <EmissionSummaryPage phaseOut={phaseOut} />
        </div>
        <div style={{ height: "1px", backgroundColor: "grey", opacity: "0.5" }}></div>
        <h2>
          Produksjon
        </h2>
        <div>
          <ProductionSummaryPage />
        </div>

      </div>

      {/* <div className={"charts"}>
        <div>
          <ProductionReductionChart phaseOut={phaseOut} />
        </div>
        <div>
          <EmissionStackedBarChart phaseOut={phaseOut} />
        </div>
      </div> */}
    </div>
  );
}
