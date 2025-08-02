import React, { useContext } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Scatter } from "react-chartjs-2";
import { ApplicationContext } from "../../applicationContext";
import { Link } from "react-router-dom";
import { Year } from "../../data";

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  annotationPlugin,
);

export function EmissionEfficiencyScatterChart() {
  const { fullData, phaseOut, year } = useContext(ApplicationContext);
  const oilEquivalentToBarrel = 6.2898;

  const filtered = Object.entries(fullData)
    .map(([fieldName, yearMap]) => {
      const yearData = yearMap[year as Year];
      if (!yearData || yearData.emissionIntensity == null) return null;

      const totalProduction =
        ((yearData.productionOil ?? 0) + (yearData.productionGas ?? 0)) *
        oilEquivalentToBarrel;

      return {
        fieldName,
        emissionIntensity: yearData.emissionIntensity,
        totalProduction,
      };
    })
    .filter(Boolean) as {
    fieldName: string;
    emissionIntensity: number;
    totalProduction: number;
  }[];

  const datasets = filtered.map((d) => ({
    label: d.fieldName,
    data: [{ x: d.totalProduction, y: d.emissionIntensity }],
    pointBackgroundColor: d.fieldName in phaseOut ? "#C6CACB" : "#4a90e2",
    pointRadius: 6,
  }));

  const chartData = { datasets };

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    resizeDelay: 0,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Utslippsintensitet vs Produksjon",
        padding: { bottom: 20 },
      },
      tooltip: {
        displayColors: false,
        boxPadding: 4,
        bodySpacing: 2,
        callbacks: {
          label: (context) => {
            const emission = context.parsed.y.toFixed(1);
            const production = Math.round(context.parsed.x).toLocaleString();
            const fieldName = context.dataset.label as string;
            const isPhasedOut = fieldName in phaseOut;

            return `${fieldName}${isPhasedOut ? " (Avviklet)" : ""}: ${emission} kg/BOE${isPhasedOut ? "" : `, ${production}M fat`}`;
          },
        },
      },
      annotation: {
        annotations: {
          avgBox: {
            type: "box",
            yMin: 15,
            yMax: 20,
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            borderColor: "orange",
            borderWidth: 1,
            label: {
              content: "Verdensgjennomsnitt",
              enabled: true,
              position: "center",
              backgroundColor: "orange",
              color: "black",
              font: { weight: "bold" },
            },
          } as any,
        },
      } as any,
    },
    scales: {
      x: {
        title: { display: true, text: "Antall millioner fat produsert" },
        beginAtZero: true,
        min: 0,
        max: 100,
      },
      y: {
        title: { display: true, text: "Utslippsintensitet (kg CO₂e)" },
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <Scatter options={options} data={chartData} />
      </div>
    </>
  );
}
