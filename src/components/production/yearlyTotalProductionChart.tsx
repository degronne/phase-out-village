import React, { useContext, useMemo } from "react";
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
import {
  calculateGasProduction,
  calculateOilProduction,
  TimeSerieValue,
} from "../../data/data";
import { data } from "../../generated/data";

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
  const allFields = Object.keys(data);

  const oilData = useMemo(() => {
    return allFields.reduce((acc, field) => {
      return acc.concat(calculateOilProduction(data[field], phaseOut[field]));
    }, [] as TimeSerieValue[]);
  }, [data, phaseOut]);

  const gasData = useMemo(() => {
    return allFields.reduce((acc, field) => {
      return acc.concat(calculateGasProduction(data[field], phaseOut[field]));
    }, [] as TimeSerieValue[]);
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

  return (
    <Bar
      options={{
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
      }}
      data={{
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
      }}
    />
  );
}
