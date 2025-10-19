import React, { Dispatch, SetStateAction } from "react";
import { Year } from "./data/types";
import { PhaseOutSchedule } from "./data/gameData";

/**
 * React context holding the global state of the application.
 *
 * Provides:
 * - `year`: the current in-game year (e.g., "2025")
 * - `proceed()`: advance to the next 4-year period, navigating to the summary page if 2040 is reached
 * - `restart()`: reset the simulation to the initial state and navigate to the start page
 * - `phaseOut`: current phase-out schedule for all oilfields
 * - `setPhaseOut`: setter function to update the phase-out schedule
 *
 * Default values are no-op functions and empty state, used only if a component consumes the
 * context outside of a provider.
 */
export const ApplicationContext = React.createContext<{
  year: Year;
  proceed(): void;
  restart(): void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
}>({
  // Default context values
  year: "2025",
  proceed: () => {},
  restart: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
});
