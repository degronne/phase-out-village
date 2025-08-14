import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { OilfieldName } from "../../data/gameData";
import { Year } from "../../data/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

export function EmissionIntensityBarChart({
  field,
  year,
  emissionIntensity,
}: {
  field: OilfieldName;
  year: Year;
  emissionIntensity?: number;
}) {
  const isSmallScreen = useIsSmallScreen();

  return (
    <Bar
      data={{
        labels: [field, "Verdens gj.snitt"],
        datasets: [
          {
            label: "Utslippsintensitet",
            data: [emissionIntensity ?? 0, 17.5],
            backgroundColor: ["#3b82f6", "orange"],
            ...(isSmallScreen
              ? {
                  barThickness: 12,
                }
              : {}),
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Hvor skitten er produksjonen i ${year}?`,
            padding: {
              bottom: 20,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Kg CO2e per fat",
            },
            beginAtZero: true,
            max: 60,
          },
        },
      }}
      height={isSmallScreen ? 400 : undefined}
    />
  );
}
