import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../../applicationContext";
import { gameData } from "../../data/gameData";
import { slugify } from "../../data/slugify";

/**
 * Component that renders a list of all oil fields with links to their map pages.
 * It also shows the phase-out year from the user's plan if available.
 */
export function OilFieldMapList() {
  const { phaseOut } = useContext(ApplicationContext);
  return (
    <div>
      <h1>Oljefelter</h1>
      <ul>
        {gameData.allFields.map((o) => (
          <li key={o}>
            <Link to={`/map/${slugify(o)}`}>{o}</Link> {/* Link to the map view for this oil field */}
            
            {/* Show the year this field is scheduled to be phased out in the user's plan */}
            {phaseOut[o] && ` (din plan: avvikles i ${phaseOut[o]})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
