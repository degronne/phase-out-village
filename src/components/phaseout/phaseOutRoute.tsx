import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "../ui/dialog";
import { PhaseOutDialog } from "./phaseOutDialog";
import { OilFieldMap } from "../map/oilFieldMap";
import { OilFieldMapList } from "../map/oilFieldMapList";

/**
 * Route component for the phase-out map and dialog.
 *
 * Displays the interactive oil field map and a PhaseOutDialog for selecting
 * fields to phase out. The dialog opens automatically when the route is accessed.
 * Users can close the dialog to continue interacting with the map.
 *
 * Navigation:
 * - `from` is read from location state to know where to return when closing
 *   the dialog. Defaults to "/production" if not specified.
 */
export function PhaseOutRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  // Path to navigate back to after closing the dialog
  const from = location.state?.from?.pathname || "/production";

  return (
    <div className="oilfield-map">
      <Dialog open={open} onClose={() => navigate(from)}>
        <PhaseOutDialog close={() => setOpen(false)} from={from} />
      </Dialog>
{/*       <OilFieldMap />
      <div className="details">
        <OilFieldMapList />
      </div> */}
    </div>
  );
}
