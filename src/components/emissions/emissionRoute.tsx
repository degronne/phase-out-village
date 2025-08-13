import React, { useContext, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { EmissionForAllFieldsPage } from "./emissionsForAllFieldsPage";
import { EmissionIntensityPage } from "./emissionIntensityPage";
import { EmissionStackedBarRoute } from "./emissionStackedBarRoute";
import { EmissionSummaryPage } from "./emissionSummaryPage";
import { ApplicationContext } from "../../applicationContext";
import { calculateTotalEmissions } from "../../data/calculateTotalEmissions";
import { data } from "../../generated/data";

export function EmissionRoute() {
  const { phaseOut } = useContext(ApplicationContext);
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
    <div className="emission-chart-container">
      <Routes>
        <Route path="/" element={<EmissionSummaryPage />} />
        <Route
          path="line"
          element={
            <EmissionForAllFieldsPage userPlan={userPlan} baseline={baseline} />
          }
        />
        <Route
          path="bar"
          element={
            <EmissionStackedBarRoute userPlan={userPlan} baseline={baseline} />
          }
        />
        <Route path="intensity" element={<EmissionIntensityPage />} />
      </Routes>
    </div>
  );
}
