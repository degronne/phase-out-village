import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { gameData } from "../../data/gameData";
import { slugify } from "../../data/slugify";

export function OilFieldMapList() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div>
      <h1>Oljefelter</h1>
      <ul>
        {gameData.allFields.map((o) => (
          <li key={o}>
            <Link to={`/map/${slugify(o)}`}>{o}</Link>
            {phaseOut[o] && ` (din plan: avvikles i ${phaseOut[o]})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
