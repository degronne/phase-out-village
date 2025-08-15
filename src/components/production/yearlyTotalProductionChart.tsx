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

export function YearlyTotalProductionChart() {
  const { phaseOut } = useContext(ApplicationContext);
  const production = totalProduction(phaseOut);
  const years = Object.keys(production) as Year[];
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";
  const gasValues = Object.values(production).map(
    ({ productionGas }) => productionGas?.value,
  );
  const oilValues = Object.values(production).map(
    ({ productionOil }) => productionOil?.value,
  );

  return (
    <Bar
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: "Inndeling av olje og gass", color: textColor },
          tooltip: { mode: "index", intersect: false },
          legend: { position: "top", labels:{color: textColor} },
        },
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: "År", color: textColor },
            ticks:{
              color: textColor,
            }
          },
          y: {
            stacked: true,
            title: { display: true, text: "Millioner. Sm3 o.e.", color: textColor },
            ticks: {
              color: textColor,
            }
          },
        },
      }}
      data={{
        labels: years,
        datasets: [
          {
            label: "Olje/væskeproduksjon",
            data: oilValues,
            backgroundColor:  usePrefersDarkMode() ? "rgba(54,162,235,0.6)" : "#FF3333",
            stack: "production",
          },
          {
            label: "Gasseksport",
            data: gasValues,
            backgroundColor:  usePrefersDarkMode() ? "rgba(255,99,132,0.6)" : "#4DA3FF",
            stack: "production",
          },
        ],
      }}
    />
  );
}
