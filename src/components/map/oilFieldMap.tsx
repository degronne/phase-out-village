import React, { useEffect, useMemo, useRef, useState } from "react";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { OSM, StadiaMaps } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { OilfieldName, OilfieldValues, slugify, Slugify } from "../../data";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { containsCoordinate, createEmpty, extend, getCenter } from "ol/extent";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { aggregateOilFields } from "../../data/aggregateOilFields";

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
  apiKey: "5a2e5035-ad83-4002-a6e6-5f679b73240f",
});

const map = new Map({ view });

function showFieldNameStyle(f: FeatureLike, overflow: boolean) {
  const text = f.getProperties()["fldName"];
  const font = "9pt sans-serif";
  return new Style({
    text: new Text({ font, text, overflow, placement: "point" }),
    geometry: new Point(getCenter(f.getGeometry()!.getExtent())),
  });
}

function hoverStyle(f: FeatureLike) {
  return [
    new Style({ stroke: new Stroke({ color: "black" }) }),
    showFieldNameStyle(f, true),
  ];
}

export function OilFieldMap({ slug }: { slug?: Slugify<OilfieldName> }) {
  const isDarkMode = usePrefersDarkMode();
  const backgroundLayer = useMemo(
    () =>
      new TileLayer({ source: isDarkMode ? darkTileSource : lightTileSource }),
    [isDarkMode],
  );
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const oilfieldStyle = useMemo<(f: FeatureLike) => Style[]>(() => {
    return (f: FeatureLike): Style[] => {
      if (selectedFields.has(f.getProperties().fldName)) {
        return [
          new Style({ fill: new Fill({ color: "blue" }) }),
          showFieldNameStyle(f, true),
        ];
      }
      return [
        new Style({ fill: new Fill({ color: "red" }) }),
        new Style({
          text: new Text({
            font: "9pt sans-serif",
            text: f.getProperties()["fldName"],
          }),
        }),
      ];
    };
  }, [selectedFields]);
  const oilfieldLayer = useMemo(
    () => new VectorLayer({ source: oilfieldSource, style: oilfieldStyle }),
    [oilfieldStyle],
  );
  const layers = useMemo(
    () => [backgroundLayer, oilfieldLayer],
    [backgroundLayer, oilfieldLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const [hoverFeature, setHoverFeature] = useState<Feature | undefined>();

  function handlePointerMove(e: MapBrowserEvent) {
    const feature = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (l) => l.getSource() === oilfieldSource,
    })[0];
    setHoverFeature((old) => {
      if (old == feature) return old;
      if (!old) return feature as Feature;
      if (containsCoordinate(old.getGeometry()!.getExtent(), e.coordinate))
        return old;
      return feature as Feature;
    });
  }

  useEffect(() => {
    hoverFeature?.setStyle((f) => [...hoverStyle(f), ...oilfieldStyle(f)]);
    return () => hoverFeature?.setStyle(undefined);
  }, [hoverFeature]);

  function handleClick(e: MapBrowserEvent) {
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (l) => l.getSource() === oilfieldSource,
    });
    if (features.length === 1) {
      setHoverFeature(undefined);
      const { geometry, ...properties } = features[0].getProperties();
      navigate(`/map/${slugify(aggregateOilFields[properties.fldName])}`);
    }
  }

  const mapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    map.setTarget(mapRef.current!);
    oilfieldSource.once("featuresloadend", () => selectOilField());
    map.on("click", handleClick);
    map.on("pointermove", handlePointerMove);
    return () => {
      map.un("pointermove", handlePointerMove);
      map.un("click", handleClick);
    };
  }, []);
  function selectOilField() {
    const field = OilfieldValues.find((s) => slugify(s) === slug)!;
    const selectedFields = new Set(
      Object.entries(aggregateOilFields)
        .filter(([_, v]) => v === field)
        .map(([k, _]) => k),
    );
    const selectedFeatures = oilfieldSource
      .getFeatures()
      .filter((f) => selectedFields.has(f.getProperties().fldName));

    if (selectedFeatures.length) {
      const extent = createEmpty();
      for (const feature of selectedFeatures) {
        extend(extent, feature.getGeometry()!.getExtent());
      }
      view.fit(extent, { maxZoom: 9, padding: [5, 5, 5, 5], duration: 500 });
    } else if (oilfieldSource.getFeatures().length > 0) {
      view.fit(oilfieldSource.getExtent(), {
        duration: 500,
        padding: [10, 10, 10, 10],
      });
    }
    setSelectedFields(selectedFields);
  }
  useEffect(() => selectOilField(), [slug]);

  return <div ref={mapRef}></div>;
}
