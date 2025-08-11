import React, { useContext } from "react";
import { EmissionStackedBarChart } from "./emissionStackedBarChart";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";

export function EmissionStackedBarRoute() {
  const { phaseOut } = useContext(ApplicationContext);
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
