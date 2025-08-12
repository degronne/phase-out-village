import React, { Dispatch, SetStateAction } from "react";
import { Year } from "./data/types";
import { PhaseOutSchedule } from "./data/gameData";

export const ApplicationContext = React.createContext<{
  year: Year;
  proceed(): void;
  restart(): void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
}>({
  year: "2025",
  proceed: () => {},
  restart: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
});
