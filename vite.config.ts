import { defineConfig } from "vite";
import { BASE_URL } from "./config";

// @ts-ignore
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  base: BASE_URL,
  plugins: [
    legacy({
      targets: ["defaults", "ios >= 12"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
});
