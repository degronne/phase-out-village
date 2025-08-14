import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { EmissionForAllFieldsPage } from "./emissionsForAllFieldsPage";
import { EmissionIntensityPage } from "./emissionIntensityPage";
import { EmissionStackedBarRoute } from "./emissionStackedBarRoute";
import { EmissionSummaryPage } from "./emissionSummaryPage";
import { ApplicationContext } from "../../applicationContext";

export function EmissionRoute() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div className="emission-chart-container">
      <Routes>
        <Route path="/" element={<EmissionSummaryPage phaseOut={phaseOut} />} />
        <Route
          path="line"
          element={<EmissionForAllFieldsPage phaseOut={phaseOut} />}
        />
        <Route
          path="bar"
          element={<EmissionStackedBarRoute phaseOut={phaseOut} />}
        />
        <Route path="intensity" element={<EmissionIntensityPage />} />
      </Routes>
    </div>
  );
}
