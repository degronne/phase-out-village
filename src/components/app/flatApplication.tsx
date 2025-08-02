import React, { useEffect, useMemo, useState } from "react";
import {
  EmissionIntensity,
  YearlyEmission,
  YearlyIncome,
} from "../../types/interface";
import { ShutdownMap } from "../../types/types";
import {
  extractEmissionIntensities,
  generateCompleteData,
} from "../../utils/projections";
import {
  calculateTotalYearlyEmission,
  calculateTotalYearlyIncome,
} from "../../utils/calculations";
import { data } from "../../generated/data";
import { PriceControls } from "../sliders/priceControlSliders";
import { ShutdownControls } from "../controls/shutdownControls";
import { YearlyEmissionChart } from "../charts/yearlyEmissionChart";
import { EmissionIntensityChart } from "../charts/emissionIntensityYear";
import { EmissionEfficiencyScatterChart } from "../emissions/emissionEfficiencyScatter";
import { exportDataSet } from "../../utils/excel";

export function FlatApplication() {
  const [price, setPrice] = useState({ oil: 80, gas: 50 });
  const [incomeByYear, setIncomeByYear] = useState<YearlyIncome[]>([]);
  const [shutdowns, setShutdowns] = useState<ShutdownMap>({});
  const [emission, setEmission] = useState<YearlyEmission[]>([]);
  const [intensityData, setIntensityData] = useState<EmissionIntensity[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);

  const fullData = useMemo(() => generateCompleteData(data), [data]);

  const handlePriceUpdate = () => {
    const income = calculateTotalYearlyIncome(
      fullData,
      price.oil,
      price.gas,
      shutdowns,
    );
    setIncomeByYear(income);
  };

  function handleShutdownChange(fieldName: string, year: number) {
    setShutdowns((prev) => {
      const updated = { ...prev, [fieldName]: year };
      const income = calculateTotalYearlyIncome(
        fullData,
        price.oil,
        price.gas,
        updated,
      );
      const newEmission = calculateTotalYearlyEmission(fullData, updated);
      setIncomeByYear(income);
      setEmission(newEmission);

      return updated;
    });
  }

  useEffect(() => {
    handlePriceUpdate();
    setEmission(calculateTotalYearlyEmission(fullData, shutdowns));
    setIntensityData(extractEmissionIntensities(fullData));
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => exportDataSet(fullData)}>
          Last ned som Excel
        </button>
        <h2>Inntektsberegning</h2>
        <PriceControls
          price={price}
          setPrice={setPrice}
          onPriceUpdate={handlePriceUpdate}
        />
        <div className="income-display">
          <ShutdownControls
            data={fullData}
            shutdowns={shutdowns}
            onShutdownChange={handleShutdownChange}
          />
          {/*<IncomeChart data={incomeByYear} />*/}
          {/*<YearlyIncomeList data={incomeByYear} /> */}
          <YearlyEmissionChart data={emission} />
        </div>
        <div className="totalEmission-chart">
          <EmissionIntensityChart data={intensityData} />
        </div>
        <div className="emission-scatterChart">
          <EmissionEfficiencyScatterChart />
        </div>
      </div>
      {/*<ProductionTable /> */}
    </div>
  );
}
