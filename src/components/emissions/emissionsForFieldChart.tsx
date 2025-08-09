import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { calculateEmissions } from "../../data/data";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";
import { data } from "../../generated/data";

export function EmissionsForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Årlig utslipp fra ${field}`,
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
            },
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return `${value}`;
              },
            },
          },
        },
      }}
      data={{
        labels: calculateEmissions(data[field], undefined).map(([y]) => y),
        datasets: [
          {
            label: "Din plan",
            data: calculateEmissions(data[field], phaseOut[field]),
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
            data: calculateEmissions(data[field], undefined),
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
