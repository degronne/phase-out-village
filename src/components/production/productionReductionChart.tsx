import { Bar } from "react-chartjs-2";
import React, { useMemo } from "react";
import {
  calculateGasProduction,
  calculateOilProduction,
  PhaseOutSchedule,
  TimeSerieValue,
} from "../../data/data";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { data } from "../../generated/data";

export function ProductionReductionChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const allFields = Object.keys(data);

  function calculateTotalOil(plan: "baseline" | "user") {
    const allOilProduction = allFields.map((field) =>
      calculateOilProduction(
        data[field],
        plan === "user" ? phaseOut[field] : undefined,
      ),
    );

    const allYearsSet = new Set<string>();
    allOilProduction.forEach((series) => {
      series.forEach(([year]) => {
        allYearsSet.add(year);
      });
    });

    const allYearsSorted = Array.from(allYearsSet).sort();

    const summed = allYearsSorted.map((year) => {
      let total = 0;
      for (const series of allOilProduction) {
        const match = series.find(([y]) => y === year);
        if (match) total += match[1] ?? 0;
      }

      return {
        x: year,
        y: total,
      };
    });

    return summed;
  }

  function calculateTotalGas(plan: "baseline" | "user") {
    const allGasProduction = allFields.map((field) =>
      calculateGasProduction(
        data[field],
        plan === "user" ? phaseOut[field] : undefined,
      ),
    );

    const allYearsSet = new Set<string>();
    allGasProduction.forEach((series) => {
      series.forEach(([year]) => {
        allYearsSet.add(year);
      });
    });

    const allYearsSorted = Array.from(allYearsSet).sort();

    const summed = allYearsSorted.map((year) => {
      let total = 0;
      for (const series of allGasProduction) {
        const match = series.find(([y]) => y === year);
        if (match) total += match[1] ?? 0;
      }

      return {
        x: year,
        y: total,
      };
    });

    return summed;
  }

  function calculateDifference(
    baseline: { x: string; y: number }[],
    userReduction: { x: string; y: number }[],
  ): { x: string; y: number }[] {
    const lookup = new Map(userReduction.map(({ x, y }) => [x, y]));

    return baseline.map(({ x, y }) => ({
      x,
      y: y - (lookup.get(x) ?? 0),
    }));
  }

  const userPlanOil = useMemo(
    () => calculateTotalOil("user"),
    [data, phaseOut],
  );
  const baseLineOil = useMemo(() => calculateTotalOil("baseline"), [data]);
  const userPlanGas = useMemo(
    () => calculateTotalGas("user"),
    [data, phaseOut],
  );
  const baseLineGas = useMemo(() => calculateTotalGas("baseline"), [data]);

  const resOil = useMemo(
    () => calculateDifference(baseLineOil, userPlanOil),
    [data],
  );
  const resGas = useMemo(
    () => calculateDifference(baseLineGas, userPlanGas),
    [data],
  );

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
    <div className="bar-chart">
      <Bar
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: { color: textColor } },
            title: {
              display: true,
              text: "Total produksjon fra alle felter",
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
                  const num = Number(value);
                  if (window.innerWidth < 600) {
                    if (num >= 1_000_000)
                      return `${(num / 1_000_000).toFixed(0)} M`;
                    if (num >= 1_000) return `${(num / 1_000).toFixed(0)} K`;
                  }
                  return num.toLocaleString("nb-NO");
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
              label: "Utfasingsplan (Olje)",
              data: userPlanOil,
              borderColor: "#4a90e2",
              backgroundColor: usePrefersDarkMode() ? "#2A5D8F" : "#4DA3FF",
              stack: "PLAN",
              order: 1,
            },
            {
              label: "Utfasingsplan (Gass)",
              data: userPlanGas,
              borderColor: "#E24A4A",
              backgroundColor: usePrefersDarkMode() ? "#D64545" : "#FF3333",
              stack: "PLAN",
              order: 3,
            },
            {
              label: "Referanse Olje (uten tiltak)",
              data: resOil,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode()
                ? createStipedPattern("#2A5D8F", "transparent")
                : createStipedPattern("#4DA3FF", "transparent"),
              stack: "PLAN",
              order: 2,
            },
            {
              label: "Referanse Gass (uten tiltak)",
              data: resGas,
              borderColor: "orange",
              backgroundColor: usePrefersDarkMode()
                ? createStipedPattern("#D64545", "transparent")
                : createStipedPattern("#FF3333", "transparent"),
              stack: "PLAN",
              order: 4,
            },
          ],
        }}
      />
    </div>
  );
}
