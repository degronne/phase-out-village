import React from "react";
import { Bar } from "react-chartjs-2";
import {
  gameData,
  numberSeries,
  PhaseOutSchedule,
  totalProduction,
} from "../../data/gameData";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

/**
 * Stacked bar chart showing total annual emissions and reductions.
 *
 * @param props.phaseOut - Object describing phased-out fields.
 */
export function EmissionStackedBarChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const userData = numberSeries(totalProduction(phaseOut), "emission");

  const reductionData = numberSeries(totalProduction(), "emission").map(
    (base, i) => Math.max((base ?? 0) - (userData[i] ?? 0), 0),
  );
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        plugins: {
          title: {
            display: true,
            text: "Total årlig utslipp med reduksjon markert",
            color: textColor,
            padding: { bottom: 20 },
          },
          legend: { display: true, labels: { color: textColor } },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${value.toLocaleString("nb-NO")} tonn`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: "År", color: textColor },
            ticks: { color: textColor },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: "CO₂-utslipp (tonn)",
              color: textColor,
            },
            ticks: {
              color: textColor,
              callback: function (value: any) {
                const n = Number(value);
                return window.innerWidth < 600
                  ? `${(n / 1_000_000).toFixed(0)}M`
                  : n.toLocaleString("nb-NO");
              },
            },
          },
        },
      }}
      data={{
        labels: gameData.gameYears,
        datasets: [
          {
            label: "Utfasingsplan",
            data: userData,
            backgroundColor: "#4a90e2",
            stack: "stack1",
          },
          {
            label: "Reduksjon",
            data: reductionData,
            backgroundColor: "rgba(200, 0, 0, 0.3)",
            borderColor: "rgba(200, 0, 0, 0.8)",
            borderWidth: 1,
            stack: "stack1",
          },
        ],
      }}
    />
  );
}
