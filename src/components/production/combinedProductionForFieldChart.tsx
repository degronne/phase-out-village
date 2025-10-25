import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Bar } from "react-chartjs-2";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import {
  gameData,
  toTimeseries,
  truncatedDataset,
  yearsInRange,
} from "../../data/gameData";

/**
 * Bar chart showing combined oil/condensate production and gas exports for a specific oil field,
 * including reductions compared to baseline production.
 *
 * @param props.field - The name of the oil field to display production data for.
 */
export function CombinedProductionForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);

  // Determine text color based on dark mode preference
  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

   // Get raw dataset for the field
  const dataset = gameData.data[field];

  // Convert production data to timeseries and map to chart format {x: year, y: value}
  const productionOil = toTimeseries(
    truncatedDataset(dataset, phaseOut[field]),
    "productionOil",
  ).map(([year, value]) => ({ x: year, y: value }));

  const productionGas = toTimeseries(
    truncatedDataset(dataset, phaseOut[field]),
    "productionGas",
  ).map(([year, value]) => ({ x: year, y: value }));

  // Baseline production without any phase-out reductions
  const baselineOil = toTimeseries(dataset, "productionOil").map(
    ([year, value]) => ({ x: year, y: value }),
  );

  const baselineGas = toTimeseries(dataset, "productionGas").map(
    ([year, value]) => ({ x: year, y: value }),
  );

  // Calculate reductions compared to baseline
  const reductionOil = productionOil.map((year, i) => ({
    x: year.x,
    y: baselineOil[i].y - (year.y ?? 0),
  }));

  const reductionGas = productionGas.map((year, i) => ({
    x: year.x,
    y: baselineGas[i].y - (year.y ?? 0),
  }));

  /**
   * Determine the first year to display based on available production data
   * Returns the earliest year among oil or gas production
   */
  function calcYears() {
    if (productionOil[0].x <= productionGas[0].x) {
      return parseInt(productionGas[0].x);
    } else {
      return parseInt(productionOil[0].x);
    }
  }

  const years = yearsInRange(calcYears(), 2040);

  // Erlend: Hm... First of all, I think there is a typo in the function name createStipedPattern.
  // Secondly, I think this function is being defined in several files?

  /**
   * Create a striped canvas pattern for representing reductions in the chart
   *
   * @param color - Color of the stripes
   * @param background - Background color underneath stripes
   * @returns CanvasPattern | string
   */
  function createStipedPattern(
    color: string,
    background: string,
  ): CanvasPattern | string {
    const stripes = document.createElement("canvas");
    stripes.width = 10;
    stripes.height = 10;
    const ctx = stripes.getContext("2d");

    if (!ctx) return color;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, stripes.width, stripes.height);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(10, 0);
    ctx.stroke();

    return ctx.createPattern(stripes, "repeat") as CanvasPattern;
  }

  return (
    <div
      style={{
        height: 290,
        maxHeight: 300,
        position: "relative",
      }}
    >
      <Bar
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false, labels: { color: textColor } },
            title: {
              display: true,
              text: `Årlig totalproduksjon fra ${field}`,
              color: textColor,
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const value = context.parsed.y;
                  return `${context.dataset.label}: ${value.toLocaleString("nb-NO")} millioner SM3`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: textColor,
                callback: function (value: any) {
                  return `${value.toFixed(1)}M SM3`;
                },
              },
            },
            x: {
              ticks: {
                color: textColor,
              },
            },
          },
        }}
        data={{
          labels: years,
          datasets: [
            {
              label: "Olje/Væskeproduksjon",
              data: productionOil,
              borderColor: "#4a90e2",
              backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
              stack: "plan",
              order: 1,
            },
            {
              label: "Gasseksport",
              data: productionGas,
              borderColor: "#E24A4A",
              backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
              stack: "plan",
              order: 3,
            },
            {
              label: "Reduksjon Olje/Væske",
              data: reductionOil,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode()
                ? createStipedPattern("#2A5D8F", "transparent")
                : createStipedPattern("#4DA3FF", "transparent"),
              stack: "plan",
              order: 2,
            },
            {
              label: "Reduksjon Gass",
              data: reductionGas,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode()
                ? createStipedPattern("#D64545", "transparent")
                : createStipedPattern("#FF3333", "transparent"),
              stack: "plan",
              order: 4,
            },
          ],
        }}
      />
    </div>
  );
}
