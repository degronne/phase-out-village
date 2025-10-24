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
 * Calculates the progress percentage between 2025 and 2040
 * based on custom milestone years:
 *
 * | Year | Percent |
 * |------|----------|
 * | 2025 | 0%       |
 * | 2028 | 25%      |
 * | 2032 | 50%      |
 * | 2036 | 75%      |
 * | 2040 | 100%     |
 *
 * The function interpolates linearly between milestones
 * for intermediate years, and clamps the value to 0–100%.
 *
 * @param {number} year - The current year (e.g. 2027).
 * @returns {number} - The calculated progress percentage (0–100).
 *
 * @example
 * calculateYearPercent(2025); // 0
 * calculateYearPercent(2028); // 25
 * calculateYearPercent(2030); // 37.5
 * calculateYearPercent(2036); // 75
 * calculateYearPercent(2040); // 100
 */
// function calculateYearPercent(year: number): number {
//   // Define milestone points with corresponding percentages.
//   // These represent exact known year-to-progress mappings.

//   // OBS: Hardcoded to 2025-2040.
//   const milestones = [
//     { year: 2025, percent: 0 },
//     { year: 2028, percent: 25 },
//     { year: 2032, percent: 50 },
//     { year: 2036, percent: 75 },
//     { year: 2040, percent: 100 },
//   ];

//   // If the year is before the start, clamp to 0%.
//   if (year <= milestones[0].year) return 0;

//   // If the year is beyond the last milestone, clamp to 100%.
//   if (year >= milestones[milestones.length - 1].year) return 100;

//   // Find the two milestone years the given year falls between.
//   for (let i = 0; i < milestones.length - 1; i++) {
//     const start = milestones[i];
//     const end = milestones[i + 1];

//     if (year >= start.year && year <= end.year) {
//       // Calculate the fraction of progress between the two years.
//       const fraction = (year - start.year) / (end.year - start.year);

//       // Linearly interpolate between the milestone percentages.
//       return start.percent + fraction * (end.percent - start.percent);
//     }
//   }

//   // Fallback return (should never be reached).
//   return 0;
// }

function calculateYearPercentDynamic(currentYear: number, startYear: number, endYear: number, yearStep: number, ): number {
  const totalRounds = Math.round((endYear - startYear) / yearStep) + 1;
  const currentRound = Math.round((currentYear - startYear) / yearStep) + 1;

  // Map currentRound to 0–100%
  return ((currentRound - 1) / (totalRounds - 1)) * 100;
}

export function YearProgress() {
    const { year, startYear, endYear, yearStep } = useContext(ApplicationContext);
    // const percent = calculateYearPercent(parseInt(year));
    const percent = calculateYearPercentDynamic(parseInt(year), startYear, endYear, yearStep);

    return (
        <div style={{}}>
            <MainProgressBar value={percent} yearCurrent={parseInt(year)} yearEnd={2040} />
        </div>
    );
}
