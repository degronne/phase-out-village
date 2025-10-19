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

/**
 * EmissionIntensityBarChart renders a bar chart comparing the emission intensity
 * of a specific oilfield to the global average.
 *
 * @param field - Name of the oilfield
 * @param year - Year for which the data is displayed
 * @param emissionIntensity - Emission intensity value in Kg CO2e per barrel of oil equivalent
 *
 * Features:
 * - Responsive layout that adjusts bar thickness for small screens
 * - Displays a title indicating the year
 * - Compares the oilfield's intensity to the global average (17.5 Kg CO2e/BOE)
 */
export function EmissionIntensityBarChart({
  field,
  year,
  emissionIntensity,
}: {
  field: OilfieldName;
  year: Year;
  emissionIntensity?: number;
}) {
  const isSmallScreen = useIsSmallScreen(); // Custom hook to detect screen size

  return (
    <Bar
      data={{
        labels: [field, "Verdens gj.snitt"], // X-axis labels: oilfield vs world average
        datasets: [
          {
            label: "Utslippsintensitet",
            data: [emissionIntensity ?? 0, 17.5], // Dataset: actual emission intensity vs world average
            backgroundColor: ["#3b82f6", "orange"], // Blue for field, orange for world avg
            // Reduce bar thickness on small screens
            // Conditionally add barThickness on small screens; spreading {} does nothing when false
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
            display: false, // Hide legend since we only have two bars
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
      height={isSmallScreen ? 400 : undefined} // Explicit height for small screens
    />
  );
}
