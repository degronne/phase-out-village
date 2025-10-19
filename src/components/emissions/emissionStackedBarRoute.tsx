import React from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { Link } from "react-router-dom";
import { PhaseOutSchedule } from "../../data/gameData";

/**
 * Page showing the stacked bar chart for total annual emissions.
 *
 * @param props.phaseOut - Object describing phased-out fields.
 */
export function EmissionStackedBarRoute({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  return (
    <>
      <nav className="emission-nav">
        <Link to={"/emissions/line"}>Linjediagram</Link>
        <Link to={"./"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <EmissionStackedBarChart phaseOut={phaseOut} />
      </div>
    </>
  );
}
