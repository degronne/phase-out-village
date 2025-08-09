import React from "react";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Scatter } from "react-chartjs-2";
import { PhaseOutSchedule, Year } from "../../data";
import { emissionIntensityPerField } from "../../data/emissionIntensityPerField";

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  annotationPlugin,
);

export function EmissionIntensityChart({
  phaseOut,
  year,
}: {
  year: Year;
  phaseOut: PhaseOutSchedule;
}) {
  const datasets = emissionIntensityPerField(year).map((d) => ({
    label: d.fieldName,
    data: [{ x: d.totalProduction, y: d.emissionIntensity }],
    pointBackgroundColor: d.fieldName in phaseOut ? "#C6CACB" : "#4a90e2",
    pointRadius: 6,
  }));

  return (
    <Scatter
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        resizeDelay: 0,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Utslippsintensitet vs Produksjon i ${year}`,
            padding: { bottom: 20 },
          },
          tooltip: {
            displayColors: false,
            boxPadding: 4,
            bodySpacing: 2,
            callbacks: {
              label: (context) => {
                const emission = context.parsed.y.toFixed(1);
                const production = Math.round(
                  context.parsed.x,
                ).toLocaleString();
                const fieldName = context.dataset.label as string;
                const isPhasedOut = fieldName in phaseOut;

                return `${fieldName}${isPhasedOut ? " (Avviklet)" : ""}: ${emission} kg/BOE${isPhasedOut ? "" : `, ${production}M fat`}`;
              },
            },
          },
          annotation: {
            annotations: {
              avgBox: {
                type: "box",
                yMin: 15,
                yMax: 20,
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                borderColor: "orange",
                borderWidth: 1,
                label: {
                  content: "Verdensgjennomsnitt",
                  enabled: true,
                  position: "center",
                  backgroundColor: "orange",
                  color: "black",
                  font: { weight: "bold" },
                },
              } as any,
            },
          } as any,
        },
        scales: {
          x: {
            title: { display: true, text: "Millioner fat produsert" },
            beginAtZero: true,
            min: 0,
            max: 100,
          },
          y: {
            title: { display: true, text: "Utslippsintensitet (kg CO2e/BOE)" },
            beginAtZero: true,
            min: 0,
            max: 100,
          },
        },
      }}
      data={{ datasets }}
    />
  );
}
