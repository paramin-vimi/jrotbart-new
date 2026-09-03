/**
 * Section screenshotter, for design-fidelity work.
 *
 *   node scripts/shoot.mjs [outDir] [url] [width]
 *
 * Captures the full page plus one PNG per top-level section, so each can be put
 * side by side with the matching Figma node render. The Figma frame is 1366 wide,
 * so that is the default width.
 *
 * Waits for fonts and for every lazy image to actually load — otherwise sections
 * below the fold screenshot with empty image boxes and read as false failures.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const outDir = process.argv[2] ?? "./shots";
const url = process.argv[3] ?? "http://localhost:4321/";
const width = Number(process.argv[4] ?? 1366);

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 1000 },
  deviceScaleFactor: 1,
});

// Third-party embeds render live data asynchronously, so a shot taken a second
// earlier or later captures a different page: the Elfsight LinkedIn feed grows
// "Latest Updates" by ~122px once it boots (which also moves every section
// below it by a fraction of a pixel), and the b2blead script restyles the
// contact form and floats a chat bubble over the bottom-right of every shot.
// Block both so every run captures the same authored state. SHOOT_THIRD_PARTY=1
// lets them load, for looking at the live embeds rather than the design.
if (!process.env.SHOOT_THIRD_PARTY) {
  await page.route(/elfsight|b2blead/i, (route) => route.abort());
}

await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

// Force every lazy image to load: walk the page, then wait for decode.
await page.evaluate(async () => {
  document.querySelectorAll("img[loading=lazy]").forEach((i) => i.removeAttribute("loading"));
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await Promise.all(
    [...document.images].map((i) =>
      i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; })
    )
  );
  // Loaded is not painted: an element shot taken right after scrolling can
  // still catch a poster mid-decode as a black box. Decode everything up front.
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
});
// Hide the sticky header, Astro's dev toolbar and the back-to-top button — all
// float over mid-page sections and would otherwise appear as overlays in every
// section shot (the button mid-fade, since each element shot scrolls).
await page.addStyleTag({
  content: `[data-site-header]{position:absolute!important}
            astro-dev-toolbar{display:none!important}
            [data-back-to-top]{display:none!important}`,
});

await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

const stats = await page.evaluate(() => ({
  height: document.documentElement.scrollHeight,
  loaded: [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length,
  total: document.images.length,
  broken: [...document.images]
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.src),
}));
console.log(`page height ${stats.height}px · images ${stats.loaded}/${stats.total} loaded`);
if (stats.broken.length) console.log("BROKEN IMAGES:", stats.broken);

await page.screenshot({ path: `${outDir}/00-full.png`, fullPage: true });

// One PNG per top-level block, in document order.
const targets = await page.$$("body > header, main > section, body > footer");
let n = 0;
for (const el of targets) {
  const box = await el.boundingBox();
  if (!box || box.height < 8) continue;
  n += 1;
  const label = await el.evaluate((e) => {
    const h = e.querySelector("h1,h2,h3");
    const id = e.id || "";
    const text = (h?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34);
    return (id || text || e.tagName.toLowerCase())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  });
  const file = `${outDir}/${String(n).padStart(2, "0")}-${label || "section"}.png`;
  await el.screenshot({ path: file });
  console.log(`  ${String(Math.round(box.height)).padStart(5)}px  ${file.split("/").pop()}`);
}

await browser.close();
console.log(`\n${n} sections captured to ${outDir}`);
