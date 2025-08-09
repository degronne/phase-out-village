import React from "react";
import { Route, Routes } from "react-router-dom";
import { EmissionForAllFieldsPage } from "./emissionsForAllFields";
import { EmissionIntensityPage } from "./emissionIntensityPage";
import { EmissionStackedBarRoute } from "./emissionStackedBarRoute";
import { EmissionSummaryPage } from "./emissionSummaryPage";

export function EmissionRoute() {
  return (
    <div className="emission-chart-container">
      <Routes>
        <Route path="/" element={<EmissionSummaryPage />} />
        <Route path="line" element={<EmissionForAllFieldsPage />} />
        <Route path="bar" element={<EmissionStackedBarRoute />} />
        <Route path="intensity" element={<EmissionIntensityPage />} />
      </Routes>
    </div>
  );
}
