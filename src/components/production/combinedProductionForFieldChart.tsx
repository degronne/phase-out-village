import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import {
  calculateGasProduction,
  calculateOilProduction,
} from "../../data/data";
import { Bar } from "react-chartjs-2";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { data } from "../../generated/data";

export function CombinedProductionForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);

  const userPlanOil = calculateOilProduction(data[field], phaseOut[field]);
  const baseLineOil = calculateOilProduction(data[field], undefined);

  const userPlanGas = calculateGasProduction(data[field], phaseOut[field]);
  const baseLineGas = calculateGasProduction(data[field], undefined);

  const textColor = usePrefersDarkMode() ? "#fff" : "#000";

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
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: textColor } },
            title: {
              display: true,
              text: `Total produksjon fra ${field}`,
              color: textColor,
              padding: {
                bottom: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  const value = context.parsed.y;
                  return `Produksjon: ${value.toLocaleString("nb-NO")}M Sm3`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Millioner Sm3 o.e.",
                color: textColor,
              },
              ticks: {
                color: textColor,
                callback: function (value: any) {
                  return `${value.toFixed(1)}M SM3`;
                },
              },
            },
            x: {
              type: "linear",
              title: {
                display: true,
                text: "År",
                color: textColor,
              },
              min: 2014,
              max: 2040,
              ticks: {
                color: textColor,
                stepSize: 2,
                callback: (tickValue) => {
                  return typeof tickValue === "number"
                    ? tickValue.toString()
                    : tickValue;
                },
              },
            },
          },
        }}
        data={{
          datasets: [
            {
              label: "Din plan (Olje)",
              data: userPlanOil,
              borderColor: "#4a90e2",
              backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
              stack: "userPlan",
            },
            {
              label: "Din plan (Gass)",
              data: userPlanGas,
              borderColor: "#E24A4A",
              backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
              stack: "userPlan",
            },
            {
              label: "Referanse Olje (uten tiltak)",
              data: baseLineOil,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
              stack: "reference",
            },
            {
              label: "Referanse Gass (uten tiltak)",
              data: baseLineGas,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
              stack: "reference",
            },
          ],
        }}
      />
    </div>
  );
}
