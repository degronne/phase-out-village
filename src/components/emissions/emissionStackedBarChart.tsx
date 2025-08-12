import React, { useMemo } from "react";
import { PhaseOutSchedule } from "../../data/data";
import { Bar } from "react-chartjs-2";
import { data } from "../../generated/data";
import { calculateTotalEmissions } from "../../data/calculateTotalEmissions";

export function EmissionStackedBarChart({
  phaseOut,
}: {
  phaseOut: PhaseOutSchedule;
}) {
  const allFields = Object.keys(data);
  const userPlan = useMemo(
    () => calculateTotalEmissions(allFields, data, phaseOut),
    [data, phaseOut],
  );
  const baseline = useMemo(
    () => calculateTotalEmissions(allFields, data, {}),
    [data],
  );
  const labels = baseline.map(([d]) => d);

  const userData = userPlan.map(([, x]) => x);
  const baselineData = baseline.map(([, x]) => x);

  const reductionData = baselineData.map((base, i) => {
    const user = userData[i] ?? 0;
    return Math.max(base - user, 0);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Utfasingsplan",
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
  };

  const options = {
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      title: {
        display: true,
        text: "Total årlig utslipp med reduksjon markert",
        padding: { bottom: 20 },
      },
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toLocaleString("nb-NO")} tonn`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "År" },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "CO₂-utslipp (tonn)" },
        ticks: {
          callback: function (value: any) {
            const n = Number(value);
            return window.innerWidth < 600
              ? `${(n / 1_000_000).toFixed(0)}M`
              : n.toLocaleString("nb-NO");
          },
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}
