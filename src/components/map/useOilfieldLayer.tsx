import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { containsCoordinate, createEmpty, extend, getCenter } from "ol/extent";
import { Feature, Map, MapBrowserEvent } from "ol";
import { useContext, useEffect, useMemo, useState } from "react";
import { OilfieldValues, slugify } from "../../data";
import { aggregateOilFields } from "../../data/aggregateOilFields";
import { useNavigate } from "react-router-dom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { BASE_URL } from "../../../config";
import { GeoJSON } from "ol/format";
import { ApplicationContext } from "../../applicationContext";

const oilfieldSource = new VectorSource({
  url: `${BASE_URL}/geojson/oilfields.geojson`,
  format: new GeoJSON(),
});

function oilfieldName(f: FeatureLike) {
  return f.getProperties()["fldName"];
}

function simpleStripePattern(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d")!;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(8, 0);
  ctx.stroke();

  return ctx.createPattern(canvas, "repeat");
}

function showFieldNameStyle(f: FeatureLike) {
  return new Style({
    text: new Text({
      font: "9pt sans-serif",
      text: oilfieldName(f),
      overflow: true,
      placement: "point",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
    geometry: new Point(getCenter(f.getGeometry()!.getExtent())),
  });
}

function showFieldNameIfAvailableStyle(f: FeatureLike) {
  return new Style({
    text: new Text({
      font: "9pt sans-serif",
      text: oilfieldName(f),
      overflow: false,
      placement: "point",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });
}

export function useOilfieldLayer(map: Map, slug: string | undefined) {
  const [selectedFieldNames, setSelectedFieldNames] = useState<Set<string>>(
    new Set(),
  );
  const [hoverFeature, setHoverFeature] = useState<Feature | undefined>();
  const { phaseOut } = useContext(ApplicationContext);

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
      .filter((f) => selectedFields.has(oilfieldName(f)));

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
  function isSelected(f: FeatureLike) {
    return selectedFieldNames.has(oilfieldName(f));
  }

  useEffect(() => selectOilField(), [slug]);
  const selectedStyle = (f: FeatureLike) => {
    return phaseOut[aggregateOilFields[oilfieldName(f)]]
      ? new Style({ fill: new Fill({ color: simpleStripePattern("blue") }) })
      : new Style({ fill: new Fill({ color: "blue" }) });
  };
  const unselectedStyle = (f: FeatureLike) => {
    return phaseOut[aggregateOilFields[oilfieldName(f)]]
      ? new Style({ fill: new Fill({ color: "gray" }) })
      : new Style({ fill: new Fill({ color: "red" }) });
  };

  const oilfieldStyle = useMemo<(f: FeatureLike) => Style[]>(() => {
    return (f: FeatureLike): Style[] => {
      return isSelected(f)
        ? [selectedStyle(f), showFieldNameStyle(f)]
        : [unselectedStyle(f), showFieldNameIfAvailableStyle(f)];
    };
  }, [selectedFieldNames, selectedStyle, unselectedStyle]);

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
    hoverFeature?.setStyle((f) => [
      new Style({ stroke: new Stroke({ color: "black" }) }),
      showFieldNameStyle(f),
      isSelected(f) ? selectedStyle(f) : unselectedStyle(f),
    ]);
    return () => hoverFeature?.setStyle(undefined);
  }, [hoverFeature, unselectedStyle, selectedStyle]);

  const navigate = useNavigate();

  function handleClick(e: MapBrowserEvent) {
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (l) => l.getSource() === oilfieldSource,
    });
    if (features.length === 1) {
      setHoverFeature(undefined);
      navigate(
        `/map/${slugify(aggregateOilFields[oilfieldName(features[0])])}`,
      );
    }
  }

  const oilfieldLayer = useMemo(
    () => new VectorLayer({ source: oilfieldSource, style: oilfieldStyle }),
    [oilfieldStyle],
  );
  return { oilfieldLayer };
}
