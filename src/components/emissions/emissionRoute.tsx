import React from "react";
import { Route, Routes } from "react-router-dom";
import { EmissionForAllFields } from "./emissionsForAllFields";
import { EmissionStackedBArChart } from "./emissionStackedBarChart";

export function EmissionRoute() {
  return (
    <div className="emission-chart-container">
      <EmissionForAllFields />
      <EmissionStackedBArChart />
    </div>
  );
}
