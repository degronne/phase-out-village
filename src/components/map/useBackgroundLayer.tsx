import { OSM, StadiaMaps } from "ol/source";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { useMemo } from "react";
import TileLayer from "ol/layer/Tile";

/** OpenStreetMap (light) tile source. */
const lightTileSource = new OSM();
/** Dark mode tile source using StadiaMaps. */
const darkTileSource = new StadiaMaps({
  layer: "alidade_smooth_dark",
  apiKey: "5a2e5035-ad83-4002-a6e6-5f679b73240f",
});

/**
 * Hook that returns the background tile layer for the map.
 * Chooses between light and dark sources based on user preference.
 */
export function useBackgroundLayer() {
  const isDarkMode = usePrefersDarkMode();
  // Memoize the background layer so it is only recreated when `isDarkMode` changes.
  // This ensures the map layer updates when the theme switches, but avoids
  // unnecessary recreation on every render.
  const backgroundLayer = useMemo(
    () =>
      new TileLayer({ source: isDarkMode ? darkTileSource : lightTileSource }),
    [isDarkMode],
  );
  return { backgroundLayer };
}
