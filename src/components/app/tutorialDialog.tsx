import React, { useState } from "react";

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
        {/* <p>
          Lag en plan for å <b>fase ut olje- og gassfelter</b> fram mot 2040. Du velger
          hvilke felt som avvikles i hver 4-årsperiode, og ser effekten på
          utslipp og produksjon.
        </p> */}
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
        {/* <p>
          Gå til Kart for å utforske feltene. Klikk på et felt i kartet eller i
          listen for å se detaljer om produksjon, utslipp og intensitet.
        </p> */}
        <ul>
          <li>
            Gå til <b>Kart</b> for å utforske feltene.
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
      {/* <p>
        Brukte målenheter inkluderer <a href={`https://no.wikipedia.org/wiki/Standardkubikkmeter`} target="_blank">MSm³</a> (standardkubikkmeter)
        for volum av gass/olje, <a href={`https://no.wikipedia.org/wiki/CO2-ekvivalent`} target="_blank">CO2e</a> (CO2-ekvivalent) per 
        tusen tonn for måling av utslipp, og CO2e / <a href="https://en.wikipedia.org/wiki/Barrel_of_oil_equivalent" target="_blank">BOE</a> (barrel of oil equivalent) i kg for måling av utslippsintensitet.
      </p> */}
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
        {/* <p>Litt om begrepene du ser:</p>
        <ul>
          <li>
            GSm3: Standard kubikkmeter gass eller olje ved standard trykk og
            temperatur. Brukes for å sammenligne volum.
          </li>
          <li>
            «tusen tonn CO2e»: Utslipp målt i tusen tonn CO2-ekvivalenter
            (CO2e). «e» betyr at også andre klimagasser er omregnet til CO2.
          </li>
          <li>
            Utslippsintensitet (kg CO2e/BOE): Hvor mange kilo CO2-ekvivalenter
            som slippes ut per produsert enhet energi. BOE = «barrel of oil
            equivalent» (energiinnhold tilsvarende ett fat olje).
          </li>
        </ul> */}
      </>
    ),
  },
  {
    title: "Velg felter for avvikling",
    body: (
      <>
        {/* <p>Trykk «Velg felter for avvikling» i toppfeltet. I dialogen kan du:</p> */}
        {/* <p>Trykk «Velg felter for avvikling» i toppfeltet.</p> */}
        {/* <ul>
          <li>
            Sortere felter etter alfabet, produksjon, utslipp eller intensitet
          </li>
          <li>Huke av felter som skal avvikles i inneværende periode</li>
          <li>
            Se summer for redusert produksjon og utslipp innen periodens slutt
          </li>
        </ul> */}
        {/* <p>Trykk «Fase ut valgte felter» for å gå til neste periode.</p> */}
        <ul>
          <li>
            Trykk «Velg felter for avvikling» i toppfeltet.
          </li>
          <li>
            Trykk «Fase ut valgte felter» for å gå til neste periode.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Se konsekvensene",
    body: (
      <>
        {/* <p>
          Under Emissioner og Produksjon ser du grafer som oppdateres med din
          plan. «Din plan» viser hvilke felt du allerede har avviklet.
        </p> */}
        <ul>
          <li>
            Under <b>Emissioner og Produksjon</b> ser du grafer som oppdateres med din
          plan.
          </li>
          <li>
            «Din plan» viser hvilke felt du allerede har avviklet.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Fullfør og start på nytt",
    body: (
      <>
        {/* <p>
          Når du når 2040 vises en oppsummering. Du kan når som helst starte på
          nytt fra toppmenyen.
        </p> */}
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

  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent:"space-between" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{steps[index].title}</h2>
        <button onClick={onClose} style={{ borderRadius: '1rem'}}>✖</button>
      </div>

      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginTop: "1rem", marginBottom: "1rem", overflowY: "auto" }}>
        {steps[index].body}
      </div>

      <div
        className="button-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Tilbake
        </button>
        <span style={{ minWidth: 70, textAlign: "center" }}>
          Steg {index + 1} / {steps.length}
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
