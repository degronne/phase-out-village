import React from "react";
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
