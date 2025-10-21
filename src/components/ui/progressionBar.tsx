import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";

interface ProgressBarProps {
    value: number; // 0–100
    yearCurrent: number;
    yearEnd: number;
    height?: number;
    colorFrom?: string;
    colorTo?: string;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    yearCurrent,
    yearEnd = 2040,
    height = 20,
    colorFrom = "#c1e9c1ff",
    colorTo = "#00fe15ff",
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

export function YearProgress() {
    const { year } = useContext(ApplicationContext);
    const percent = ((parseInt(year) - 2025) / (2040 - 2025)) * 100;

    return (
        <div style={{}}>
            <ProgressBar value={percent} yearCurrent={parseInt(year)} yearEnd={2040} />
        </div>
    );
}
