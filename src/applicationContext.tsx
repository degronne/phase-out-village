import React, { Dispatch, SetStateAction } from "react";
import { Year } from "./data/types";
import { PhaseOutSchedule } from "./data/gameData";

/**
 * React context holding the global state of the application.
 *
 * Provides:
 * - `year`: the current in-game year
 * - `proceed()`: advance to the next period
 * - `restart()`: reset the simulation
 * - `phaseOut` / `setPhaseOut`: current committed phase-out schedule
 * - `phaseOutDraft` / `setPhaseOutDraft`: draft selections not yet committed
 * - `getCurrentRound()`: current round index (1-based)
 * - `getTotalRounds()`: total number of simulation rounds
 * - `startYear`, `endYear`, `yearStep`: configuration for the simulation timeline
 */
export const ApplicationContext = React.createContext<{
  year: Year;
  proceed(): void;
  restart(): void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
  /** Draft phase-out selections for the current period (not yet committed) */
  phaseOutDraft: PhaseOutSchedule;
  setPhaseOutDraft: Dispatch<SetStateAction<PhaseOutSchedule>>;
  /** Returns the current simulation round (1-based) */
  getCurrentRound(): number;
  /** Returns the total number of simulation rounds */
  getTotalRounds(): number;
   /** Starting year of the simulation */
  startYear: number;
  /** Ending year of the simulation */
  endYear: number;
  /** Step in years between simulation periods */
  yearStep: number;
  getEndOfTermYear(): number;
}>({
  // Default context values
  year: "2025",
  proceed: () => {},
  restart: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
  phaseOutDraft: {},
  setPhaseOutDraft: () => {},
  getCurrentRound: () => 1,
  getTotalRounds: () => 5,
  startYear: 2025,
  endYear: 2040,
  yearStep: 4,
  getEndOfTermYear: () => 2028,
});
