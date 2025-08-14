import { DataField, Year } from "../../data/types";

import React, { FormEvent, useContext, useMemo, useState } from "react";
import { ApplicationContext } from "../../applicationContext";
import { EmissionIntensityBarChart } from "../charts/emissionIntensityBarChart";
import { useNavigate } from "react-router-dom";
import "./phaseOut.css";
import { mdgPlan } from "../../generated/dataMdg";
import { fromEntries } from "../../data/fromEntries";
import {
  DatasetForAllFields,
  gameData,
  OilfieldName,
  PhaseOutSchedule,
} from "../../data/gameData";

type SortKey =
  | "alphabetical"
  | "totalProduction"
  | "emission"
  | "emissionIntensity";

function sumFieldValues(
  data: DatasetForAllFields,
  fields: OilfieldName[],
  year: Year,
  dataField: DataField,
) {
  const value = fields
    .map((field) => data[field]?.[year]?.[dataField]?.value ?? 0)
    .reduce((sum, value) => sum + value, 0);
  return Math.round(value * 100) / 100;
}

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
  const [, setSelectedOrder] = useState<OilfieldName[]>([]);
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<SortKey>("alphabetical");

  const [latestSelectedField, setLatestSelectedField] =
    useState<OilfieldName>();
  const fieldForChart = useMemo(
    () =>
      latestSelectedField
        ? gameData.data[latestSelectedField][year]
        : undefined,
    [latestSelectedField],
  );

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

  function removeField(field: OilfieldName) {
    setDraft((d) =>
      fromEntries(Object.entries(d).filter(([f]) => f !== field)),
    );

    setSelectedOrder((prev) => {
      const updated = prev.filter((f) => f !== field);
      setLatestSelectedField(updated[updated.length - 1] ?? null);
      return updated;
    });
  }

  function addField(field: OilfieldName) {
    setDraft((d) => ({ ...d, [field]: year }));
    setSelectedOrder((prev) => [...prev.filter((f) => f !== field), field]);
    setLatestSelectedField(field);
  }

  function toggle(field: OilfieldName, checked: boolean) {
    if (checked) {
      addField(field);
    } else {
      removeField(field);
    }
  }

  const sortedFields = Object.keys(gameData.data).sort((a, b) => {
    const aIsDisabled = a in phaseOut;
    const bIsDisabled = b in phaseOut;

    if (aIsDisabled && !bIsDisabled) return 1;
    if (!aIsDisabled && bIsDisabled) return -1;
    if (sortKey === "alphabetical") {
      return a.localeCompare(b);
    }

    const aData = gameData.data[a]?.[year];
    const bData = gameData.data[b]?.[year];

    return (
      (aData?.[sortKey]?.value ?? -Infinity) -
      (bData?.[sortKey]?.value ?? -Infinity)
    );
  });

  const totalOilProduction = sumFieldValues(
    gameData.data,
    Object.keys(draft),
    year,
    "productionOil",
  );
  const totalGasProduction = sumFieldValues(
    gameData.data,
    Object.keys(draft),
    year,
    "productionGas",
  );
  const totalEmission = sumFieldValues(
    gameData.data,
    Object.keys(draft),
    year,
    "emission",
  );

  return (
    <form className="phaseout-dialog" onSubmit={handleSubmit}>
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
              <option value="totalProduction">Total produksjon</option>
              <option value="emission">Utslipp</option>
              <option value="emissionIntensity">Utslippsintensitet</option>
            </select>
          </label>
        </div>
      </div>
      <div className="phaseout-checkboxes">
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
      </div>
      <div className="dialog-information-container">
        {latestSelectedField && fieldForChart && (
          <div className="phaseout-latest-oilfield">
            <h3>Sist valgt oljefelt: {latestSelectedField}</h3>
            <p>
              Olje/væskeproduksjon i {year}:{" "}
              {fieldForChart.productionOil?.value ?? "0"} GSm3 olje
            </p>
            <p>
              Gasseksport i {year}: {fieldForChart.productionGas?.value ?? "0"}{" "}
              GSm3 gass
            </p>
            <p>
              Utslipp i {year}:{" "}
              {Math.round((fieldForChart.emission?.value ?? 0) / 1000)} tusen
              tonn Co2
            </p>
            <div className="phaseout-emission-chart">
              {fieldForChart && (
                <EmissionIntensityBarChart
                  year={year}
                  field={latestSelectedField}
                  emissionIntensity={fieldForChart.emissionIntensity?.value}
                />
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
      <div className={"button-row"}>
        <button type="submit" disabled={year === "2040"}>
          Fase ut valgte felter i {year}
        </button>
        <button onClick={handleMdgPlanClick}>Velg felter fra MDGs plan</button>
      </div>
    </form>
  );
}
