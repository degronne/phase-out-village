import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { EmissionForAllFields } from "./emissionsForAllFields";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { EmissionEfficiencyScatterChart } from "./emissionEfficiencyScatter";

export function EmissionRoute() {
  return (
    <div className="emission-chart-container">
      <Routes>
        <Route path="/" element={<Navigate to="line" replace />} />
        <Route path="line" element={<EmissionForAllFields />} />
        <Route path="bar" element={<EmissionStackedBarChart />} />
        <Route path="intensity" element={<EmissionEfficiencyScatterChart />} />
      </Routes>
    </div>
  );
}
