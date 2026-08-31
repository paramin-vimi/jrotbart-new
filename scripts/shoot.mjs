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
});
// Hide the sticky header and Astro's dev toolbar — both float over mid-page
// sections and would otherwise appear as overlays in every section shot.
await page.addStyleTag({
  content: `[data-site-header]{position:absolute!important}
            astro-dev-toolbar{display:none!important}`,
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
