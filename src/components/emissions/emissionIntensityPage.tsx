import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { EmissionIntensityChart } from "./emissionIntensityChart";

export function EmissionIntensityPage() {
  const { phaseOut, year } = useContext(ApplicationContext);
  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <EmissionIntensityChart year={year} phaseOut={phaseOut} />
      </div>
    </>
  );
}
