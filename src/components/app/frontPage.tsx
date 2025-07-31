import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { useNavigate } from "react-router-dom";

export function FrontPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <>
      <h1>Chill, baby! Chill!</h1>
      <div className="welcome">
        <Dialog open={open} onClose={() => navigate("/map")}>
          <h1>Kan du hjelpe Arbeiderpartiet?</h1>

          <p>
            Visste du at produksjon av olje og gass står for{" "}
            <a
              href={
                "https://www.ssb.no/natur-og-miljo/forurensning-og-klima/statistikk/utslipp-til-luft"
              }
            >
              en fjerdedel av Norges utslipp av klimagasser
            </a>
            ? Fra 2025 til 2040 vil dette etter Sokkeldirektorats beregninger
            stå for 10 zillioner tonn med CO2, samtidig som det planlegges å
            bruke XX TWh med strøm årlig (gjennomsnitt) på å elektrifisere med
            kraft fra land. (TODO: kvalitetssikre tallet). Og da regner vi ikke
            med utslippene når olja og gassen brennes i utlandet som er cirka 50
            ganger så mye.
          </p>

          <p>
            Samtidig trenger norsk næringsliv flere ben å stå på, for sokkelen
            begynner å tømmes for reserver. Klimautvalget 2050 har anbefalt
            Norge å lage en "strategi for sluttfasen av norsk
            petroleumsvirksomhet", og{" "}
            <a href="https://mdg.no/oljeplan">MDG har laget en slik plan</a>. Vi
            vil fase ut feltene på norsk sokkel innen 2040, og ønsker å starte
            med feltene med høyest utslipp og lavest produksjon.
          </p>

          <p>
            Du har fått jobben som energiminister for en dag, og er bedt om å
            lage en utfasingsplan som balanserer utslippskutt og
            produksjonsnivåer på en best mulig måte frem mot 2040.
          </p>

          <p>Har du det som skal til for å lage en slik plan?</p>

          <p>
            <button onClick={() => setOpen(false)}>Jeg er klar</button>
          </p>
        </Dialog>
      </div>
    </>
  );
}
