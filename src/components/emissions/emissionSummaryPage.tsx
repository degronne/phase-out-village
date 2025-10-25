import React, { useContext } from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { EmissionIntensityChart } from "./emissionIntensityChart";
import { ApplicationContext } from "../../applicationContext";
import { PhaseOutSchedule } from "../../data/gameData";

export function EmissionSummaryPage({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const { year } = useContext(ApplicationContext);
  return (
    <div className={"charts"} style={{ gap: "2rem",}}>
      <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
        <EmissionStackedBarChart phaseOut={phaseOut} />
      </div>
      <div style={{ border: "1px solid rgba(255,255,255,0.0)", borderRadius: "0.5rem", padding: "1rem"}}>
        <EmissionIntensityChart year={year} phaseOut={phaseOut} />
      </div>
    </div>
  );
}
