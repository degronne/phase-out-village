import React, { useContext, useMemo } from "react";
import { ApplicationContext } from "../../applicationContext";
import { calculateEmissions } from "../../data";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

export function EmissionForAllFields() {
  const { data, phaseOut, year } = useContext(ApplicationContext);

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
      series.forEach(([year]) => {
        allYearsSet.add(year);
      });
    });

    const allYearsSorted = Array.from(allYearsSet).sort();

    const summed = allYearsSorted.map((year) => {
      let total = 0;
      for (const series of allEmissions) {
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

  const userPlan = useMemo(() => calculateTotal("user"), [data, phaseOut]);
  const baseLine = useMemo(() => calculateTotal("baseline"), [data]);

  return (
    <>
      <nav className="emission-nav">
        <Link to={"./"}>Linjediagram</Link>
        <Link to={"/emissions/bar"}>Søylediagram</Link>
        <Link to={"/emissions/intensity"}>Utslippsintensitet</Link>
      </nav>
      <div className="emission-chart">
        <Line
          key={`${year}-${Object.keys(phaseOut).join(",")}`}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: "Totalt årlig utslipp fra alle oljefelt",
                padding: {
                  bottom: 20,
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    const value = context.parsed.y;
                    return `Utslipp: ${value.toLocaleString("nb-NO")} tonn`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Tonn Co2",
                },
                ticks: {
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
                title: {
                  display: true,
                  text: "År",
                },
              },
            },
          }}
          data={{
            datasets: [
              {
                label: "Din plan",
                data: userPlan,
                borderColor: "#4a90e2",
                segment: {
                  borderDash: (ctx) => {
                    const point = ctx.p1 as { raw?: { x: number | string } };
                    const year = Number(point.raw?.x);
                    return year > 2022 ? [5, 5] : undefined;
                  },
                },
                pointStyle: (ctx) => {
                  const point = ctx.raw as { x: number | string };
                  return Number(point.x) > 2022 ? "star" : "circle";
                },
                backgroundColor: "rgba(74, 144, 226, 0.2)",
                tension: 0.3,
                fill: true,
              },
              {
                label: "Referanse (uten tiltak)",
                data: baseLine,
                borderColor: "orange",
                segment: {
                  borderDash: (ctx) => {
                    const point = ctx.p1 as { raw?: { x: number | string } };
                    const year = Number(point.raw?.x);
                    return year > 2022 ? [5, 5] : undefined;
                  },
                },
                pointStyle: (ctx) => {
                  const point = ctx.raw as { x: number | string };
                  return Number(point.x) > 2022 ? "star" : "circle";
                },
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                tension: 0.3,
                fill: true,
              },
            ],
          }}
        />
      </div>
    </>
  );
}
