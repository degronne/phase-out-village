import React, { Dispatch, SetStateAction } from "react";
import { OilFieldDataset } from "./types/types";
import { data } from "./generated/data";
import { OilfieldName, PhaseOutSchedule, Year } from "./data";

export const ApplicationContext = React.createContext<{
  year: Year;
  proceed: () => void;
  phaseOut: PhaseOutSchedule;
  setPhaseOut: Dispatch<SetStateAction<PhaseOutSchedule>>;
  fullData: OilFieldDataset;
  data: Record<
    OilfieldName,
    Record<
      Year,
      {
        productionOil?: number;
        productionGas?: number;
        emission?: number;
        emissionIntensity?: number;
      }
    >
  >;
}>({
  year: "2025",
  proceed: () => {},
  phaseOut: {},
  setPhaseOut: () => {},
  fullData: {},
  data: data,
});
