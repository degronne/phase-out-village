import React, { useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { OSM, StadiaMaps } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { OilfieldName, Slugify } from "../../data";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { useOilfieldLayer } from "./useOilfieldLayer";

useGeographic();

const defaultViewport = { center: [10, 65], zoom: 4 };
const view = new View(defaultViewport);
const lightTileSource = new OSM();
const darkTileSource = new StadiaMaps({
  layer: "alidade_smooth_dark",
  apiKey: "5a2e5035-ad83-4002-a6e6-5f679b73240f",
});

const map = new Map({ view });

export function OilFieldMap({ slug }: { slug?: Slugify<OilfieldName> }) {
  const isDarkMode = usePrefersDarkMode();
  const backgroundLayer = useMemo(
    () =>
      new TileLayer({ source: isDarkMode ? darkTileSource : lightTileSource }),
    [isDarkMode],
  );
  const { oilfieldLayer } = useOilfieldLayer(map, slug);
  const layers = useMemo(
    () => [backgroundLayer, oilfieldLayer],
    [backgroundLayer, oilfieldLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => map.setTarget(mapRef.current!), []);

  return <div ref={mapRef}></div>;
}
