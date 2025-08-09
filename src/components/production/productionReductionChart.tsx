import { Bar } from "react-chartjs-2";
import React, { useContext, useMemo } from "react";
import { ApplicationContext } from "../../applicationContext";
import {
  calculateGasProduction,
  calculateOilProduction,
  PhaseOutSchedule,
} from "../../data";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

export function ProductionReductionChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const { data } = useContext(ApplicationContext);

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

  const textColor = usePrefersDarkMode() ? "#fff": "#000";

  return (
    <div className="bar-chart">
    <Bar
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: {color: textColor} },
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
            label: "Din plan (Olje)",
            data: userPlanOil,
            borderColor: "#4a90e2",
            backgroundColor: usePrefersDarkMode()
            ? "#2A5D8F"
            : "#4DA3FF",
            stack: "userPlan"
          },
          {
            label: "Din plan (Gass)",
            data: userPlanGas,
            borderColor: "#E24A4A",
            backgroundColor: usePrefersDarkMode()
            ? "#D64545"
            : "#FF3333",
            stack: "userPlan"
          },
          {
            label: "Referanse Olje (uten tiltak)",
            data: baseLineOil,
            borderColor: "orange",
            backgroundColor: usePrefersDarkMode()
            ? "#8E44AD"
            : "#A569BD",
            stack: "reference"
          },
          {
            label: "Referanse Gass (uten tiltak)",
            data: baseLineGas,
            borderColor: "orange",
            backgroundColor: usePrefersDarkMode()
            ? "#E67E22"
            : "#FF9933",
            stack: "reference"
          }
        ],
      }}
    />
    </div>
  );
}
