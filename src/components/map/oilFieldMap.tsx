import React, { useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { Slugify } from "../../data/slugify";
import { useOilfieldLayer } from "./useOilfieldLayer";
import { useBackgroundLayer } from "./useBackgroundLayer";
import { OilfieldName } from "../../data/gameData";

useGeographic(); // Enable geographic coordinates (lon/lat) instead of default projection

// Default initial map view (center coordinates and zoom level)
const defaultViewport = { center: [10, 65], zoom: 4 };
const view = new View(defaultViewport);

// Initialize OpenLayers Map instance with the default view
const map = new Map({ view });

/**
 * Displays an interactive map of oil fields.
 *
 * @param slug - Optional slug of a specific oil field to highlight/focus on the map.
 *
 * This component uses OpenLayers for rendering the map, with separate layers for:
 * - Background map (terrain, tiles, etc.)
 * - Oil fields overlay
 *
 * It updates the map layers whenever the background or oilfield layer changes,
 * and binds the map to the rendered DOM element via a ref.
 */
export function OilFieldMap({ slug }: { slug?: Slugify<OilfieldName> }) {
  // Get the background map layer (terrain/tiles)
  const { backgroundLayer } = useBackgroundLayer();
  // Get the oilfield overlay layer, optionally focusing on the given slug
  const { oilfieldLayer } = useOilfieldLayer(map, slug);
  // Combine layers into an array for the map
  const layers = useMemo(
    () => [backgroundLayer, oilfieldLayer],
    [backgroundLayer, oilfieldLayer],
  );
  // Update the map whenever the layers change
  useEffect(() => map.setLayers(layers), [layers]);

  // Create a ref for the div that will hold the map.
  // Initially null, but after the first render it points to the DOM element,
  // which is then passed to OpenLayers via map.setTarget().
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Set the OpenLayers map target to the div element once the component mounts
  useEffect(() => map.setTarget(mapRef.current!), []);

  return <div className={"map-container"} ref={mapRef}></div>;
}
