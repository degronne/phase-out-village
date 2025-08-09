import React, { Dispatch, SetStateAction } from "react";
import { OilFieldDataset } from "./types/types";
import { data } from "./generated/data";
import { PhaseOutSchedule, Year } from "./data";

export const ApplicationContext = React.createContext<{
  year: Year;
  proceed(): void;
  restart(): void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
  data: OilFieldDataset;
}>({
  year: "2025",
  proceed: () => {},
  restart: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
  data: data,
});
