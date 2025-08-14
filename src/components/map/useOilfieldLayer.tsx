import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { createEmpty, extend, getCenter } from "ol/extent";
import { Map, MapBrowserEvent } from "ol";
import { useContext, useEffect, useMemo, useState } from "react";
import { slugify } from "../../data/slugify";
import { aggregateOilFields } from "../../data/aggregateOilFields";
import { useNavigate } from "react-router-dom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { BASE_URL } from "../../../config";
import { GeoJSON } from "ol/format";
import { ApplicationContext } from "../../applicationContext";
import { gameData } from "../../data/gameData";

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

function showFieldNameStyle(f: FeatureLike, resolution: number) {
  const zoom = Math.round(Math.log2(15643.03392804097 / resolution));
  const fontSize = Math.max(12, Math.min(20, 8 + zoom));

  return new Style({
    text: new Text({
      font: `bold ${fontSize}px sans-serif`,
      text: oilfieldName(f),
      overflow: true,
      placement: "point",
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      offsetY: -5,
    }),
    geometry: new Point(getCenter(f.getGeometry()!.getExtent())),
  });
}

function showFieldNameIfAvailableStyle(f: FeatureLike, resolution: number) {
  const zoom = Math.round(Math.log2(15643.03392804097 / resolution));
  const fontSize = Math.max(10, Math.min(16, 6 + zoom));

  return new Style({
    text: new Text({
      font: `${fontSize}px sans-serif`,
      text: oilfieldName(f),
      overflow: false,
      placement: "point",
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black", width: 1.5 }),
      offsetY: -5,
    }),
  });
}

export function useOilfieldLayer(map: Map, slug: string | undefined) {
  const [selectedFieldNames, setSelectedFieldNames] = useState<Set<string>>(
    new Set(),
  );
  const { phaseOut } = useContext(ApplicationContext);
  const navigate = useNavigate();

  const handleClick = useMemo(
    () => (e: MapBrowserEvent) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l.getSource() === oilfieldSource,
      });
      if (features.length === 1) {
        navigate(
          `/map/${slugify(aggregateOilFields[oilfieldName(features[0])])}`,
        );
      }
    },
    [map, navigate],
  );

  const selectOilField = useMemo(
    () => () => {
      const view = map.getView()!;
      const field = gameData.allFields.find((s) => slugify(s) === slug);

      if (!field) {
        // If no field found, show all oilfields
        if (oilfieldSource.getFeatures().length > 0) {
          view.fit(oilfieldSource.getExtent(), {
            duration: 500,
            padding: [30, 30, 30, 30],
            maxZoom: 10,
          });
        }
        setSelectedFieldNames(new Set());
        return;
      }

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
        view.fit(extent, {
          maxZoom: 12,
          padding: [20, 20, 20, 20],
          duration: 500,
        });
      } else if (oilfieldSource.getFeatures().length > 0) {
        view.fit(oilfieldSource.getExtent(), {
          duration: 500,
          padding: [30, 30, 30, 30],
          maxZoom: 10,
        });
      }
      setSelectedFieldNames(selectedFields);
    },
    [map, slug],
  );

  useEffect(() => {
    // Define the handler with a stable reference for cleanup
    function handleFeaturesLoadEnd() {
      selectOilField();
    }

    oilfieldSource.once("featuresloadend", handleFeaturesLoadEnd);
    map.on("click", handleClick);

    return () => {
      map.un("click", handleClick);
      oilfieldSource.un("featuresloadend", handleFeaturesLoadEnd);
    };
  }, [map, oilfieldSource, handleClick, selectOilField]);

  function isSelected(f: FeatureLike) {
    return selectedFieldNames.has(oilfieldName(f));
  }

  useEffect(() => selectOilField(), [selectOilField]);
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

  const oilfieldStyle = useMemo<
    (f: FeatureLike, resolution: number) => Style[]
  >(() => {
    return (f: FeatureLike, resolution: number): Style[] => {
      return isSelected(f)
        ? [selectedStyle(f), showFieldNameStyle(f, resolution)]
        : [unselectedStyle(f), showFieldNameIfAvailableStyle(f, resolution)];
    };
  }, [selectedFieldNames, selectedStyle, unselectedStyle]);

  const oilfieldLayer = useMemo(
    () => new VectorLayer({ source: oilfieldSource, style: oilfieldStyle }),
    [oilfieldStyle],
  );
  return { oilfieldLayer };
}
