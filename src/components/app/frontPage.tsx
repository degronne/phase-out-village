import React, { useState } from "react";
import { Dialog } from "../ui/dialog";
import { useNavigate } from "react-router-dom";

import arild from "./arild-hermstad.png";

const OLJEPLAN_LINK = "https://mdg.no/oljeplan";

export function FrontPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <>
      <h1>Chill, baby! Chill!</h1>
      <div className="welcome">
        <Dialog open={open} onClose={() => navigate("/map")}>
          <h1>Fas ut oljen – bli en klimahelt!</h1>

          <p>
            Norsk olje og gass har gitt oss enorm rikdom, men har nå blitt et
            stort problem: Den bidrar enormt til klimaproblemet, den stjeler
            kompetanse og strøm fra annet næringsliv og gjør norsk økonomi
            veldig sårbar når våre største kunder kutter ut fossil energi.
          </p>

          <p>
            <img src={arild} alt={"MDG partileder Arild Hermstad"} />
            Klimautvalget 2050 har derfor anbefalt Norge å lage en «strategi for
            sluttfasen av norsk petroleumsvirksomhet», og{" "}
            <a href={OLJEPLAN_LINK}>MDG har laget en slik plan</a> som faser ut
            feltene på norsk sokkel innen 2040. Vi starter naturlig nok med de
            feltene som slipper ut mest og produserer minst.
          </p>

          <p>
            Ingen regjeringer har giddet diskutere hvordan utfasing av olje- og
            gassproduksjon kan skje på en smart måte, noe som er veldig dumt.
            Men nå har du sjansen! Velg hvilke felter du vil fase ut i hvilken
            periode, og se hva som skjer med utslippene.
          </p>

          <p>
            Har du det som skal til for å lage utfasingsplanen Norge trenger?
          </p>

          <div className={"button-row"}>
            <button onClick={() => setOpen(false)}>Jeg er klar</button>
          </div>
        </Dialog>
      </div>
    </>
  );
}
