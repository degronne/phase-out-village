import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";
import {
  gameData,
  toTimeseries,
  truncatedDataset,
  yearsInRange,
} from "../../data/gameData";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

export function EmissionsForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

  const fieldDataset = gameData.data[field];
  const years = yearsInRange(2012, 2040);
  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Årlig utslipp fra ${field}`,
            color: textColor,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `Utslipp: ${value.toLocaleString("nb-NO")} tonn Co2`;
              },
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Tonn Co2",
              color: textColor,
            },
            beginAtZero: true,
            ticks: {
              color: textColor,
              callback: function (value: any) {
                return `${value}`;
              },
            },
          },
          x: {
            ticks: {
              color: textColor,
            }
          }
        },
      }}
      data={{
        labels: years,
        datasets: [
          {
            label: "Din plan",
            data: toTimeseries(
              truncatedDataset(fieldDataset, phaseOut[field]),
              "emission",
              years,
            ),
            borderColor: "#4a90e2",
            segment: {
              borderDash: (ctx) => (isEstimated(ctx.p1) ? [5, 5] : undefined),
            },
            pointStyle: (ctx) => (isEstimated(ctx) ? "star" : "circle"),
            backgroundColor: "rgba(74, 144, 226, 0.2)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Referanse",
            data: toTimeseries(fieldDataset, "emission", years),
            borderColor: "orange",
            segment: {
              borderDash: (ctx) => (isEstimated(ctx.p1) ? [5, 5] : undefined),
            },
            pointStyle: (ctx) => (isEstimated(ctx) ? "star" : "circle"),
            backgroundColor: "rgba(74, 144, 226, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      }}
    />
  );
}
