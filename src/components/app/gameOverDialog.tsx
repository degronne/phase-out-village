import React, { useContext } from "react";
import { Dialog } from "../ui/dialog";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { ApplicationContext } from "../../applicationContext";
import { mdgPlan } from "../../generated/dataMdg";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { useNavigate } from "react-router-dom";

export function GameOverDialog() {
  const { phaseOut, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  return (
    <Dialog open={true}>
      <div className={"game-over"}>
        <h2>Hvordan gikk det?</h2>
        <h3>Din plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={phaseOut} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={phaseOut} />
          </div>
        </div>
        <h3>MDG sin plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={mdgPlan} />
          </div>
          <div>
            <EmissionStackedBarChart phaseOut={mdgPlan} />
          </div>
        </div>
        <div>
          <button onClick={() => navigate("/map")}>Se over din plan</button>
        </div>
        <div>
          <button onClick={restart}>Prøv på nytt</button>
        </div>
      </div>
    </Dialog>
  );
}
