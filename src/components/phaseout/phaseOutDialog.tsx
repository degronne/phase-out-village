import React, { FormEvent, useContext, useState } from "react";
import { ApplicationContext } from "../../applicationContext";
import { OilfieldName, PhaseOutSchedule } from "../../data";
import { EmissionIntensityBarChart } from "../charts/emissionIntensitySingleOilField";

type Oilfield = {
  field: string;
  productionOil: number | null;
  productionGas: number | null;
  emission: number | null;
  emissionIntensity: number | null;
};

export function PhaseOutDialog({ close }: { close: () => void }) {
  const { year, proceed, fullData, phaseOut, setPhaseOut } =
    useContext(ApplicationContext);

  const [draft, setDraft] = useState<PhaseOutSchedule>({});

  const [latestSelectedField, setLatestSelectedField] =
    useState<OilfieldName | null>(null);
  const [fieldForChart, setFieldForChart] = useState<Oilfield | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPhaseOut((phaseOut) => ({ ...phaseOut, ...draft }));
    proceed();
    close();
  }

  function toggle(field: OilfieldName, checked: boolean) {
    if (!checked) {
      setDraft((d) =>
        Object.fromEntries(Object.entries(d).filter(([f, _]) => f !== field)),
      );
      if (latestSelectedField === field) {
        setLatestSelectedField(null);
      }
    } else {
      setDraft((d) => ({ ...d, [field]: year }));
      setLatestSelectedField(field);
      const data = fullData[field]?.[year];
      if (data) {
        const fieldData: Oilfield = {
          field: field,
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
      <form className="phaseout-checkboxes" onSubmit={handleSubmit}>
        <h2 className="phaseout-header">Velg felter for avvikling i {year}</h2>
        <ul>
          {Object.keys(fullData).map((k) => {
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

        <button type="submit">Lagre</button>
      </form>
      <div className="dialog-information-container">
        {latestSelectedField && fullData[latestSelectedField] && (
          <div className="phaseout-latest-oilfield">
            <h3>Sist valgt oljefelt: {latestSelectedField}</h3>
            <p>
              Oljeproduksjon i {year}:{" "}
              {fullData[latestSelectedField]?.[year]?.productionOil ?? "0"} Sm3
              olje
            </p>
            <p>
              Gassproduksjon i {year}:{" "}
              {fullData[latestSelectedField]?.[year]?.productionGas ?? "0"} GSm3
              gass
            </p>
            <p>
              Utslipp i {year}:{" "}
              {fullData[latestSelectedField]?.[year]?.emission ?? "0"} Tonn Co2
            </p>
            {fieldForChart && (
              <EmissionIntensityBarChart dataPoint={fieldForChart!} />
            )}
          </div>
        )}

        {Object.keys(draft).length > 0 && (
          <div className="phaseout-total-production">
            <strong>Produksjon som reduseres i {year}:</strong>
            <p>{totalOilProduction} Sm3 olje</p>
            <p>{totalGasProduction} GSm3 gass</p>
            <strong>Utslipp som reduseres i {year}:</strong> {totalEmission}{" "}
            Tonn Co2
          </div>
        )}

        {Object.keys(draft).length > 0 && (
          <div className="phaseout-fieldnames-selected">
            <h4>Felter som avvikles i {year}:</h4>
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
