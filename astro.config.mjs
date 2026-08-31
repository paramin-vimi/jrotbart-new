// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://jrotbart.com",

  // Fully static output. Every content URL becomes a real HTML file at the edge:
  // simplest failure mode, fastest TTFB, nothing to patch at runtime.
  // The only live data on the page (metal spot prices) is fetched client-side
  // from a Cloudflare Worker — see workers/spot-price.ts.
  output: "static",

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // Modern formats only; the source PNGs from the current site are the single
    // biggest performance liability we are replacing.
    responsiveStyles: true,
    layout: "constrained",
  },

  build: {
    // Inline small stylesheets rather than paying a round trip for them.
    inlineStylesheets: "auto",
  },

  // The floating dev toolbar overlaps the bottom-left of the page, which is
  // where the back-to-top control now sits, and it shows up in screenshots.
  devToolbar: { enabled: false },

  compressHTML: true,
});
