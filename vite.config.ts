import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

const base = process.env.REPO_BASE || "/";

export default defineConfig({
  base,
  plugins: [
    legacy({
      targets: ["defaults", "ios >= 12"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
});
