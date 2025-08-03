import React, { Dispatch, SetStateAction } from "react";
import { OilFieldDataset } from "./types/types";
import { data } from "./generated/data";
import { OilfieldName, PhaseOutSchedule, Year } from "./data";

export const ApplicationContext = React.createContext<{
  year: Year;
  proceed(): void;
  restart(): void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
  fullData: OilFieldDataset;
  data: OilFieldDataset;
}>({
  year: "2025",
  proceed: () => {},
  restart: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
  fullData: {},
  data: data,
});
