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
import { PlanProgressionBar } from "../ui/planProgressionBar";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

/**
 * Displays a summary of the user's plan, including charts for
 * production reduction and emission over time based on the phase-out schedule.
 */
export function PlanSummary() {
  const { year, phaseOut } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isSmall = useIsSmallScreen();
  const isDarkMode = usePrefersDarkMode();

  // Emission summary data
  const years = gameData.gameYears;
  const baselineEm = sumOverYears(totalProduction({}, years), "emission");
  const baselineEmRounded = Math.round(baselineEm / 1_000_000); // In millions of tons 
  const currentEm = sumOverYears(totalProduction(phaseOut, years), "emission");
  const currentEmRounded = Math.round(currentEm / 1_000_000); // In millions of tons  
  const reductionEm = Math.round(((currentEm - baselineEm) / baselineEm) * 100);
  const preventedEmRounded = Math.round((baselineEm - currentEm) / 1_000_000);
  const reductionEmPositive = Math.round(((baselineEm - currentEm) / baselineEm) * 100);

  // Production summary data
  const baselinePr = sumOverYears(totalProduction({}, gameData.gameYears), "totalProduction",);
  const baselinePrCalc = baselinePr * oilEquivalentToBarrel;
  const baselinePrRounded = Math.round(((baselinePrCalc) / 1_000) * 10) / 10;
  const currentPr = sumOverYears(totalProduction(phaseOut, gameData.gameYears), "totalProduction",);
  const currentPrCalc = currentPr * oilEquivalentToBarrel;
  const currentPrRounded = Math.round(((currentPrCalc) / 1_000) * 10) / 10;
  const reductionPr = Math.round(((currentPrCalc - baselinePrCalc) / baselinePrCalc) * 100);
  const preventedPrRounded = Math.round(((baselinePrCalc - currentPrCalc) / 1_000) * 10) / 10;
  const reductionPrPositive = Math.round(((baselinePrCalc - currentPrCalc) / baselinePrCalc) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem", }}>
      <div style={{ position: "absolute", placeSelf: "end", zIndex: "3" }}>
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

      <div style={{ 
        width: "100%", 
        display: "flex", 
        flexDirection: isSmall ? "column" : "row", 
        gap: isSmall ? "1.5rem" : "2rem", 
        marginTop: isSmall ? "1rem" : "1.5rem", 
        marginBottom: isSmall ? "1rem" : "1.5rem",
      }}>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", padding: "1rem", border: "1px solid #e0ffb2", borderRadius: "0.5rem" }}>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "1.25em", marginBottom: "0.5rem" }}>Utslippsredusering</div>
            <div style={{ marginBottom: "1.5rem" }}>
              Uten inngrep vil oljefeltene produsere <strong style={{ color: isDarkMode ? "white" : "black" }}>{baselineEmRounded} millioner tonn CO₂</strong> innen {gameData.allYears[gameData.allYears.length - 1]}.
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              Din plan har så langt redusert utslipp med <strong style={{ color: isDarkMode ? "white" : "black" }}>{preventedEmRounded} millioner tonn CO₂ ({reductionEmPositive}%)</strong>{parseInt(year) > 2025 ? '!' : '.'}
            </div>
            <div style={{ marginBottom: "0.25rem" }}>
              <PlanProgressionBar
                current={currentEm}
                baseline={baselineEm}
                mode="emission"
                includeDecimal={true}
                metricLabel={`millioner tonn CO₂`}
                size="medium"
                barColor="hsla(0, 83%, 34%, 1.00)"
                endColor="hsla(120, 99%, 32%, 1.00)"
                showMiddlePercentage={true}
                rightLabelType="prevented"
              />
            </div>
          </div>
        </div>

        <div style={{ width: "100%", flexDirection: "column", padding: "1rem", border: "1px solid #e0ffb2", borderRadius: "0.5rem" }}>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "1.25em", marginBottom: "0.5rem" }}>Produksjonsredusering</div>
            <div style={{ marginBottom: "1.5rem" }}>
              Uten inngrep vil oljefeltene produsere <strong style={{ color: isDarkMode ? "white" : "black" }}>{baselinePrRounded} milliarder fat olje</strong> innen {gameData.allYears[gameData.allYears.length - 1]}.
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              Din plan har så langt redusert produksjonen med <strong style={{ color: isDarkMode ? "white" : "black" }}>{preventedPrRounded} milliarder fat olje ({reductionPrPositive}%)</strong>{parseInt(year) > 2025 ? '!' : '.'}
            </div>
            <div style={{ marginBottom: "0.25rem" }}>
              <PlanProgressionBar
                current={currentPrCalc}
                baseline={baselinePrCalc}
                mode="production"
                includeDecimal={true}
                metricLabel={`milliarder fat olje`}
                size="medium"
                barColor="hsla(0, 0%, 23%, 1.00)"
                endColor="hsla(207, 100%, 47%, 1.00)"
                showMiddlePercentage={true}
                rightLabelType="prevented"
              />
            </div>
          </div>
        </div>

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

    </div>
  );
}
