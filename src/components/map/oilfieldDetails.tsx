import React from "react";
import { Link } from "react-router-dom";
import { slugify, Slugify } from "../../data/slugify";
import { EmissionsForFieldChart } from "../emissions/emissionsForFieldChart";
import { gameData, OilfieldName } from "../../data/gameData";
import { CombinedProductionForFieldChart } from "../production/combinedProductionForFieldChart";

/**
 * Displays detailed information for a specific oil field.
 *
 * @param slug - The slugified name of the oil field to display.
 */
export function OilfieldDetails({ slug }: { slug: Slugify<OilfieldName> }) {
  // Find the original name of the oil field from the slug
  const name = gameData.allFields.find((n) => slugify(n) === slug);
  if (!name) return null;
  return (
    <div>
      <h3>Detaljer for oljefelt: {name}</h3>
      <Link to={".."}>Vis alle</Link>
      <CombinedProductionForFieldChart field={name} />
      <EmissionsForFieldChart field={name} />
    </div>
  );
}
