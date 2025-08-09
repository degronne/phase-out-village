import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { oilProduction, YearlyDataset } from "../../data/data";
import { Line } from "react-chartjs-2";
import { isEstimated } from "../charts/isEstimated";
import { data } from "../../generated/data";

export function OilProductionForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);

  function toDataset(yearlyDataset: YearlyDataset) {
    return Object.entries(yearlyDataset).map(([year, { value, estimate }]) => ({
      x: year,
      y: value,
      estimate,
    }));
  }

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Årlig oljeproduksjon fra ${field}`,
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
        labels: toDataset(oilProduction(data[field], {}, field)).map(
          ({ x }) => x,
        ),
        datasets: [
          {
            label: "Din plan",
            data: toDataset(oilProduction(data[field], phaseOut, field)),
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
            data: toDataset(oilProduction(data[field], {}, field)),
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
