import React, { useState } from "react";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

/**
 * Steps for the tutorial dialog. Each step has:
 * - title: heading of the tutorial step
 * - body: JSX content for the step
 */
const steps = [
  {
    title: "Målet",
    body: (
      <>
        <ul>
          <li>
            Lag en plan for å <b>fase ut olje- og gassfelter</b> fram mot 2040.
          </li>
          <li>
            Du velger
            hvilke felt som avvikles i hver 4-årsperiode, og ser effekten på
            utslipp og produksjon.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Kart og feltliste",
    body: (
      <>
        <ul>
          <li>
            Gå til <strong>«Kart»</strong> for å utforske feltene.
          </li>
          <li>
            Klikk på et felt i kartet eller i
            listen for å se detaljer om produksjon, utslipp og intensitet.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Måleenheter",
    body: (
      <>
        <ul>
          <li>
            <a href={`https://no.wikipedia.org/wiki/Standardkubikkmeter`} target="_blank">MSm³</a> (standardkubikkmeter) for volum av gass/olje.
          </li>
          <li>
            <a href={`https://no.wikipedia.org/wiki/CO2-ekvivalent`} target="_blank">CO2e</a> (CO2-ekvivalent) per
            tusen tonn for måling av utslipp.
          </li>
          <li>
            CO2e / <a href="https://en.wikipedia.org/wiki/Barrel_of_oil_equivalent" target="_blank">BOE</a> (barrel of oil equivalent) i kg for måling av utslippsintensitet.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Velg felter for avvikling",
    body: (
      <>
        <ul>
          <li>
            Trykk <strong>«Velg felter å stenge»</strong> nede til høyre.
          </li>
          <li>
            Trykk <strong>«Avvikle»</strong> for å gå til neste periode.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Se konsekvensene",
    body: (
      <>
        <ul>
          <li>
            Under <b>Emissioner og Produksjon</b> ser du grafer som oppdateres med din
            plan.
          </li>
          <li>
            <strong>«Plan»</strong> viser hvilke felt du allerede har avviklet.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Fullfør og start på nytt",
    body: (
      <>
        <ul>
          <li>
            Når du når <b>2040</b> vises en oppsummering.
          </li>
          <li>
            Du kan når som helst starte på nytt fra toppmenyen.
          </li>
        </ul>
      </>
    ),
  },
];

/**
 * TutorialDialog component renders a modal dialog showing tutorial steps.
 *
 * Props:
 * - onClose: optional callback when the tutorial is finished or closed.
 *
 * Handles navigation through steps with "Tilbake" and "Neste" buttons.
 * Disables navigation buttons at start/end.
 */
export function TutorialDialog({ onClose }: { onClose?: () => void }) {
  const [index, setIndex] = useState(0);
  const last = index === steps.length - 1;
  const isSmall = useIsSmallScreen();

  return (
    <div style={{ height: "100%", width: "100%", maxWidth: "100%", display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", }}>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: isSmall ? "end" : "space-between",
          alignItems: "center",
          paddingTop: isSmall ? "1rem" : ""
        }}
      >
        <h2 style={{ display: isSmall ? "none" : "block" }}>{steps[index].title}</h2>
        <button onClick={onClose} style={{ borderRadius: '1rem' }} title={`Lukk`}>✖</button>
      </div>

      <div>
        <h2 style={{ display: isSmall ? "block" : "none", paddingLeft: "1rem"}}>{steps[index].title}</h2>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", marginTop: "1rem", marginBottom: "1rem", overflowY: "auto" }}>
          {steps[index].body}
        </div>
      </div>

      {/* <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: isSmall ? "1rem" : ""
        }}
      >
        <h2>{steps[index].title}</h2>
        <button onClick={onClose} style={{ borderRadius: '1rem' }} title={`Lukk`}>✖</button>
      </div>

      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginTop: "1rem", marginBottom: "1rem", overflowY: "auto" }}>
        {steps[index].body}
      </div> */}

      <div
        className="button-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          gap: "1rem",
          paddingTop: isSmall ? "" : "1rem",
          paddingBottom: isSmall ? "1rem" : ""
        }}
      >
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Tilbake
        </button>
        <span style={{ minWidth: 70, textAlign: "center" }}>
          Steg: {index + 1} / {steps.length}
        </span>
        {last ? (
          <button onClick={onClose}>Ferdig</button>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
            disabled={index >= steps.length - 1}
          >
            Neste
          </button>
        )}
      </div>

    </div>
  );
}
