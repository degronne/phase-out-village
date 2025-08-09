import React, { useContext } from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { ApplicationContext } from "../../applicationContext";
import { EmissionIntensityChart } from "./emissionIntensityChart";

export function EmissionSummaryPage() {
  const { year, phaseOut } = useContext(ApplicationContext);
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
