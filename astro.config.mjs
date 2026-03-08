import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://fpastor.github.io",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
