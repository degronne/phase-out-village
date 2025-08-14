import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  CategoryScale,
  Chart,
  Chart as ChartJS,
  Legend,
  LegendItem,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { ApplicationContext } from "../../applicationContext";
import { isEstimated } from "../charts/isEstimated";
import { Link } from "react-router-dom";
import { Year } from "../../data/types";
import {
  gameData,
  OilfieldName,
  truncatedDataset,
  xyDataSeries,
} from "../../data/gameData";
import { ProductionTable } from "./productionTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function focusOnClicked(
  legendItem: LegendItem,
  chart: Chart<"line">,
  setVisibleField: Dispatch<SetStateAction<string | undefined>>,
) {
  const index = legendItem.datasetIndex!;
  const allVisible = chart.data.datasets.every(
    (_, i) => !chart.getDatasetMeta(i).hidden,
  );
  if (allVisible || chart.getDatasetMeta(index).hidden) {
    chart.data.datasets.forEach((_, i) => {
      chart.getDatasetMeta(i).hidden = i !== index;
    });
    setVisibleField(legendItem.text);
  } else {
    chart.data.datasets.forEach((d, i) => {
      chart.getDatasetMeta(i).hidden = false;
    });
    setVisibleField(undefined);
  }
  chart.update();
}

export function ProductionPerFieldPage() {
  const [visibleField, setVisibleField] = useState<string | undefined>();

  const { phaseOut } = useContext(ApplicationContext);

  const datasets: [
    OilfieldName,
    {
      x: Year;
      y: number | undefined;
      estimate?: boolean | undefined;
    }[],
  ][] = Object.entries(gameData.data).map(([field, data]) => {
    return [
      field,
      xyDataSeries(truncatedDataset(data, phaseOut[field]), "productionOil"),
    ];
  });

  return (
    <>
      <nav className="production-nav">
        <Link to={"/production/"}>Din plan</Link>
        <Link to={"/production/composition"}>Inndeling produksjon</Link>
        <Link to={"/production/oilPerField"}>Produksjon per felt</Link>
      </nav>
      <div className="production-chart">
        <Line
          options={{
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: "Produksjon per oljefelt" },
              legend: {
                position: "top",
                onClick: (_, legendItem, { chart }) =>
                  focusOnClicked(legendItem, chart, setVisibleField),
              },
              tooltip: {
                callbacks: {
                  title: (context) => `${context[0].parsed.x}`,
                  label: (context) => {
                    const {
                      dataset: { label },
                      parsed,
                    } = context;
                    const type = isEstimated(context) ? "Estimert" : "Målt";
                    return `${label} – ${parsed.x}: ${parsed.y} BOE (${type})`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "År" },
                type: "linear" as const,
                min: 2000,
                max: 2040,
                ticks: {
                  stepSize: 1,
                  callback: (value: number | string) => `${value}`,
                },
              },
              y: {
                title: { display: true, text: "Produksjon (BOE)" },
                beginAtZero: true,
              },
            },
          }}
          data={{
            datasets: datasets.map(([label, data]) => ({
              label,
              data,
              hidden: !!visibleField && label !== visibleField,
              borderColor: colorFromLabel(label),
              backgroundColor: colorFromLabel(label),
              tension: 0.3,
              spanGaps: true,
              segment: {
                borderDash: (ctx) => (isEstimated(ctx.p1) ? [5, 5] : undefined),
              },
              pointStyle: (ctx) => (isEstimated(ctx) ? "star" : "circle"),
              pointRadius: (ctx) => (isEstimated(ctx) ? 5 : 4),
              pointBackgroundColor: (_) => colorFromLabel(label),
            })),
          }}
        />
        {visibleField && (
          <ProductionTable
            field={visibleField}
            dataseries={gameData.data[visibleField]}
          />
        )}
      </div>
    </>
  );
}

function colorFromLabel(label: string): string {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use hash to get hue (0–360), keep saturation and lightness constant
  const hue = Math.abs(hash) % 360;
  const saturation = 65; // %
  const lightness = 50; // %

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
