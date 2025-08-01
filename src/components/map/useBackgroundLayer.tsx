import { OSM, StadiaMaps } from "ol/source";
import { usePrefersDarkMode } from "../../hooks/usePrefersDarkMode";
import { useMemo } from "react";
import TileLayer from "ol/layer/Tile";

const lightTileSource = new OSM();
const darkTileSource = new StadiaMaps({
  layer: "alidade_smooth_dark",
  apiKey: "5a2e5035-ad83-4002-a6e6-5f679b73240f",
});

export function useBackgroundLayer() {
  const isDarkMode = usePrefersDarkMode();
  const backgroundLayer = useMemo(
    () =>
      new TileLayer({ source: isDarkMode ? darkTileSource : lightTileSource }),
    [isDarkMode],
  );
  return { backgroundLayer };
}
