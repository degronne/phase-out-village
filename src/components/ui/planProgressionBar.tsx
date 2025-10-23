import React from "react";

interface PlanProgressionBarProps {
    current: number; // Current value (e.g. current emissions or production)
    baseline: number; // Baseline value representing 100%
    // startColor: string; // Starting color at 100% (e.g. red or gray)
    endColor: string; // Ending color at 0% (e.g. green or blue)
    // height?: string; // Optional height of the bar (default: 16px)
    size?: "small" | "medium" | "large";
    showLabel?: boolean;
    mode: "emission" | "production";
    includeDecimal?: boolean;
    metricLabel?: string;
    barColor?: string; // The static color of the filled bar
}

/**
 * PlanProgressionBar
 *
 * Displays a horizontal progress bar where:
 * - 100% = baseline
 * - color transitions smoothly from startColor to endColor
 *   as the current value decreases
 *
 * The component is purely visual and does not render any text labels.
 */
export const PlanProgressionBar: React.FC<PlanProgressionBarProps> = ({
    current,
    baseline,
    // startColor,
    endColor,
    // height = "16px",
    size = "small",
    showLabel = true,
    mode,
    includeDecimal = false,
    metricLabel,
    barColor = "#000",
}) => {

    let heightPixels = "16px";
    switch (size) {
        case "small": heightPixels = "16px"; break;
        case "medium": heightPixels = "24px"; break;
        case "large": heightPixels = "32px"; break;
        default: heightPixels = "16px"; break;
    }

    const progress = Math.min(current / baseline, 1); // clamp between 0–1

    const baselineRounded = Math.round(baseline / (mode == "emission" ? 1_000_000 : 1_000));
    const baselineRoundedWithDecimal = Math.round(baseline / (mode == "emission" ? 1_000_000 : 1_000) * 10) / 10;
    const currentRounded = Math.round(current / (mode == "emission" ? 1_000_000 : 1_000));
    const currentRoundedWithDecimal = Math.round(current / (mode == "emission" ? 1_000_000 : 1_000) * 10) / 10;
    const reductionPr = Math.round(((current - baseline) / baseline) * 100);

    // Opacity increases as progress decreases (so more color shows as we reduce)
    const opacity = 1 - progress;

    // Compute fade-in/out opacity for middle label
    let labelOpacity = 1;
    const percent = progress * 100;

    // Fade in between 5–15%
    if (percent < 5) {
        labelOpacity = 0;
    } else if (percent < 15) {
        labelOpacity = (percent - 5) / 10; // 0 → 1 between 5–15
    }

    // Fade out between 85–95%
    else if (percent > 95) {
        labelOpacity = 0;
    } else if (percent > 85) {
        labelOpacity = 1 - ((percent - 85) / 10); // 1 → 0 between 85–95
    }

    labelOpacity = Math.max(0, Math.min(labelOpacity, 1));

    return (
        <div
            style={{
                position: "relative",
                backgroundColor: "black",
                borderRadius: "8px",
                height: heightPixels,
                overflow: "hidden",
                width: "100%",
                transition: "background-color 0.5s ease",
            }}
        >

            {/* Filled portion */}
            <div
                style={{
                    width: `${progress * 100}%`,
                    height: "100%",
                    backgroundColor: barColor,
                    transition: "width 0.5s ease, background-color 0.5s ease",
                    zIndex: 1,
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
                        justifyContent: "left",
                        color: "#e6e6e6ff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        paddingLeft: "0.25rem",
                        paddingRight: "0.25rem",
                        pointerEvents: "none", // allows clicks through the label
                        zIndex: "2",
                    }}
                >
                    {`${progress * 100 >= 100 ? '' : includeDecimal ? currentRoundedWithDecimal : currentRounded}`}
                </div>
            )}

            {/* Middle label */}
            {showLabel && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: `${progress * 100}%`,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                        color: "#e6e6e6ff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        paddingLeft: "0.25rem",
                        paddingRight: "0.25rem",
                        pointerEvents: "none", // allows clicks through the label
                        zIndex: "2",
                        opacity: labelOpacity,
                        transition: "left 0.5s ease, opacity 0.5s ease",
                    }}
                >
                    {`${progress * 100 >= 100 ? '' : reductionPr}%`}
                </div>
            )}

            {/* Right label */}
            {showLabel && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        color: progress * 100 >= 100 ? 'white' : "#ffffff88",
                        fontWeight: 600,
                        fontSize: "1rem",
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5em",
                        pointerEvents: "none", // allows clicks through the label
                        zIndex: "2",
                    }}
                >
                    {`${includeDecimal ? baselineRoundedWithDecimal : baselineRounded}`}
                </div>
            )}

            {/* Unfilled colored overlay (only the remaining part) */}
            <div
                style={{
                    position: "absolute",
                    left: `${progress * 100}%`,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: endColor,
                    opacity,
                    transition: "opacity 0.5s ease, left 0.5s ease",
                    zIndex: 0,
                }}
            />

        </div>
    )
}