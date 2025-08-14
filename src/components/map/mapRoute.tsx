import { OilFieldMap } from "./oilFieldMap";
import { Route, Routes, useParams } from "react-router-dom";
import React from "react";
import { OilFieldMapList } from "./oilFieldMapList";
import { OilfieldDetails } from "./oilfieldDetails";
import { Slugify } from "../../data/slugify";
import { OilfieldName } from "../../data/gameData";

export function MapRoute() {
  return (
    <Routes>
      <Route
        path={""}
        element={
          <div className="oilfield-map">
            <OilFieldMap />
            <div className="details">
              <OilFieldMapList />
            </div>
          </div>
        }
      />
      <Route path={":slug"} element={<SlugWrapper />} />
    </Routes>
  );
}

const SlugWrapper = () => {
  const { slug } = useParams();
  return (
    <div className="oilfield-map">
      <OilFieldMap slug={slug as Slugify<OilfieldName>} />
      <div className="details">
        <OilfieldDetails slug={slug as Slugify<OilfieldName>} />
      </div>
    </div>
  );
};
