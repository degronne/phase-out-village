import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { ProductionReductionChart } from "./productionReductionChart";

export function ProductionReductionRoute() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <>
      <nav className="production-nav">
        <Link to={"./"}>Din plan</Link>
        <Link to={"/production/composition"}>Inndeling produksjon</Link>
        <Link to={"/production/oilPerField"}>Produksjon per felt</Link>
      </nav>
      <div className={"production-chart"}>
        <ProductionReductionChart phaseOut={phaseOut} />
      </div>
    </>
  );
}
