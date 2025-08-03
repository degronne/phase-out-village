import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { calculateEmissions } from "../../data";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";

export function EmissionsForFieldChart({ field }: { field: string }) {
  const { data, phaseOut } = useContext(ApplicationContext);

  const userPlan = calculateEmissions(data[field], phaseOut[field]);
  const baseLine = calculateEmissions(data[field], undefined);
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
        labels: baseLine.map(([y]) => y),
        datasets: [
          {
            label: "Din plan",
            data: userPlan,
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
            data: baseLine,
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
