import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "../ui/dialog";
import { PhaseOutDialog } from "./phaseOutDialog";
import { OilFieldMap } from "../map/oilFieldMap";
import { OilFieldMapList } from "../map/oilFieldMapList";

export function PhaseOutRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const from = location.state?.from?.pathname || "/production";

  return (
    <div className="oilfield-map">
      <Dialog open={open} onClose={() => navigate(from)}>
        <PhaseOutDialog close={() => setOpen(false)} from={from} />
      </Dialog>
      <OilFieldMap />
      <div className="details">
        <OilFieldMapList />
      </div>
    </div>
  );
}
