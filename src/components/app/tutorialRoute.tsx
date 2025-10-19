import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "../ui/dialog";
import { TutorialDialog } from "./tutorialDialog";

/**
 * TutorialRoute component renders a TutorialDialog inside a Dialog modal.
 *
 * Uses React Router's useNavigate and useLocation to return to the previous route
 * after the tutorial is closed.
 */
export function TutorialRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract the "from" route from the location state.
  // This is the page from which the tutorial was opened.
  const rawFrom = (location.state as any)?.from;
  let from = "/map"; // Default fallback route if no valid "from" is found

  // Check if `rawFrom` is a string
  if (typeof rawFrom === "string") {
    // Only accept paths starting with "/"
    if (rawFrom.startsWith("/")) from = rawFrom;
  // If `rawFrom` is an object (likely a location object), check its pathname property
  } else if (rawFrom && typeof rawFrom.pathname === "string") {
    // Only accept pathname that starts with "/"
    if (rawFrom.pathname.startsWith("/")) from = rawFrom.pathname;
  }

  return (
    <Dialog
      open={true}
      onClose={() => navigate(from)}
      className="tutorial-modal"
    >
      <TutorialDialog onClose={() => navigate(from)} />
    </Dialog>
  );
}
