import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";

interface MainProgressBarProps {
    value: number; // 0–100
    yearCurrent: number;
    yearEnd: number;
    height?: number;
    colorFrom?: string;
    colorTo?: string;
    showLabel?: boolean;
}

export const MainProgressBar: React.FC<MainProgressBarProps> = ({
    value,
    yearCurrent,
    yearEnd = 2040,
    height = 20,
    colorFrom = "#a0eca0ff",
    colorTo = "#00ff15ff",
    showLabel = true,
}) => {
    const percent = Math.round(Math.min(Math.max(value, 0), 100));

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height,
                backgroundColor: "#e0e0e0",
                overflow: "hidden",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
            }}
        >
            {/* Filled section */}
            <div
                style={{
                    width: `${percent}%`,
                    height: "100%",
                    backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
                    transition: "width 1s ease",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
            />

            {/* Centered label */}
            {showLabel && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        pointerEvents: "none", // allows clicks through the label
                    }}
                >
                    {`${yearCurrent} / ${yearEnd} (${percent}%)`}
                </div>
            )}
        </div>
    );
};

/**
 * Calculates the progress percentage of the simulation dynamically.
 *
 * Maps the current year to a percentage between 0 and 100
 * based on the start year, end year, and year step.
 *
 * @param currentYear - The current in-game year (e.g., 2025)
 * @param startYear - The starting year of the simulation (e.g., 2025)
 * @param endYear - The final year of the simulation (e.g., 2040)
 * @param yearStep - The step between simulation periods (e.g., 4)
 * @returns A number between 0 and 100 representing the progress
 */
function calculateYearPercentDynamic(currentYear: number, startYear: number, endYear: number, yearStep: number, ): number {
  const totalRounds = Math.round((endYear - startYear) / yearStep) + 1;
  const currentRound = Math.round((currentYear - startYear) / yearStep) + 1;

  // Map currentRound to 0–100%
  return ((currentRound - 1) / (totalRounds - 1)) * 100;
}

export function YearProgress() {
    const { year, startYear, endYear, yearStep } = useContext(ApplicationContext);
    const percent = calculateYearPercentDynamic(parseInt(year), startYear, endYear, yearStep);

    return (
        <div style={{}}>
            <MainProgressBar value={percent} yearCurrent={parseInt(year)} yearEnd={2040} />
        </div>
    );
}
