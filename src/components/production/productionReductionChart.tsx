import React from "react";
import { Bar } from "react-chartjs-2";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import {
  gameData,
  numberSeries,
  PhaseOutSchedule,
  totalProduction,
} from "../../data/gameData";

function createStipedPattern(
  color: string,
  background: string,
): CanvasPattern | string {
  const stripes = document.createElement("canvas");
  stripes.width = 10;
  stripes.height = 10;
  const ctx = stripes.getContext("2d");
  if (!ctx) return color;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, stripes.width, stripes.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // diagonal stripes
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(10, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-5, 10);
  ctx.lineTo(5, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(5, 10);
  ctx.lineTo(15, 0);
  ctx.stroke();

  return ctx.createPattern(stripes, "repeat") ?? color;
}

export function ProductionReductionChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const prefersDark = usePrefersDarkMode();

  // colors
  const baseBar = "#4a90e2";
  const redStroke = "rgba(200, 0, 0, 0.8)";
  const bg = prefersDark ? "#111" : "#fff";
  const striped = createStipedPattern(redStroke, bg);

  // NOTE: totalProduction() has keys: productionOil, productionGas, totalProduction, emission
  const userData = numberSeries(totalProduction(phaseOut), "totalProduction");
  const baseData = numberSeries(totalProduction(), "totalProduction");
  const reductionData = baseData.map((base, i) =>
    Math.max((base ?? 0) - (userData[i] ?? 0), 0),
  );

  const labels = gameData.gameYears;

  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          title: {
            display: true,
            text: "Total årlig produksjon med reduksjon markert",
            padding: { bottom: 20 },
          },
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${value.toLocaleString("nb-NO")} Sm³`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true, title: { display: true, text: "År" } },
          y: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: "Produksjon (Sm³)" },
            ticks: {
              callback: function (v: any) {
                const n = Number(v);
                return window.innerWidth < 600
                  ? `${(n / 1_000_000).toFixed(0)}M`
                  : n.toLocaleString("nb-NO");
              },
            },
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            label: "Utfasingsplan",
            data: userData,
            backgroundColor: baseBar,
            stack: "stack1",
          },
          {
            label: "Reduksjon",
            data: reductionData,
            backgroundColor: striped as any,
            borderColor: redStroke,
            borderWidth: 1,
            stack: "stack1",
          },
        ],
      }}
    />
  );
}
