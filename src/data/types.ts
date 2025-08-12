import { data } from "../generated/data";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Year = `19${Digit}${Digit}` | `20${Digit}${Digit}`;

export type OilfieldName = keyof typeof data;
export type DataValue = { value: number; estimate?: boolean };

export type PhaseOutSchedule = Partial<Record<OilfieldName, Year>>;
