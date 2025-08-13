import React from "react";
import { Route, Routes } from "react-router-dom";
import { PlanSummary } from "./planSummary";

export function PlanRoute() {
  return (
    <Routes>
      <Route path={"*"} element={<PlanSummary />} />
    </Routes>
  );
}
