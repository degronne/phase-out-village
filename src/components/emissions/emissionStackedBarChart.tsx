import React, { useContext, useMemo } from "react";
import { ApplicationContext } from "../../applicationContext";
import { calculateEmissions } from "../../data";
import { Bar } from "react-chartjs-2";

export function EmissionStackedBArChart() {
  const { data, phaseOut } = useContext(ApplicationContext);
  const allFields = Object.keys(data);

  function calculateTotal(plan: "baseline" | "user") {
    const allEmissions = allFields.map((field) =>
      calculateEmissions(
        data[field],
        plan === "user" ? phaseOut[field] : undefined,
      ),
    );

    const allYearsSet = new Set<string>();
    allEmissions.forEach((series) => {
      series.forEach(([year]) => allYearsSet.add(year));
    });

    const allYearsSorted = Array.from(allYearsSet).sort();

    const summed = allYearsSorted.map((year) => {
      let total = 0;
      for (const series of allEmissions) {
        const match = series.find(([y]) => y === year);
        if (match) total += match[1] ?? 0;
      }

      return { x: year, y: total };
    });

    return summed;
  }

  const userPlan = useMemo(() => calculateTotal("user"), [data, phaseOut]);
  const baseline = useMemo(() => calculateTotal("baseline"), [data]);

  const labels = baseline.map((d) => d.x);

  const userData = userPlan.map((d) => d.y);
  const baselineData = baseline.map((d) => d.y);

  const reductionData = baselineData.map((base, i) => {
    const user = userData[i] ?? 0;
    return Math.max(base - user, 0);
  });

  return (
    <div className="stacked-emission-chart">
      <Bar
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Total årlig utslipp med reduksjon markert",
              padding: {
                bottom: 20,
              },
            },
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed.y;
                  return `${context.dataset.label}: ${value.toLocaleString(
                    "nb-NO",
                  )} tonn`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: "År",
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              title: {
                display: true,
                text: "CO₂-utslipp (tonn)",
              },
              ticks: {
                callback: function (value) {
                  const n = Number(value);
                  return window.innerWidth < 600
                    ? `${(n / 1_000_000).toFixed(0)}M`
                    : n.toLocaleString("nb-NO");
                },
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "Din plan",
              data: userData,
              backgroundColor: "#4a90e2",
              stack: "stack1",
            },
            {
              label: "Reduksjon",
              data: reductionData,
              backgroundColor: "rgba(200, 0, 0, 0.3)",
              borderColor: "rgba(200, 0, 0, 0.8)",
              borderWidth: 1,
              stack: "stack1",
            },
          ],
        }}
      />
    </div>
  );
}
