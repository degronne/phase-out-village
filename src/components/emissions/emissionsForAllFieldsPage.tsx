import React from "react";
import { Link } from "react-router-dom";
import { EmissionForAllFieldsChart } from "./emissionsForAllFieldsChart";

import { PhaseOutSchedule } from "../../data/gameData";

/**
 * Page showing line chart for total annual emissions.
 *
 * @param props.phaseOut - Object describing phased-out fields.
 */
export function EmissionForAllFieldsPage({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <EmissionForAllFieldsChart phaseOut={phaseOut} />
      </div>
    </>
  );
}
