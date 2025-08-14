import React from "react";
import { Bar } from "react-chartjs-2";
import {
  gameData,
  numberSeries,
  PhaseOutSchedule,
  totalProduction,
} from "../../data/gameData";

export function EmissionStackedBarChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const userData = numberSeries(totalProduction(phaseOut), "emission");
  const baseData = numberSeries(totalProduction(), "emission");

  const reductionData = baseData.map((base, i) =>
    Math.max((base ?? 0) - (userData[i] ?? 0), 0),
  );

  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          title: {
            display: true,
            text: "Total årlig utslipp med reduksjon markert",
            padding: { bottom: 20 },
          },
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${value.toLocaleString(
                  "nb-NO",
                )} tonn`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true, title: { display: true, text: "År" } },
          y: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: "CO₂-utslipp (tonn)" },
            ticks: {
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
