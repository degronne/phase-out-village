import { Line } from "react-chartjs-2";
import React from "react";
import {
  PhaseOutSchedule,
  totalProduction,
  xyDataSeries,
} from "../../data/gameData";

export function ProductionReductionChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  return (
    <Line
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: "Total produksjon fra alle felter",
            padding: {
              bottom: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `Produksjon: ${value.toLocaleString("nb-NO")}M Sm3`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Millioner Sm3 o.e.",
            },
            ticks: {
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
          x: {
            type: "linear",
            title: {
              display: true,
              text: "År",
            },
            min: 2014,
            max: 2040,
            ticks: {
              stepSize: 2,
              callback: (tickValue) => {
                return typeof tickValue === "number"
                  ? tickValue.toString()
                  : tickValue;
              },
            },
          },
        },
      }}
      data={{
        datasets: [
          {
            label: "Utfasingsplan",
            data: xyDataSeries(totalProduction(phaseOut), "totalProduction"),
            borderColor: "#4a90e2",
            segment: {
              borderDash: (ctx) => {
                const point = ctx.p1 as { raw?: { x: number | string } };
                const year = Number(point.raw?.x);
                return year > 2022 ? [5, 5] : undefined;
              },
            },
            pointStyle: (ctx) => {
              const point = ctx.raw as { x: number | string };
              return Number(point.x) > 2022 ? "star" : "circle";
            },
            backgroundColor: "rgba(74, 144, 226, 0.2)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Referanse (uten tiltak)",
            data: xyDataSeries(totalProduction({}), "totalProduction"),
            borderColor: "orange",
            segment: {
              borderDash: (ctx) => {
                const point = ctx.p1 as { raw?: { x: number | string } };
                const year = Number(point.raw?.x);
                return year > 2022 ? [5, 5] : undefined;
              },
            },
            pointStyle: (ctx) => {
              const point = ctx.raw as { x: number | string };
              return Number(point.x) > 2022 ? "star" : "circle";
            },
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      }}
    />
  );
}
