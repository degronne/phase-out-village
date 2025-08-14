import React from "react";
import { Link } from "react-router-dom";
import { Slugify } from "../../data/data";
import { OilProductionForFieldChart } from "../production/oilProductionForFieldChart";
import { EmissionsForFieldChart } from "../emissions/emissionsForFieldChart";
import { GasProductionForFieldChart } from "../production/gasProductionForFieldChart";
import { gameData, OilfieldName, slugify } from "../../data/gameData";

export function OilfieldDetails({ slug }: { slug: Slugify<OilfieldName> }) {
  const name = gameData.allFields.find((n) => slugify(n) === slug);
  if (!name) return null;
  return (
    <div>
      <h3>Detaljer for oljefelt: {name}</h3>
      <Link to={".."}>Vis alle</Link>
      <OilProductionForFieldChart field={name} />
      <GasProductionForFieldChart field={name} />
      <EmissionsForFieldChart field={name} />
    </div>
  );
}
