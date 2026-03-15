import { defineConfig } from "astro/config";
import path from "path";

export default defineConfig({
  site: "https://fpastor.github.io",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
