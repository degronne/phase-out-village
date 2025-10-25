import { Bar } from "react-chartjs-2";
import React from "react";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import {
  gameData,
  numberSeries,
  PhaseOutSchedule,
  totalProduction,
} from "../../data/gameData";

/**
 * Creates a diagonal striped pattern to use as a chart background.
 * Useful for visualizing reductions or differences in stacked charts.
 *
 * @param color - The color of the stripes.
 * @param background - The background color behind the stripes.
 * @returns A CanvasPattern object if canvas context is available, otherwise the input color string.
 */
function createStipedPattern(
  color: string,
  background: string,
): CanvasPattern | string {
  // Create an offscreen canvas for pattern drawing
  const stripes = document.createElement("canvas");
  stripes.width = 10;
  stripes.height = 10;
  const ctx = stripes.getContext("2d");

  if (!ctx) return color;

  // Fill background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, stripes.width, stripes.height);

  // Draw diagonal stripe
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(10, 0);
  ctx.stroke();

  return ctx.createPattern(stripes, "repeat") as CanvasPattern;
}

/**
 * Displays a stacked bar chart showing total production and reduction per year for all fields.
 * - Shows remaining oil and gas production from the user's plan.
 * - Shows reduction compared to baseline production.
 *
 * @param phaseOut - The phase-out schedule to calculate user plan reductions.
 */
export function ProductionReductionChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

  const userPlan = totalProduction(phaseOut); // User's plan production
  const baseline = totalProduction(); // Baseline production without any reductions

  // Extract numerical series for oil and gas from user plan
  const remainingOil = numberSeries(userPlan, "productionOil");

  // Calculate reductions compared to baseline
  const reductionOil = numberSeries(baseline, "productionOil").map((base, i) =>
    Math.max((base ?? 0) - (remainingOil[i] ?? 0), 0),
  );

  const remainingGas = numberSeries(userPlan, "productionGas");

  const reductionGas = numberSeries(baseline, "productionGas").map((base, i) =>
    Math.max((base ?? 0) - (remainingGas[i] ?? 0), 0),
  );

  console.log(gameData.gameYears);

  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: textColor } },
          title: {
            display: true,
            text: "Total produksjon fra alle felter",
            color: textColor,
            padding: {
              bottom: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${value.toLocaleString("nb-NO")}M Sm3`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "År",
              color: textColor,
            },
            ticks: {
              color: textColor,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Millioner Sm3 o.e.",
              color: textColor,
            },
            ticks: {
              color: textColor,
              callback: function (value: any) {
                const num = Number(value);
                if (window.innerWidth < 600) {
                  if (num >= 1_000_000)
                    return `${(num / 1_000_000).toFixed(0)} M`;
                  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} K`;
                }
                return num.toLocaleString("nb-NO");
              },
            },
          },
        },
      }}
      data={{
        labels: gameData.gameYears,
        datasets: [
          {
            label: "Gjenværende oljeprod.",
            data: remainingOil,
            borderColor: "#4a90e2",
            backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
            stack: "PLAN",
          },
          {
            label: "Gjenværende gasseksport",
            data: remainingGas,
            borderColor: "#E24A4A",
            backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
            stack: "PLAN",
          },
          {
            label: "Reduksjon olje",
            data: reductionOil,
            borderColor: "orange",
            backgroundColor: usePrefersDarkMode()
              ? createStipedPattern("#2A5D8F", "transparent")
              : createStipedPattern("#4DA3FF", "transparent"),
            stack: "PLAN",
          },
          {
            label: "Reduksjon gass",
            data: reductionGas,
            borderColor: "orange",
            backgroundColor: usePrefersDarkMode()
              ? createStipedPattern("#D64545", "transparent")
              : createStipedPattern("#FF3333", "transparent"),
            stack: "PLAN",
          },
        ],
      }}
    />
  );
}
