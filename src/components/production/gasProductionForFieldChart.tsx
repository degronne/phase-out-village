import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { calculateGasProduction } from "../../data";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";

export function GasProductionForFieldChart({ field }: { field: string }) {
  const { data, phaseOut } = useContext(ApplicationContext);

  const userPlan = calculateGasProduction(data[field], phaseOut[field]);
  const baseLine = calculateGasProduction(data[field], undefined);
  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Årlig gassproduksjon fra ${field}`,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `Gass: ${value.toLocaleString("nb-NO")} G SM3`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return `${value.toFixed(1)} G SM3`;
              },
            },
          },
          x: {},
        },
      }}
      data={{
        labels: baseLine.map(([y, ..._]) => y),
        datasets: [
          {
            label: "Din plan",
            data: userPlan,
            borderColor: "#4a90e2",
            segment: {
              borderDash: (ctx) => {
                return isEstimated(ctx.p1) ? [5, 5] : undefined;
              },
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
