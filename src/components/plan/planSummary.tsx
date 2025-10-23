import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { EmissionSummaryCard } from "../emissions/emissionSummaryCard";
import { EmissionForAllFieldsPage } from "../emissions/emissionsForAllFieldsPage";
import { EmissionSummaryPage } from "../emissions/emissionSummaryPage";
import { ProductionSummaryPage } from "../production/productionSummaryPage";
import { useNavigate, useLocation } from "react-router-dom";
import { ProductionSummaryCard } from "../production/productionSummaryCard";
import { gameData, oilEquivalentToBarrel, sumOverYears, totalProduction } from "../../data/gameData";

/**
 * Displays a summary of the user's plan, including charts for
 * production reduction and emission over time based on the phase-out schedule.
 */
export function PlanSummary() {
  const { phaseOut } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Emission summary data
  const years = gameData.gameYears;
  const baselineEm = sumOverYears(totalProduction({}, years), "emission");
  const resultEm = sumOverYears(totalProduction(phaseOut, years), "emission");
  const reductionEm = Math.round(((baselineEm - resultEm) / baselineEm) * 100);

  // Production summary data
  const baselinePr = sumOverYears(totalProduction({}, gameData.gameYears), "totalProduction",);
  const resultPr = sumOverYears(totalProduction(phaseOut, gameData.gameYears), "totalProduction",);
  const reductionPr = Math.round(((baselinePr - resultPr) / baselinePr) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem", }}>
      <div style={{ position: "absolute", placeSelf: "end", }}>
        <button
          onClick={() => navigate("/map", { state: { from: location } })}
          title="Tilbake"
        >
          X
        </button>
      </div>

      <h2>
        Din plan
      </h2>

      <div>
        <div>
          {Math.round(resultEm / 1_000_000)}
          &nbsp;millioner&nbsp;tonn&nbsp;CO₂{" "}
          <span title={baselineEm.toString()}> (-{reductionEm}%)</span>
        </div>
      <div>
        {Math.round(((resultPr * oilEquivalentToBarrel) / 1_000) * 10) / 10}&nbsp;milliarder&nbsp;fat{" "}
        <span title={baselinePr.toFixed(2)}>(-{reductionPr}%)</span>
      </div>
        {/* <EmissionSummaryCard />
        <ProductionSummaryCard /> */}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        <div className={"charts"} style={{ gap: "2rem", }}>
          <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem" }}>
            <ProductionReductionChart phaseOut={phaseOut} />
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem" }}>
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
