import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { Point } from "ol/geom";
import { createEmpty, extend, getCenter } from "ol/extent";
import { Map, MapBrowserEvent } from "ol";
import { useContext, useEffect, useMemo, useState } from "react";
import { slugify } from "../../data/slugify";
import { aggregateOilFields } from "../../generated/aggregateOilFields";
import { useNavigate } from "react-router-dom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { ApplicationContext } from "../../applicationContext";
import { gameData } from "../../data/gameData";

/** Vector source containing all oilfield features loaded from GeoJSON. */
const oilfieldSource = new VectorSource({
  url: `${import.meta.env.BASE_URL}geojson/oilfields.geojson`,
  format: new GeoJSON(),
});

/** Vector source containing all oilfield features loaded from GeoJSON. */
function oilfieldName(f: FeatureLike) {
  return f.getProperties()["fldName"];
}

/**
 * Creates a simple diagonal stripe pattern for filling polygons.
 * Used for indicating phased-out oilfields.
 * @param color Color of the stripe
 * @returns CanvasPattern
 */
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

/**
 * Returns a style with prominent field name text displayed on the map.
 * Font size adjusts dynamically based on resolution.
 * @param f FeatureLike
 * @param resolution Map resolution
 */
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

/**
 * Returns a style with smaller, optional text for the field name.
 * Used for unselected or background oilfields.
 * @param f FeatureLike
 * @param resolution Map resolution
 */
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

/**
 * Custom React hook for managing an OpenLayers vector layer of oilfields.
 *
 * Handles:
 * - Highlighting selected oilfields.
 * - Zooming to a selected oilfield based on URL slug.
 * - Applying different styles for phased-out vs active fields.
 * - Displaying feature labels.
 *
 * @param {Map} map The OpenLayers Map instance.
 * @param {string | undefined} slug Optional slug representing the selected oilfield.
 * @returns VectorLayer OpenLayers object for oilfields.
 *
 * @example
 * const { oilfieldLayer } = useOilfieldLayer(map, slug);
 * // Add layer to map or use as part of a map component
 */
export function useOilfieldLayer(map: Map, slug: string | undefined) {
  const [selectedFieldNames, setSelectedFieldNames] = useState<Set<string>>(
    new Set(),
  );
  const { phaseOut } = useContext(ApplicationContext);
  const navigate = useNavigate();

  /**
   * Handles map clicks on oilfield features.
   * Navigates to the slugified URL of the clicked oilfield.
   */
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

  /**
   * Selects and zooms to oilfields based on the provided slug.
   * If no slug is provided, shows all oilfields.
   */
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

      // Determine all features corresponding to the selected aggregate field
      const selectedFields = new Set(
        Object.entries(aggregateOilFields)
          .filter(([_, v]) => v === field)
          .map(([k, _]) => k),
      );
      const selectedFeatures = oilfieldSource
        .getFeatures()
        .filter((f) => selectedFields.has(oilfieldName(f)));

      if (selectedFeatures.length) {
        // Compute combined extent of selected features and zoom to fit
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

  // Register click handler and fit map when features are loaded
  useEffect(() => {
    // Define the handler with a stable reference for cleanup
    function handleFeaturesLoadEnd() {
      selectOilField();
    }

    oilfieldSource.once("featuresloadend", handleFeaturesLoadEnd);
    map.on("click", handleClick);

    // Cleanup event listeners on unmount
    return () => {
      map.un("click", handleClick);
      oilfieldSource.un("featuresloadend", handleFeaturesLoadEnd);
    };
  }, [map, oilfieldSource, handleClick, selectOilField]);

  /**
   * Determines if a feature is currently selected.
   * @param f FeatureLike
   */
  function isSelected(f: FeatureLike) {
    return selectedFieldNames.has(oilfieldName(f));
  }

  // Re-select oilfield whenever slug changes
  useEffect(() => selectOilField(), [selectOilField]);

  /**
   * Styles for selected features.
   * Blue or striped blue if phased out.
   */
  const selectedStyle = (f: FeatureLike) => {
    return phaseOut[aggregateOilFields[oilfieldName(f)]]
      ? new Style({ fill: new Fill({ color: simpleStripePattern("blue") }) })
      : new Style({ fill: new Fill({ color: "blue" }) });
  };

  /**
   * Styles for unselected features.
   * Red or gray if phased out.
   */
  const unselectedStyle = (f: FeatureLike) => {
    return phaseOut[aggregateOilFields[oilfieldName(f)]]
      ? new Style({ fill: new Fill({ color: "gray" }) })
      : new Style({ fill: new Fill({ color: "red" }) });
  };

  /**
   * Combined style function for all oilfields.
   * Returns array of styles: fill + optional text.
   */
  const oilfieldStyle = useMemo<
    (f: FeatureLike, resolution: number) => Style[]
  >(() => {
    return (f: FeatureLike, resolution: number): Style[] => {
      return isSelected(f)
        ? [selectedStyle(f), showFieldNameStyle(f, resolution)]
        : [unselectedStyle(f), showFieldNameIfAvailableStyle(f, resolution)];
    };
  }, [selectedFieldNames, selectedStyle, unselectedStyle]);

  // Create the vector layer with source and styling
  const oilfieldLayer = useMemo(
    () => new VectorLayer({ source: oilfieldSource, style: oilfieldStyle }),
    [oilfieldStyle],
  );
  return { oilfieldLayer };
}
