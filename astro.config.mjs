// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// ---------------------------------------------------------------------------
// Preview builds (GitHub Pages) — see .github/PREVIEW.md.
//
// PRODUCTION IS CLOUDFLARE, at the ROOT of jrotbart.com (see wrangler.toml).
// Everything below is inert unless PREVIEW_ORIGIN is set, which happens in
// exactly one place: .github/workflows/preview.yml. `npm run build` with no env
// vars set produces byte-for-byte the same dist/ it always has — there is a
// merge gate in .github/PREVIEW.md that proves it.
//
// Astro does NOT load .env files inside config files, so these must be real
// process environment variables. The workflow sets them from the outputs of
// actions/configure-pages, which asks GitHub at run time where the site will
// actually be served. That is what makes one implementation correct both at a
// root URL (a USER.github.io repo, or any repo with a custom domain) and at a
// /REPO/ subpath (a project site) without hardcoding the repository name.
// ---------------------------------------------------------------------------
const PREVIEW_ORIGIN = (process.env.PREVIEW_ORIGIN ?? "").trim().replace(/\/+$/, "");
const PREVIEW_BASE = (process.env.PREVIEW_BASE ?? "").trim().replace(/\/+$/, "");
const isPreview = PREVIEW_ORIGIN !== "";

// https://astro.build/config
export default defineConfig({
  site: isPreview ? PREVIEW_ORIGIN : "https://jrotbart.com",

  // Spread, never `base: undefined` — in a production build the key must be
  // ABSENT from the config object so Astro takes its default code path.
  ...(isPreview && PREVIEW_BASE ? { base: PREVIEW_BASE } : {}),

  // Fully static output. Every content URL becomes a real HTML file at the edge:
  // simplest failure mode, fastest TTFB, nothing to patch at runtime.
  // The only live data on the page (metal spot prices) is fetched client-side
  // from a Cloudflare Worker — see workers/spot-price.ts.
  output: "static",

  // A preview must never publish a sitemap. A sitemap is an explicit invitation
  // to index exactly the URLs the noindex tag is suppressing, and
  // @astrojs/sitemap has no noindex awareness whatsoever — it builds from the
  // route table, never from the emitted HTML, so it would list every page
  // regardless. scripts/rebase-preview.mjs fails the build if one appears.
  integrations: isPreview ? [] : [sitemap()],

  vite: {
    plugins: [tailwindcss()],

    // Forwarded explicitly rather than relying on Vite's env-prefix loading, so
    // the flag cannot arrive by accident from a .env file. In a production
    // build this substitutes the literal `false`, so the expression reading it
    // in BaseLayout.astro is constant-folded away and the output is unchanged.
    define: {
      "import.meta.env.PREVIEW_BUILD": JSON.stringify(isPreview),
    },
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
