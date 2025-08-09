import React, { useContext, useMemo } from "react";
import { Dialog } from "../ui/dialog";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { ApplicationContext } from "../../applicationContext";
import { mdgPlan } from "../../generated/dataMdg";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { useNavigate } from "react-router-dom";
import { data } from "../../generated/data";
import { calculateTotalEmissions } from "../../data/calculateTotalEmissions";

export function GameOverDialog() {
  const { phaseOut, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const allFields = Object.keys(data);
  const userPlan = useMemo(
    () => calculateTotalEmissions(allFields, data, phaseOut),
    [data, phaseOut],
  );
  const mdg = useMemo(
    () => calculateTotalEmissions(allFields, data, mdgPlan),
    [data],
  );
  const baseline = useMemo(
    () => calculateTotalEmissions(allFields, data, {}),
    [data],
  );
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
            <EmissionStackedBarChart userPlan={userPlan} baseline={baseline} />
          </div>
        </div>
        <h3>MDG sin plan</h3>
        <div className={"charts"}>
          <div>
            <ProductionReductionChart phaseOut={mdgPlan} />
          </div>
          <div>
            <EmissionStackedBarChart userPlan={mdg} baseline={baseline} />
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
