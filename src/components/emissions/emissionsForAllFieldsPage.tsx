import React from "react";
import { Link } from "react-router-dom";
import { EmissionForAllFieldsChart } from "./emissionsForAllFieldsChart";
import { TimeSerieValue } from "../../data/data";

export function EmissionForAllFieldsPage({
  userPlan,
  baseline,
}: {
  userPlan: TimeSerieValue[];
  baseline: TimeSerieValue[];
}) {
  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <EmissionForAllFieldsChart userPlan={userPlan} baseline={baseline} />
      </div>
    </>
  );
}
