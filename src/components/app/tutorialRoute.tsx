import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TutorialDialog } from "./tutorialDialog";
import { ErrorBoundary } from "../ui/ErrorBoundary";

export function TutorialRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = (location.state as any)?.from;
  let from = "/map";
  if (typeof rawFrom === "string") {
    if (rawFrom.startsWith("/")) from = rawFrom;
  } else if (rawFrom && typeof rawFrom.pathname === "string") {
    if (rawFrom.pathname.startsWith("/")) from = rawFrom.pathname;
  }

  return (
    <ErrorBoundary>
      <TutorialDialog open={true} onClose={() => navigate(from)} />
    </ErrorBoundary>
  );
}
