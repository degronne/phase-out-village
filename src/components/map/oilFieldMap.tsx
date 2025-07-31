import React, { useEffect, useMemo, useRef, useState } from "react";
import { Feature, Map, View } from "ol";
import { OSM, StadiaMaps } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Style, Text } from "ol/style";
import { OilfieldName, slugify, Slugify } from "../../data";
import { Point, SimpleGeometry } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { getCenter } from "ol/extent";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";

useGeographic();

const oilfieldSource = new VectorSource({
  url: `${BASE_URL}/geojson/oilfields.geojson`,
  format: new GeoJSON(),
});
const defaultViewport = { center: [10, 65], zoom: 4 };
const view = new View(defaultViewport);
const lightTileSource = new OSM();
const darkTileSource = new StadiaMaps({
  layer: "alidade_smooth_dark",
});

const oilfieldLayer = new VectorLayer({
  source: oilfieldSource,
  style: (f) =>
    new Style({
      fill: new Fill({ color: "red" }),
      text: new Text({
        font: "9pt sans-serif",
        text: f.getProperties()["fldName"],
        //overflow: true,
      }),
    }),
});
const map = new Map({
  layers: [new TileLayer({ source: darkTileSource }), oilfieldLayer],
  view,
});

function focusStyle(f: FeatureLike) {
  return [
    new Style({
      fill: new Fill({ color: "blue" }),
    }),
    new Style({
      text: new Text({
        font: "9pt sans-serif",
        text: f.getProperties()["fldName"],
        overflow: true,
        placement: "point",
      }),
      geometry: new Point(getCenter(f.getGeometry()!.getExtent())),
    }),
  ];
}

export function OilFieldMap({ slug }: { slug?: Slugify<OilfieldName> }) {
  const isDarkMode = usePrefersDarkMode();
  const backgroundLayer = useMemo(
    () =>
      new TileLayer({ source: isDarkMode ? darkTileSource : lightTileSource }),
    [isDarkMode],
  );
  const layers = useMemo(
    () => [backgroundLayer, oilfieldLayer],
    [backgroundLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    map.setTarget(mapRef.current!);
    map.on("click", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel);
      if (features.length === 1) {
        const { geometry, ...properties } = features[0].getProperties();
        navigate(`/map/${slugify(properties.fldName)}`);
      }
    });
    oilfieldSource.once("featuresloadend", () => selectOilField());
  }, []);
  const [selectedFeature, setSelectedFeature] = useState<Feature>();
  function selectOilField() {
    setSelectedFeature(
      oilfieldSource
        .getFeatures()
        .find((f) => slugify(f.getProperties().fldName) === slug),
    );
  }
  useEffect(() => selectOilField(), [slug]);

  useEffect(() => {
    selectedFeature?.setStyle(focusStyle);
    const geometry = selectedFeature?.getGeometry();
    if (geometry) {
      console.log({ geometry });
      view.fit(geometry as SimpleGeometry, {
        maxZoom: 9,
        duration: 500,
      });
    } else if (oilfieldSource.getFeatures().length > 0) {
      view.fit(oilfieldSource.getExtent(), {
        duration: 500,
        padding: [10, 10, 10, 10],
      });
    }
    return () => selectedFeature?.setStyle(undefined);
  }, [selectedFeature]);

  return <div ref={mapRef}></div>;
}
