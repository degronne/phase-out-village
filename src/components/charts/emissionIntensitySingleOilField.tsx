import React from "react";
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
        text: "Hvor skitten er produksjonen?",
        padding: {
          bottom: 20,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Kilde",
        },
      },
      y: {
        title: {
          display: true,
          text: "Utslippsintensitet",
        },
        beginAtZero: true,
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
