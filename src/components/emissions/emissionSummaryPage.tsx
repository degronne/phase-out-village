import React, { useContext } from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { EmissionIntensityChart } from "./emissionIntensityChart";
import { PhaseOutSchedule } from "../../data/data";
import { ApplicationContext } from "../../applicationContext";

export function EmissionSummaryPage({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const { year } = useContext(ApplicationContext);
  return (
    <div className={"charts"}>
      <div>
        <EmissionStackedBarChart phaseOut={phaseOut} />
      </div>
      <div>
        <EmissionIntensityChart year={year} phaseOut={phaseOut} />
      </div>
    </div>
  );
}
