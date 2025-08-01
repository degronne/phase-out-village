import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { containsCoordinate, createEmpty, extend, getCenter } from "ol/extent";
import { Feature, Map, MapBrowserEvent } from "ol";
import { useEffect, useMemo, useState } from "react";
import { OilfieldValues, slugify } from "../../data";
import { aggregateOilFields } from "../../data/aggregateOilFields";
import { useNavigate } from "react-router-dom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { BASE_URL } from "../../../config";
import { GeoJSON } from "ol/format";

const oilfieldSource = new VectorSource({
  url: `${BASE_URL}/geojson/oilfields.geojson`,
  format: new GeoJSON(),
});

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

export function useOilfieldLayer(map: Map, slug: string | undefined) {
  const [selectedFieldNames, setSelectedFieldNames] = useState<Set<string>>(
    new Set(),
  );
  const [hoverFeature, setHoverFeature] = useState<Feature | undefined>();

  useEffect(() => {
    oilfieldSource.once("featuresloadend", () => selectOilField());
    map.on("click", handleClick);
    map.on("pointermove", handlePointerMove);
    return () => {
      map.un("pointermove", handlePointerMove);
      map.un("click", handleClick);
    };
  }, []);

  function selectOilField() {
    const view = map.getView()!;
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
    setSelectedFieldNames(selectedFields);
  }

  useEffect(() => selectOilField(), [slug]);

  const oilfieldStyle = useMemo<(f: FeatureLike) => Style[]>(() => {
    return (f: FeatureLike): Style[] => {
      if (selectedFieldNames.has(f.getProperties().fldName)) {
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
  }, [selectedFieldNames]);

  function handlePointerMove(e: MapBrowserEvent) {
    const feature = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (l) => l.getSource() === oilfieldSource,
    })[0];
    setHoverFeature((old) => {
      if (old == feature) return old;
      if (!old || feature) return feature as Feature;
      if (containsCoordinate(old.getGeometry()!.getExtent(), e.coordinate))
        return old;
      return undefined;
    });
  }

  useEffect(() => {
    hoverFeature?.setStyle((f) => [...hoverStyle(f), ...oilfieldStyle(f)]);
    return () => hoverFeature?.setStyle(undefined);
  }, [hoverFeature]);

  const navigate = useNavigate();

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

  const oilfieldLayer = useMemo(
    () => new VectorLayer({ source: oilfieldSource, style: oilfieldStyle }),
    [oilfieldStyle],
  );
  return { oilfieldLayer };
}
