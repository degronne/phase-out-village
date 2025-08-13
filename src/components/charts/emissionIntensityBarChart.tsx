import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { ApplicationContext } from "../../applicationContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

type DataPoint = {
  field: string;
  productionOil?: number | null;
  productionGas?: number | null;
  emission?: number | null;
  emissionIntensity?: number | null;
};

type Props = {
  dataPoint: DataPoint;
};

export function EmissionIntensityBarChart({ dataPoint }: Props) {
  const { year } = useContext(ApplicationContext);
  const isSmallScreen = useIsSmallScreen();
  const emissionIntensity = dataPoint.emissionIntensity ?? 0;
  const worldAverage = 17.5;

  const data = {
    labels: [dataPoint.field, "Verdens gj.snitt"],
    datasets: [
      {
        label: "Utslippsintensitet",
        data: [emissionIntensity, worldAverage],
        backgroundColor: ["#3b82f6", "orange"],
        ...(isSmallScreen
          ? {
              barThickness: 12,
            }
          : {}),
      },
    ],
  };

  const options = {
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
  };

  return (
    <Bar
      data={data}
      options={options}
      height={isSmallScreen ? 400 : undefined}
    />
  );
}
