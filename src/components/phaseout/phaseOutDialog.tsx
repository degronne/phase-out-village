import React, { FormEvent, useContext, useState } from "react";
import { ApplicationContext } from "../../applicationContext";
import { EmissionIntensityBarChart } from "../charts/emissionIntensityBarChart";
import { useNavigate } from "react-router-dom";
import "./phaseOut.css";
import { mdgPlan } from "../../generated/dataMdg";
import { fullData } from "../../data/projections";
import { fromEntries } from "../../data/fromEntries";
import { OilfieldName, PhaseOutSchedule } from "../../data/types";

type Oilfield = {
  field: string;
  productionOil: number | null;
  productionGas: number | null;
  emission: number | null;
  emissionIntensity: number | null;
};

type SortKey = "alphabetical" | "production" | "emission" | "emissionIntensity";

export function PhaseOutDialog({
  close,
  from,
}: {
  close: () => void;
  from: string;
}) {
  const { year, proceed, phaseOut, setPhaseOut } =
    useContext(ApplicationContext);

  const [draft, setDraft] = useState<PhaseOutSchedule>({});
  const [selectedOrder, setSelectedOrder] = useState<OilfieldName[]>([]);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortKey>("alphabetical");

  const [latestSelectedField, setLatestSelectedField] =
    useState<OilfieldName | null>(null);
  const [fieldForChart, setFieldForChart] = useState<Oilfield | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPhaseOut((phaseOut) => ({ ...phaseOut, ...draft }));
    proceed();
    close();
  }

  const periodEnd = (parseInt(year) + 3).toString();

  function handleMdgPlanClick(e: FormEvent) {
    e.preventDefault();
    const period = [
      year,
      (parseInt(year) + 1).toString(),
      (parseInt(year) + 2).toString(),
      periodEnd,
    ];

    const fields = fromEntries(
      Object.entries(mdgPlan).filter(
        ([_, year]) => year && period.includes(year),
      ),
    );
    setDraft(fields);
  }

  function updateLatestSelectedField(
    removed: string,
    selectedOrder: string[],
  ): string | null {
    const newOrder = selectedOrder.filter((f) => f !== removed);
    return newOrder[newOrder.length - 1] ?? null;
  }

  function setLatestFieldInfo(field: OilfieldName | null) {
    setLatestSelectedField(field);

    if (!field) {
      setFieldForChart(null);
      return;
    }

    const data = fullData[field]?.[year];
    if (data) {
      const fieldData: Oilfield = {
        field,
        productionOil: data.productionOil ?? null,
        productionGas: data.productionGas ?? null,
        emission: data.emission ?? null,
        emissionIntensity: data.emissionIntensity ?? null,
      };
      setFieldForChart(fieldData);
    } else {
      setFieldForChart(null);
    }
  }

  function removeField(field: OilfieldName) {
    setDraft((d) =>
      fromEntries(Object.entries(d).filter(([f]) => f !== field)),
    );

    setSelectedOrder((prev) => {
      const updated = prev.filter((f) => f !== field);
      const fallback = updateLatestSelectedField(field, prev);
      setLatestFieldInfo(fallback);
      return updated;
    });
  }

  function addField(field: OilfieldName) {
    setDraft((d) => ({ ...d, [field]: year }));
    setSelectedOrder((prev) => [...prev.filter((f) => f !== field), field]);
    setLatestFieldInfo(field);
  }

  function toggle(field: OilfieldName, checked: boolean) {
    if (checked) {
      addField(field);
    } else {
      removeField(field);
    }
  }

  function calculateTotal(
    draft: Record<string, unknown>,
    fullData: Record<string, any>,
    year: string | number,
    key: "productionOil" | "productionGas" | "emission",
  ): number {
    return (
      Math.round(
        Object.keys(draft).reduce((sum, field) => {
          const value = fullData[field]?.[year]?.[key] ?? 0;
          return sum + value;
        }, 0) * 100,
      ) / 100
    );
  }

  const sortedFields = Object.keys(fullData).sort((a, b) => {
    const aIsDisabled = a in phaseOut;
    const bIsDisabled = b in phaseOut;

    if (aIsDisabled && !bIsDisabled) return 1;
    if (!aIsDisabled && bIsDisabled) return -1;

    const aData = fullData[a]?.[year];
    const bData = fullData[b]?.[year];

    if (sortKey === "alphabetical") {
      return a.localeCompare(b);
    }

    if (sortKey === "emission") {
      const aE = aData?.emission ?? -Infinity;
      const bE = bData?.emission ?? -Infinity;
      return bE - aE;
    }

    if (sortKey === "production") {
      const aProd = (aData?.productionOil ?? 0) + (aData?.productionGas ?? 0);
      const bProd = (bData?.productionOil ?? 0) + (bData?.productionGas ?? 0);
      return bProd - aProd;
    }

    if (sortKey === "emissionIntensity") {
      const aEI = aData?.emissionIntensity ?? -Infinity;
      const bEI = bData?.emissionIntensity ?? -Infinity;
      return bEI - aEI;
    }

    return 0;
  });

  const totalOilProduction = calculateTotal(
    draft,
    fullData,
    year,
    "productionOil",
  );
  const totalGasProduction = calculateTotal(
    draft,
    fullData,
    year,
    "productionGas",
  );
  const totalEmission = calculateTotal(draft, fullData, year, "emission");

  return (
    <div className="phaseout-dialog">
      <div className="phaseout-dialog-header">
        <button
          type="button"
          className="close-phaseout-button"
          onClick={() => navigate(from)}
        >
          ✖
        </button>
        <div className="phaseout-sort-wrapper">
          <label className="phaseout-sort-dropdown">
            Sorter etter:{" "}
            <select
              value={sortKey}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="alphabetical">Alfabetisk</option>
              <option value="production">Total produksjon</option>
              <option value="emission">Utslipp</option>
              <option value="emissionIntensity">Utslippsintensitet</option>
            </select>
          </label>
        </div>
      </div>
      <form className="phaseout-checkboxes" onSubmit={handleSubmit}>
        <h3 className="phaseout-header">
          Velg felter for avvikling {year}-{periodEnd}
        </h3>
        <ul>
          {sortedFields.map((k) => {
            const isDisabled = k in phaseOut;
            return (
              <li
                key={k}
                className={isDisabled ? "grayed-out-oilfield-checklist" : ""}
              >
                <label>
                  <input
                    disabled={isDisabled}
                    type="checkbox"
                    onChange={(e) => {
                      toggle(k, e.target.checked);
                    }}
                    checked={!!draft[k]}
                  />
                  {k}
                </label>
              </li>
            );
          })}
        </ul>

        <button type="submit" disabled={year === "2040"}>
          Fase ut valgte felter i {year}
        </button>
        <button onClick={handleMdgPlanClick}>Velg felter fra MDGs plan</button>
      </form>
      <div className="dialog-information-container">
        {latestSelectedField && fullData[latestSelectedField] && (
          <div className="phaseout-latest-oilfield">
            <h3>Sist valgt oljefelt: {latestSelectedField}</h3>
            <p>
              Oljeproduksjon i {year}:{" "}
              {fullData[latestSelectedField]?.[year]?.productionOil ?? "0"} GSm3
              olje
            </p>
            <p>
              Gassproduksjon i {year}:{" "}
              {fullData[latestSelectedField]?.[year]?.productionGas ?? "0"} GSm3
              gass
            </p>
            <p>
              Utslipp i {year}:{" "}
              {Math.round(
                (fullData[latestSelectedField]?.[year]?.emission ?? 0) / 1000,
              )}{" "}
              tusen tonn Co2
            </p>
            <div className="phaseout-emission-chart">
              {fieldForChart && (
                <EmissionIntensityBarChart dataPoint={fieldForChart!} />
              )}
            </div>
          </div>
        )}

        {Object.keys(draft).length > 0 && (
          <div className="phaseout-total-production">
            <strong>Produksjon som reduseres innen {periodEnd}:</strong>
            <p>{totalOilProduction} GSm3 olje</p>
            <p>{totalGasProduction} GSm3 gass</p>
            <strong>Utslipp som reduseres innen {periodEnd}:</strong>{" "}
            {Math.round(totalEmission / 1_000)} tusen tonn Co2
          </div>
        )}

        {Object.keys(draft).length > 0 && (
          <div className="phaseout-fieldnames-selected">
            <h4>Felter som avvikles innen {periodEnd}:</h4>
            <ul>
              {Object.keys(draft).map((k) => (
                <li key={k}>
                  <label>{k}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
