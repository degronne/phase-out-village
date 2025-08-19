import React, { useContext } from "react";
import { ApplicationContext } from "../../applicationContext";
import { Bar } from "react-chartjs-2";
import { useLightDark } from "../../hooks/useLightDark";
import {
  gameData,
  toTimeseries,
  truncatedDataset,
  yearsInRange,
} from "../../data/gameData";

export function CombinedProductionForFieldChart({ field }: { field: string }) {
  const { phaseOut } = useContext(ApplicationContext);

  const textColor = useLightDark("#fff", "#000");

  const dataset = gameData.data[field];

  const productionOil = toTimeseries(
    truncatedDataset(dataset, phaseOut[field]),
    "productionOil",
  ).map(([year, value]) => ({ x: year, y: value }));

  const productionGas = toTimeseries(
    truncatedDataset(dataset, phaseOut[field]),
    "productionGas",
  ).map(([year, value]) => ({ x: year, y: value }));

  const baselineOil = toTimeseries(dataset, "productionOil").map(
    ([year, value]) => ({ x: year, y: value }),
  );

  const baselineGas = toTimeseries(dataset, "productionGas").map(
    ([year, value]) => ({ x: year, y: value }),
  );

  const reductionOil = productionOil.map((year, i) => ({
    x: year.x,
    y: baselineOil[i].y - (year.y ?? 0),
  }));

  const reductionGas = productionGas.map((year, i) => ({
    x: year.x,
    y: baselineGas[i].y - (year.y ?? 0),
  }));

  function calcYears(){
    if(productionOil[0].x <= productionGas[0].x){
      return parseInt(productionGas[0].x);
    }else{
      return parseInt(productionOil[0].x);
    }
  } 

  const years = yearsInRange(calcYears(), 2040);

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
              backgroundColor: useLightDark("#2A5D8F", "#4DA3FF"),
              stack: "plan",
              order: 1,
            },
            {
              label: "Gasseksport",
              data: productionGas,
              borderColor: "#E24A4A",
              backgroundColor: useLightDark("#D64545", "#FF3333") ,
              stack: "plan",
              order: 3,
            },
            {
              label: "Reduksjon Olje/Væske",
              data: reductionOil,
              borderColor: "orange",
              backgroundColor: createStipedPattern(useLightDark("#2A5D8F", "#4DA3FF"), "transparent"),
              stack: "plan",
              order: 2,
            },
            {
              label: "Reduksjon Gass",
              data: reductionGas,
              borderColor: "orange",
              backgroundColor: createStipedPattern(useLightDark("#D64545", "#FF3333"), "transparent"),
              stack: "plan",
              order: 4,
            },
          ],
        }}
      />
    </div>
  );
}
