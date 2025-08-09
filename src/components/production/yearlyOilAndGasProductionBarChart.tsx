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
import { Link } from "react-router-dom";
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
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Oljeproduksjon",
        data: oilValues,
        backgroundColor: usePrefersDarkMode()
        ? "#2A5D8F"
        : "#4DA3FF",
        stack: "production",
      },
      {
        label: "Gassproduksjon",
        data: gasValues,
        backgroundColor: usePrefersDarkMode()
        ? "#D64545"
        : "#FF3333",
        stack: "production",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Inndeling av olje og gass", color: textColor },
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top", labels: { color: textColor } },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "År", color: textColor },
        min: "2012",
        ticks: { color: textColor},
      },
      y: {
        stacked: true,
        title: { display: true, text: "Millioner. Sm3 o.e.", color: textColor },
        ticks: { color: textColor},
      },
    },
  };

  return (
    <div className="production-chart">
      <nav className="production-nav">
        <Link to={"/production/"}>Din plan</Link>
        <Link to={"/production/composition"}>Inndeling produksjon</Link>
        <Link to={"/production/oilPerField"}>Produksjon per felt</Link>
      </nav>
      <div className="barchart">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
