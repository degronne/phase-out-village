import React, { useContext } from "react";
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
import { ApplicationContext } from "../../applicationContext";
import { totalProduction } from "../../data/gameData";
import { Year } from "../../data/types";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * Renders a stacked bar chart showing yearly total oil and gas production.
 * - Uses phase-out plan from context
 * - Colors are adapted for dark/light mode
 */
export function YearlyTotalProductionChart() {
  const { phaseOut } = useContext(ApplicationContext);

  // Calculate total production (oil and gas) per year based on the phase-out schedule
  const production = totalProduction(phaseOut);

  // Extract the years from the production object to use as x-axis labels
  const years = Object.keys(production) as Year[];

  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

  // Extract gas production values for each year to use as dataset for the chart
  const gasValues = Object.values(production).map(
    ({ productionGas }) => productionGas?.value,
  );
  // Extract oil/fluids production values for each year to use as dataset for the chart
  const oilValues = Object.values(production).map(
    ({ productionOil }) => productionOil?.value,
  );

  return (
    <Bar
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Inndeling av olje og gass",
            color: textColor,
          },
          tooltip: { mode: "index", intersect: false },
          legend: { position: "top", labels: { color: textColor } },
        },
         // Interaction mode for tooltips and highlighting
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: "År", color: textColor },
            ticks: {
              color: textColor,
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Millioner. Sm3 o.e.",
              color: textColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
      }}
      data={{
        labels: years, // x-axis labels (years)
        datasets: [
          {
            label: "Olje/væskeproduksjon",
            data: oilValues,
            backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
            stack: "production", // Stack all production datasets together
          },
          {
            label: "Gasseksport",
            data: gasValues,
            backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
            stack: "production", // Stack all production datasets together
          },
        ],
      }}
    />
  );
}
