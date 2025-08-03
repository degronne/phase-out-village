import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { oilfieldNames, oilfields } from "../../data";
import { ApplicationContext } from "../../applicationContext";

export function OilFieldMapList() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div>
      <h1>Oljefelter</h1>
      <ul>
      {oilfields.map((o) => (
        <li key={o}>
          <Link to={`/map/${o}`}>{oilfieldNames[o]}</Link>
          {phaseOut[oilfieldNames[o]] &&
            ` (din plan: avvikles i ${phaseOut[oilfieldNames[o]]})`}
        </li>
      ))}
      </ul>
    </div>
  );
}
