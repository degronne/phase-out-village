import React from "react";
import { Route, Routes } from "react-router-dom";
import { PlanSummary } from "./planSummary";

/**
 * Route wrapper for the plan summary page.
 * Renders PlanSummary for any subpath.
 */
export function PlanRoute() {
  return (
    <Routes>
      <Route path={"*"} element={<PlanSummary />} />
    </Routes>
  );
}
