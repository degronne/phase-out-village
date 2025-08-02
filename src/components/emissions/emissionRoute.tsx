import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { EmissionForAllFields } from "./emissionsForAllFields";
import { EmissionStackedBArChart } from "./emissionStackedBarChart";

export function EmissionRoute() {
  return (
    <div className="emission-chart-container">
      <Routes>
        <Route path="/" element={<Navigate to="line" replace />} />
        <Route path="line" element={<EmissionForAllFields />} />
        <Route path="bar" element={<EmissionStackedBArChart />} />
      </Routes>
    </div>
  );
}
