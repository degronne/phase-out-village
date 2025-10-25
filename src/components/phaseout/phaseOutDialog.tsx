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
import { InfoTag } from "../ui/InfoTag";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

/** Keys that can be used to sort oil fields in PhaseOutDialog. */
type SortKey =
  | "alphabetical"
  | "totalProduction"
  | "emission"
  | "emissionIntensity";

/**
 * Sums values of a given data field for a set of oil fields in a given year.
 *
 * @param data - The dataset containing all fields and years
 * @param fields - List of oil fields to sum
 * @param year - Year for which to sum values
 * @param dataField - The type of data to sum (productionOil, productionGas, or emission)
 * @returns Total value rounded to 2 decimals
 */
function sumFieldValues(
  data: DatasetForAllFields,
  fields: OilfieldName[],
  year: Year,
  dataField: DataField,
) {
  const value = fields
    .map((field) => data[field]?.[year]?.[dataField]?.value ?? 0)
    .reduce((sum, value) => sum + value, 0);
  return Math.round(value * 100) / 100; // Round to two decimals
}

/**
 * Dialog for selecting which oil fields to phase out in the current 4-year period.
 *
 * Features:
 * - Sort oil fields by alphabetical order, total production, emissions, or emission intensity
 * - Select/deselect fields to add them to the draft phase-out plan
 * - View charts for the most recently selected field
 * - Display totals for oil/gas production reduction and emission reduction
 *
 * @param close - Function to close the dialog
 * @param from - Path to navigate back to after closing
 */
export function PhaseOutDialog({
  close,
  from,
}: {
  close: () => void;
  from: string;
}) {
  const { year, proceed, phaseOut, setPhaseOut, phaseOutDraft, setPhaseOutDraft, getEndOfTermYear } =
    useContext(ApplicationContext);

  // Draft selection state for the current period
  // const [draft, setDraft] = useState<PhaseOutSchedule>({});
  const draft = phaseOutDraft;
  const setDraft = setPhaseOutDraft;
  const [, setSelectedOrder] = useState<OilfieldName[]>([]);
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();
  const isDarkMode = usePrefersDarkMode();

  const [sortKey, setSortKey] = useState<SortKey>("alphabetical");

  // Latest selected field for displaying charts
  const [latestSelectedField, setLatestSelectedField] =
    useState<OilfieldName>();

  // const [latestSelectedField, setLatestSelectedField] =
  //   useState<OilfieldName|undefined>(Object.keys(phaseOutDraft).length > 0 ? phaseOutDraft[0] : undefined);

  // Memoized data for the chart of the latest selected field
  const fieldForChart = useMemo(
    () =>
      latestSelectedField
        ? gameData.data[latestSelectedField][year]
        : undefined,
    [latestSelectedField],
  );

  // Handles submission: merges draft into main phaseOut state and proceeds to next period
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPhaseOut((phaseOut) => ({ ...phaseOut, ...draft }));
    setPhaseOutDraft({}); // Clear the draft after submit
    proceed();
    close();
  }

  const periodEnd = (parseInt(year) + 3).toString();

  // Fills draft selection with fields according to MDG plan
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

  // Removes a field from the draft plan
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

  // Adds a field to the draft plan
  function addField(field: OilfieldName) {
    setDraft((d) => ({ ...d, [field]: year }));
    setSelectedOrder((prev) => [...prev.filter((f) => f !== field), field]);
    setLatestSelectedField(field);
  }

  // Toggles a field on/off in the draft plan
  function toggle(field: OilfieldName, checked: boolean) {
    if (checked) {
      addField(field);
    } else {
      removeField(field);
    }
  }

  // // Sort oil fields based on sort key and whether already phased out
  // const sortedFields = Object.keys(gameData.data)
  //   .sort((a, b) => {
  //     const aIsDisabled = a in phaseOut;
  //     const bIsDisabled = b in phaseOut;

  //     if (aIsDisabled && !bIsDisabled) return 1;
  //     if (!aIsDisabled && bIsDisabled) return -1;
  //     if (sortKey === "alphabetical") {
  //       return a.localeCompare(b);
  //     }

  //     const aData = gameData.data[a]?.[year];
  //     const bData = gameData.data[b]?.[year];

  //     return (
  //       // (aData?.[sortKey]?.value ?? -Infinity) -
  //       // (bData?.[sortKey]?.value ?? -Infinity)
  //       (bData?.[sortKey]?.value ?? -Infinity) -
  //       (aData?.[sortKey]?.value ?? -Infinity)
  //     );
  //   });

  // const sortedFields = Object.keys(gameData.data)
  //   .filter((k) => !(k in phaseOut))  // only enabled keys
  //   .sort((a, b) => {
  //     const aData = gameData.data[a]?.[year];
  //     const bData = gameData.data[b]?.[year];

  //     if (sortKey === "alphabetical") return a.localeCompare(b);

  //     return (bData?.[sortKey]?.value ?? -Infinity) - (aData?.[sortKey]?.value ?? -Infinity); // descending
  //   });

  const sortedFields = useMemo(() => {
    return Object.keys(gameData.data)
      .filter((k) => !(k in phaseOut))
      .sort((a, b) => {
        const aData = gameData.data[a]?.[year];
        const bData = gameData.data[b]?.[year];

        if (sortKey === "alphabetical") return a.localeCompare(b);

        return (bData?.[sortKey]?.value ?? -Infinity) - (aData?.[sortKey]?.value ?? -Infinity);
      });
  }, [gameData.data, phaseOut, sortKey, year]);

  // Calculate total production/emission reductions for draft fields
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

  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getSortKeyTranslation(str: string) {
    let translation = str;
    switch (str) {
      case "alphabetical": translation = "Alfabetisk"; break;
      case "totalProduction": translation = "Total produksjon"; break;
      case "emission": translation = "Utslipp"; break;
      case "emissionIntensity": translation = "Utslippsintensitet"; break;
      default: break;
    }
    return translation;
  }

  function getMeasurementUnit(str: string) {
    let measurement = "";
    switch (str) {
      case "alphabetical": measurement = ""; break;
      case "totalProduction": measurement = "Sm³"; break;
      case "emission": measurement = "tonn CO₂"; break;
      case "emissionIntensity": measurement = "kg CO₂e/Sm³"; break;
      default: break;
    }
    return measurement;
  }

  function formatValue(value: number, key: SortKey) {
    switch (key) {
      case "totalProduction":
        return `${value.toLocaleString("no-NO")} Sm³`;
      case "emission":
        return `${value.toFixed(1)} tonn CO₂`;
      case "emissionIntensity":
        return `${value.toFixed(2)} kg CO₂e/Sm³`;
      default:
        return "";
    }
  }

  return (
    <form className="" onSubmit={handleSubmit} style={{ width: "100%", all: "unset" }}>

      <div style={{
        width: "100%",
        minWidth: isSmall ? "" : "612px",
        maxWidth: "1024px",
        paddingTop: "1rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        backgroundColor: isDarkMode ? "#133600" : "#e0ffb2",
        color: isDarkMode ? 'inherit' : 'black',
        // color: "#e0ffb2",
      }}>

        <div className={``} style={{
          display: isSmall ? "block" : "none",
          position: isSmall ? "fixed" : "sticky",
          top: "1rem",
          right: "1rem",
          zIndex: "3"
        }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(from)
            }}
            title="Tilbake"
          >
            X
          </button>
        </div>

        <div className="phaseout-dialog-header" style={{ paddingLeft: "1rem" }}>
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

          <div style={{ display: isSmall ? "none" : "block", position: isSmall ? "fixed" : "sticky", top: "0.25rem", right: "0.25rem", zIndex: "3" }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(from)
              }}
              title="Tilbake"
            >
              X
            </button>
          </div>

        </div>

        <div className="phaseout-checkboxes" style={{ marginTop: "1.5rem", paddingLeft: "1rem" }}>
          <h3 className="phaseout-header" style={{ marginBottom: "1.5rem" }}>
            Velg felter for avvikling {year}-{getEndOfTermYear()}
          </h3>
          <ul style={{ marginTop: "0.5rem", marginLeft: 0, padding: 0 }}>
            <li
              style={{
                display: "grid",
                gridTemplateColumns: isSmall ? "1fr 156px" : "1fr 196px",
                alignItems: "center",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                borderBottom: "1px solid #cccccc80",
                padding: "0.25rem 0.5rem",
              }}
            >
              <label style={{ paddingLeft: "0rem", fontWeight: "bold", }}>
                Navn
              </label>
              <div style={{ fontWeight: "bold", }}>
                {getSortKeyTranslation(sortKey)}
                {sortKey !== "alphabetical" && (
                  <>
                    <br />
                    ({getMeasurementUnit(sortKey)})
                  </>
                )}
              </div>
            </li>
            {sortedFields
              .map((k) => {
                const isDisabled = k in phaseOut;
                const dataForYear = gameData.data[k]?.[year];
                const value =
                  sortKey === "alphabetical"
                    ? ""
                    : dataForYear?.[sortKey]?.value ?? "";

                return (
                  <li
                    key={k}
                    className={`phaseout-row ${isDisabled ? "grayed-out-oilfield-checklist" : ""}`}
                    style={{ borderBottom: "1px solid #cccccc0e", }}
                  >
                    <label
                      style={{
                        display: "grid",
                        gridTemplateColumns: isSmall ? "1fr 156px" : "1fr 196px",
                        alignItems: "center",
                        width: "100%",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <input
                          disabled={isDisabled}
                          type="checkbox"
                          onChange={(e) => toggle(k, e.target.checked)}
                          checked={!!draft[k]}
                          onClick={(e) => e.stopPropagation()} // prevent double toggling
                        />
                        {k}
                      </div>
                      <div style={{ textAlign: "left", userSelect: "none", pointerEvents: "none" }}>
                        {value !== "" ? value.toLocaleString("no-NO") : ""}
                      </div>
                    </label>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* <div className="dialog-information-container">

          {latestSelectedField && fieldForChart && (
            <div className="phaseout-latest-oilfield">
              <h3>Sist valgt oljefelt: {latestSelectedField}</h3>
              <p>
                Olje/væskeproduksjon i {year}:{" "}
                {fieldForChart.productionOil?.value ?? "0"} GSm3 olje{" "}
                <InfoTag title="GSm3 = standard kubikkmeter ved standard trykk/temperatur. Brukes for å sammenligne volum.">
                  ?
                </InfoTag>
              </p>
              <p>
                Gasseksport i {year}: {fieldForChart.productionGas?.value ?? "0"}{" "}
                GSm3 gass{" "}
                <InfoTag title="GSm3 = standard kubikkmeter ved standard trykk/temperatur.">
                  ?
                </InfoTag>
              </p>
              <p>
                Utslipp i {year}:{" "}
                {Math.round((fieldForChart.emission?.value ?? 0) / 1000)} tusen
                tonn Co2{" "}
                <InfoTag title="CO2e = CO2-ekvivalenter (inkluderer andre klimagasser omregnet til CO2). ‘Tusen tonn’ betyr at tallet er delt på 1000.">
                  ?
                </InfoTag>
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

        </div> */}

        <div style={{
          position: "sticky",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1rem",
          marginTop: "0.5rem",
          // backgroundColor: "#133600",
          borderTop: "1px solid #e0ffb2",
          backgroundColor: isDarkMode ? "#133600" : "#e0ffb2",
          color: isDarkMode ? 'inherit' : 'black',
        }}>

          <div className={"button-row"} style={{ width: "100%", flex: 1, marginTop: "0rem" }}>
            <button onClick={() => setPhaseOutDraft({})} disabled={Object.keys(phaseOutDraft).length < 1}>Tøm</button>
            <button onClick={handleMdgPlanClick}>
              {isSmall ? `Velg MDGs felter` : `Velg felter fra MDGs plan`}
            </button>
            <button type="submit" disabled={year === "2040"} style={{ flex: 1 }}>
              ♻ Avvikle {' ' + Object.keys(phaseOutDraft).length + ' '} {isSmall ? `felt` : `oljefelt`}
            </button>
          </div>

          {/* <div style={{ height: "128px"}}>
            <h4 style={{ marginBottom: "0.5rem" }}>Felter som avvikles innen {getEndOfTermYear()}:</h4>
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              overflowY: "auto",
              overflowX: "hidden",
            }}>
              {Object.keys(draft).map((navn) => (
                <div
                  key={navn}
                  style={{ border: "1px solid #e0ffb2", padding: "0.25rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", borderRadius: "0.5rem" }}
                >
                  {navn}
                </div>
              ))}
            </div>
          </div> */}

          {/* <div className={"button-row"} style={{ marginTop: "0rem", }}>
            <button type="submit" disabled={year === "2040"}>
              Fase ut valgte felter i {year}
            </button>
            <button onClick={handleMdgPlanClick}>Velg felter fra MDGs plan</button>
          </div> */}

        </div>

      </div>

    </form>

    // <form className="phaseout-dialog" onSubmit={handleSubmit}>

    //   <div style={{ width: "100%", backgroundColor: "#313131ff" }}>

    //     <div className={``} style={{
    //       display: isSmall ? "block" : "none",
    //       position: isSmall ? "fixed" : "sticky",
    //       top: "1rem",
    //       right: "1rem",
    //       zIndex: "3"
    //     }}>
    //       <button
    //         onClick={(e) => {
    //           e.preventDefault();
    //           e.stopPropagation();
    //           navigate(from)
    //         }}
    //         title="Tilbake"
    //       >
    //         X
    //       </button>
    //     </div>

    //     <div className="phaseout-dialog-header">
    //       <div className="phaseout-sort-wrapper">
    //         <label className="phaseout-sort-dropdown">
    //           Sorter etter:{" "}
    //           <select
    //             value={sortKey}
    //             onClick={(e) => e.stopPropagation()}
    //             onChange={(e) => setSortKey(e.target.value as SortKey)}
    //           >
    //             <option value="alphabetical">Alfabetisk</option>
    //             <option value="totalProduction">Total produksjon</option>
    //             <option value="emission">Utslipp</option>
    //             <option value="emissionIntensity">Utslippsintensitet</option>
    //           </select>
    //         </label>
    //       </div>

    //       <div style={{ display: isSmall ? "none" : "block", position: isSmall ? "fixed" : "sticky", top: "0.25rem", right: "0.25rem", zIndex: "3" }}>
    //         <button
    //           onClick={(e) => {
    //             e.preventDefault();
    //             e.stopPropagation();
    //             navigate(from)
    //           }}
    //           title="Tilbake"
    //         >
    //           X
    //         </button>
    //       </div>

    //     </div>

    //     <div className="phaseout-checkboxes">
    //       <h3 className="phaseout-header">
    //         Velg felter for avvikling {year}-{getEndOfTermYear()}
    //       </h3>
    //       <ul>
    //         {sortedFields.map((k) => {
    //           const isDisabled = k in phaseOut;
    //           return (
    //             <li
    //               key={k}
    //               className={isDisabled ? "grayed-out-oilfield-checklist" : ""}
    //             >
    //               <label>
    //                 <input
    //                   disabled={isDisabled}
    //                   type="checkbox"
    //                   onChange={(e) => {
    //                     toggle(k, e.target.checked);
    //                   }}
    //                   checked={!!draft[k]}
    //                 />
    //                 {` `}{k}
    //               </label>
    //             </li>
    //           );
    //         })}
    //       </ul>
    //     </div>

    //     <div className="dialog-information-container">

    //       {Object.keys(draft).length > 0 && (
    //         <div
    //           className="phaseout-fieldnames-selected"
    //           style={{ marginBottom: "2rem" }}
    //         >

    //           <h4 style={{ marginBottom: "0.5rem" }}>Felter som avvikles innen {getEndOfTermYear()}:</h4>
    //           <div style={{ width: "100%", display: "flex", flex: 0, flexWrap: "wrap", alignItems: "center", gap: "0.5rem", }}>
    //             {Object.keys(draft).map((navn) => (
    //               <div
    //                 key={navn}
    //                 style={{ border: "1px solid #e0ffb2", padding: "0.25rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", borderRadius: "0.5rem" }}
    //               >
    //                 {navn}
    //               </div>
    //             ))}
    //           </div>
    //           {/* <ul>
    //           {Object.keys(draft).map((k) => (
    //             <li key={k}>
    //               <label>{k}</label>
    //             </li>
    //           ))}
    //         </ul> */}
    //         </div>
    //       )}

    //       {latestSelectedField && fieldForChart && (
    //         <div className="phaseout-latest-oilfield">
    //           <h3>Sist valgt oljefelt: {latestSelectedField}</h3>
    //           <p>
    //             Olje/væskeproduksjon i {year}:{" "}
    //             {fieldForChart.productionOil?.value ?? "0"} GSm3 olje{" "}
    //             <InfoTag title="GSm3 = standard kubikkmeter ved standard trykk/temperatur. Brukes for å sammenligne volum.">
    //               ?
    //             </InfoTag>
    //           </p>
    //           <p>
    //             Gasseksport i {year}: {fieldForChart.productionGas?.value ?? "0"}{" "}
    //             GSm3 gass{" "}
    //             <InfoTag title="GSm3 = standard kubikkmeter ved standard trykk/temperatur.">
    //               ?
    //             </InfoTag>
    //           </p>
    //           <p>
    //             Utslipp i {year}:{" "}
    //             {Math.round((fieldForChart.emission?.value ?? 0) / 1000)} tusen
    //             tonn Co2{" "}
    //             <InfoTag title="CO2e = CO2-ekvivalenter (inkluderer andre klimagasser omregnet til CO2). ‘Tusen tonn’ betyr at tallet er delt på 1000.">
    //               ?
    //             </InfoTag>
    //           </p>
    //           <div className="phaseout-emission-chart">
    //             {fieldForChart && (
    //               <EmissionIntensityBarChart
    //                 year={year}
    //                 field={latestSelectedField}
    //                 emissionIntensity={fieldForChart.emissionIntensity?.value}
    //               />
    //             )}
    //           </div>
    //         </div>
    //       )}

    //       {/* {Object.keys(draft).length > 0 && (
    //       <div className="phaseout-total-production">
    //         <strong>Produksjon som reduseres innen {periodEnd}:</strong>
    //         <p>
    //           {totalOilProduction} GSm3 olje{" "}
    //           <InfoTag title="GSm3 = standard kubikkmeter. Viser volum ved standard forhold.">
    //             ?
    //           </InfoTag>
    //         </p>
    //         <p>
    //           {totalGasProduction} GSm3 gass{" "}
    //           <InfoTag title="GSm3 = standard kubikkmeter. Viser volum ved standard forhold.">
    //             ?
    //           </InfoTag>
    //         </p>
    //         <strong>Utslipp som reduseres innen {periodEnd}:</strong>{" "}
    //         <p>
    //           {Math.round(totalEmission / 1_000)} tusen tonn CO2e{" "}
    //           <InfoTag title="CO2e = CO2-ekvivalenter. ‘Tusen tonn’ = delt på 1000.">
    //             ?
    //           </InfoTag>
    //         </p>
    //       </div>
    //     )} */}

    //     </div>

    //     <div className={"button-row"}>
    //       <button type="submit" disabled={year === "2040"}>
    //         Fase ut valgte felter i {year}
    //       </button>
    //       <button onClick={handleMdgPlanClick}>Velg felter fra MDGs plan</button>
    //     </div>

    //   </div>

    // </form>
  );
}
