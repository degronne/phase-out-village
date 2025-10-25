import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";
import { gameData, toTimeseries, truncatedDataset } from "../../data/gameData";

/**
 * Line chart displaying annual gas production for a specific oil field.
 *
 * @param props.field - The name of the oil field to display gas production data for.
 */
export function GasProductionForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);
  const dataset = gameData.data[field];

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Årlig gasseksport fra ${field}`,
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
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Din plan",
            data: toTimeseries(
              truncatedDataset(dataset, phaseOut[field]),
              "productionGas",
            ),
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
            data: toTimeseries(dataset, "productionGas"),
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
