import React from "react";
import { Link } from "react-router-dom";
import { EmissionForAllFieldsChart } from "./emissionsForAllFieldsChart";

export function EmissionForAllFieldsPage() {
  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <EmissionForAllFieldsChart />
      </div>
    </>
  );
}
