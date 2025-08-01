import React, { useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { OilfieldName, Slugify } from "../../data";
import { useOilfieldLayer } from "./useOilfieldLayer";
import { useBackgroundLayer } from "./useBackgroundLayer";

useGeographic();

const defaultViewport = { center: [10, 65], zoom: 4 };
const view = new View(defaultViewport);

const map = new Map({ view });

export function OilFieldMap({ slug }: { slug?: Slugify<OilfieldName> }) {
  const { backgroundLayer } = useBackgroundLayer();
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
