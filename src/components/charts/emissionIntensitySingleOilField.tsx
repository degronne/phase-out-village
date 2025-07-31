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
  const emissionIntensity = dataPoint.emissionIntensity ?? 0;
  const worldAverage = 17.5;

  const data = {
    labels: [dataPoint.field, "Verdensgjennomsnitt"],
    datasets: [
      {
        label: "Utslippsintensitet",
        data: [emissionIntensity, worldAverage],
        backgroundColor: ["#3b82f6", "orange"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Utslippsintensitet: Oljefelt vs. Verdensgjennomsnitt",
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

  return <Bar data={data} options={options} />;
}
