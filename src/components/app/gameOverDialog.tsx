import React, { useContext, useEffect, useCallback } from "react";
import { Dialog } from "../ui/dialog";
import { ProductionReductionChart } from "../production/productionReductionChart";
import { ApplicationContext } from "../../applicationContext";
import { mdgPlan } from "../../generated/dataMdg";
import { EmissionStackedBarChart } from "../emissions/emissionStackedBarChart";
import { useLocation, useNavigate } from "react-router-dom";

export function GameOverDialog() {
  const { phaseOut, restart } = useContext(ApplicationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/map";
  const [isMounted, setIsMounted] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    // Ensures that the dialog is only shown when the route is /summary
    setOpen(location.pathname === "/summary");
  }, [location.pathname]);

  // Set mounted state on initial render
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Sync open state with route
  useEffect(() => {
    if (isMounted) {
      setOpen(location.pathname === "/summary");
    }
  }, [location.pathname, isMounted]);

  const handleClose = useCallback(() => {
    if (!isMounted) return;
    setOpen(false);
    // Use setTimeout to ensure state update is processed before navigation
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 0);
  }, [from, navigate, isMounted]);
  const handleViewPlan = useCallback(() => {
    if (!isMounted) return;
    setOpen(false);
    setTimeout(() => {
      navigate("/map", { replace: true });
    }, 0);
  }, [navigate, isMounted]);

  const handleRestart = useCallback(() => {
    if (!isMounted) return;
    setOpen(false);
    setTimeout(() => {
      restart();
      navigate("/", { replace: true });
    }, 0);
  }, [navigate, restart, isMounted]);

  // Don't render anything if not at the summary route
  if (location.pathname !== "/summary") {
    return null;
  }
  return (
    <Dialog open={open} onClose={handleClose}>
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
        <div className="button-row">
          <div>
            <button onClick={handleViewPlan}>Se over din plan</button>
          </div>
          <div>
            <button onClick={handleRestart}>Prøv på nytt</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
