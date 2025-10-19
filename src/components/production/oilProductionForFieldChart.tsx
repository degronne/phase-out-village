import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";
import { gameData, toTimeseries, truncatedDataset } from "../../data/gameData";

/**
 * Line chart displaying annual oil/condensate production for a specific oil field.
 *
 * @param props.field - The name of the oil field to display oil/condensate production data for.
 */
export function OilProductionForFieldChart({ field }: { field: string }) {
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
            text: `Årlig olje/væskeproduksjon fra ${field}`,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `Olje: ${value.toLocaleString("nb-NO")} millioner SM3`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return `${value.toFixed(1)}M SM3`;
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
              "productionOil",
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
            data: toTimeseries(dataset, "productionOil"),
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
