import React, { useContext, useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ApplicationContext } from "../../applicationContext";
import { calculateOilProduction, calculateGasProduction } from "../../data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function YearlyTotalProductionChart() {
  const { data, phaseOut } = useContext(ApplicationContext);
  const allFields = Object.keys(data);

  const oilData = useMemo(() => {
    return allFields.flatMap((field) =>
      calculateOilProduction(data[field], phaseOut[field]),
    );
  }, [data, phaseOut]);

  const gasData = useMemo(() => {
    return allFields.flatMap((field) =>
      calculateGasProduction(data[field], phaseOut[field]),
    );
  }, [data, phaseOut]);

  const { years, oilValues, gasValues } = useMemo(() => {
    const years = Array.from(
      new Set([...oilData.map((d) => d[0]), ...gasData.map((d) => d[0])]),
    ).sort();

    const oilMap = new Map<string, number>();
    const gasMap = new Map<string, number>();

    for (const [year, value] of oilData) {
      oilMap.set(year, (oilMap.get(year) ?? 0) + value);
    }

    for (const [year, value] of gasData) {
      gasMap.set(year, (gasMap.get(year) ?? 0) + value);
    }

    const oilValues = years.map((y) => oilMap.get(y) ?? 0);
    const gasValues = years.map((y) => gasMap.get(y) ?? 0);

    return { years, oilValues, gasValues };
  }, [oilData, gasData]);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Oljeproduksjon",
        data: oilValues,
        backgroundColor: "rgba(255,99,132,0.6)",
        stack: "production",
      },
      {
        label: "Gassproduksjon",
        data: gasValues,
        backgroundColor: "rgba(54,162,235,0.6)",
        stack: "production",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Inndeling av olje og gass" },
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top" },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "År" },
      },
      y: {
        stacked: true,
        title: { display: true, text: "Millioner. Sm3 o.e." },
      },
    },
  };

  return (
    <div className="stacked-production-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
}
