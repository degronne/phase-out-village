import React, { useContext, useMemo } from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { ApplicationContext } from "../../applicationContext";
import { EmissionIntensityChart } from "./emissionIntensityChart";
import { calculateTotalEmissions } from "../../data/calculateTotalEmissions";
import { data } from "../../generated/data";

export function EmissionSummaryPage() {
  const { year, phaseOut } = useContext(ApplicationContext);
  const allFields = Object.keys(data);
  const userPlan = useMemo(
    () => calculateTotalEmissions(allFields, data, phaseOut),
    [data, phaseOut],
  );
  const baseline = useMemo(
    () => calculateTotalEmissions(allFields, data, {}),
    [data],
  );
  return (
    <div className={"charts"}>
      <div>
        <EmissionStackedBarChart userPlan={userPlan} baseline={baseline} />
      </div>
      <div>
        <EmissionIntensityChart year={year} phaseOut={phaseOut} />
      </div>
    </div>
  );
}
