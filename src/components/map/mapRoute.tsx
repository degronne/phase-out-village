import { OilFieldMap } from "./oilFieldMap";
import { Route, Routes, useParams } from "react-router-dom";
import React from "react";
import { OilFieldMapList } from "./oilFieldMapList";
import { OilfieldDetails } from "./oilfieldDetails";
import { Slugify } from "../../data/slugify";
import { OilfieldName } from "../../data/gameData";

/**
 * Main route for the oil field map.
 *
 * Displays a list and map of all oil fields, or a specific field based on the URL slug.
 * - Default path ("") shows all oil fields on the map with a details list.
 * - Path with a slug (":slug") shows a specific oil field and its details.
 */
export function MapRoute() {
  return (
    <Routes>
      {/* Default route: show map and list of all oil fields */}
      <Route
        path={""}
        element={
          <div className="oilfield-map">
            <OilFieldMap /> {/* Interactive oil field map */}
            <div className="details"> {/* Sidebar/details panel listing all oil fields */}
              <OilFieldMapList />
            </div>
          </div>
        }
      />
      <Route path={":slug"} element={<SlugWrapper />} /> {/* Route for a specific oil field based on slug */}
    </Routes>
  );
}

/** Wrapper component for displaying a specific oil field based on URL slug. */
const SlugWrapper = () => {
  const { slug } = useParams();
  return (
    <div className="oilfield-map">
      <OilFieldMap slug={slug as Slugify<OilfieldName>} /> {/* Map focused on a specific oil field */}
      <div className="details"> {/* Sidebar with details for this specific oil field */}
        <OilfieldDetails slug={slug as Slugify<OilfieldName>} />
      </div>
    </div>
  );
};
