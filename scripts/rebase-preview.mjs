#!/usr/bin/env node
/**
 * Preview adapter for GitHub Pages. Runs AFTER `astro build`, over `dist/` only.
 * It never touches source. `npm run build` does not invoke it, and if it ever
 * did, the first guard below exits immediately.
 *
 * WHY THIS EXISTS
 * ~128 root-relative paths are hand-written in src/content/*.ts and a few
 * components. This codebase uses no `astro:assets` — every image is a raw
 * <img src={string}> — so Astro's `base` option rewrites only its own pipeline
 * output (_astro/*, pagination hrefs, canonical, font url()s). Every
 * hand-written literal would 404 under a project-site subpath. Rebasing them
 * here keeps all 128 source references production-correct and confines the
 * entire preview to one deletable file.
 *
 * ENVIRONMENT
 *   PREVIEW_ORIGIN  required; without it this script is a no-op.
 *                   e.g. "https://octocat.github.io"
 *   PREVIEW_BASE    "/my-repo" for a project site;
 *                   ""         for a user/org site or a custom domain.
 *                   Both come from actions/configure-pages. At "" the rebase
 *                   pass is skipped entirely and only robots.txt is replaced —
 *                   which is why BOTH repository shapes work unchanged, and why
 *                   the user is not forced into a particular repo name.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");
const ORIGIN = (process.env.PREVIEW_ORIGIN ?? "").trim().replace(/\/+$/, "");
const BASE = (process.env.PREVIEW_BASE ?? "").trim().replace(/\/+$/, "");

/*
  FAIL, do not no-op.

  This arm used to exit 0 "because a production build has nothing to do". That
  reasoning is backwards, and it opened the exact hole this whole file exists to
  close. This script is wired into `build:preview` ONLY — `npm run build` never
  calls it — so there is no benign path that reaches here. What DOES reach here
  is the dangerous one: `build:preview` runs `astro build` FIRST, so by the time
  we arrive dist/ already holds a complete, canonical-to-jrotbart.com, INDEXABLE
  production artifact. Exiting 0 hands that to the deploy step, which uploads it
  unconditionally to a public URL — an indexable copy of the client's unlaunched
  site, with none of the three guards below ever running, because they all sit
  after this line.

  One unset environment variable was the whole distance between "team preview"
  and "second indexable copy of the client's site". So: exit non-zero, fail the
  workflow, publish nothing.
*/
if (!ORIGIN) {
  console.error(
    "[rebase-preview] FATAL: PREVIEW_ORIGIN is unset or empty.\n" +
      "  dist/ currently holds a PRODUCTION, INDEXABLE build — `astro build` has\n" +
      "  already run. Publishing it would put an indexable copy of the site on a\n" +
      "  public URL, with no noindex and a live sitemap.\n" +
      "  Refusing to continue. In CI this comes from actions/configure-pages;\n" +
      "  locally, set it explicitly, e.g.\n" +
      "    PREVIEW_ORIGIN=https://you.github.io PREVIEW_BASE=/repo npm run build:preview",
  );
  process.exit(1);
}

/*
  The "already based" test in shouldRebase is a prefix match, so it cannot tell
  a path Astro already prefixed (/repo/_astro/x.css) from a source path that
  merely starts with the same word. If the repo were named "logos", every real
  /logos/*.png would look already-based, be skipped, and 404 — silently, on the
  one band of the page that is pure brand trust. Catch it here, loudly, where
  the remedy is one sentence, rather than letting someone hunt broken images.
*/
if (BASE) {
  const name = BASE.replace(/^\//, "");
  const collides = (await readdir(DIST, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  if (collides.includes(name)) {
    console.error(
      `[rebase-preview] FATAL: the repository name "${name}" collides with a\n` +
        `  top-level path in dist/ (/${name}/…). Paths under it cannot be told\n` +
        `  apart from paths this script has already rebased, so they would be\n` +
        `  skipped and 404 on the preview.\n` +
        `  Fix: rename the repository to anything not in this list —\n` +
        `  ${collides.join(", ")}`,
    );
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ rules */

/**
 * The single predicate every rewrite goes through.
 *
 *   "https://…", "mailto:", "tel:", "data:", "#x", "?x", "a/b" → no leading "/" → skip
 *   "//cdn.example.com/x.js"                                   → protocol-relative → skip
 *   "/my-repo/_astro/x.css"   (Astro's `base` already did it)  → already based → skip
 *   "/logos/wsj.png", "/faq/", "/#contact"                     → REBASE
 *
 * The "already based" arm is a correctness requirement, not padding: we set
 * Astro's `base` as well, so Vite has already prefixed the stylesheet link and
 * the font url()s before this script runs. Without that arm those become
 * /my-repo/my-repo/_astro/… and the site renders unstyled. It also makes the
 * script idempotent — running it twice is a no-op.
 */
const shouldRebase = (u) =>
  typeof u === "string" &&
  u.length > 0 &&
  u[0] === "/" &&
  u[1] !== "/" &&
  !(BASE && (u === BASE || u.startsWith(BASE + "/")));

const rebase = (u) => (shouldRebase(u) ? BASE + u : u);

/** CSS: url(/x), url('/x'), url("/x"), and bare @import "/x". */
const rewriteCss = (css) =>
  css
    .replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (m, q, u) =>
      shouldRebase(u) ? `url(${q}${BASE + u}${q})` : m
    )
    .replace(/@import\s+(["'])(\/[^"']*)\1/g, (m, q, u) =>
      shouldRebase(u) ? `@import ${q}${BASE + u}${q}` : m
    );

/**
 * JSON-LD: only string values under an allowlist of URL-bearing keys, and only
 * when they already start with "/". Every other URL in the graph is absolute
 * (built from `site`), so in practice this matches exactly the four
 * `thumbnailUrl` values that schema.ts emits root-relative — a real pre-existing
 * schema.org bug (it requires an absolute URL there) that this happens to keep
 * correct under a base path rather than fix.
 *
 * Deliberately a targeted regex rather than JSON.parse + re-stringify: the block
 * was injected by BaseLayout with set:html, and re-serialising it could change
 * escaping or key order for no benefit.
 */
const LD_KEYS = "url|@id|image|logo|thumbnailUrl|contentUrl|embedUrl|item|sameAs|mainEntityOfPage";
const LD_RE = new RegExp(`"(${LD_KEYS})"\\s*:\\s*"(\\/[^"]*)"`, "g");
const rewriteLdJson = (json) =>
  json.replace(LD_RE, (m, k, u) => (shouldRebase(u) ? `"${k}":"${BASE + u}"` : m));

/** srcset / imagesrcset: comma-separated "url [descriptor]" candidates. */
const rewriteSrcset = (v) =>
  v
    .split(",")
    .map((c) => {
      const t = c.trim();
      if (!t) return c;
      const [u, ...rest] = t.split(/\s+/);
      return [rebase(u), ...rest].join(" ");
    })
    .join(", ");

/**
 * Markup outside <script>, <style> and comments.
 *
 * href and src are the only attributes that carry a root-relative value in this
 * project's built output (verified against dist/: zero srcset, zero
 * style="…url(…)", zero poster/action). srcset is handled anyway so the rule
 * survives someone adding <Image> later.
 *
 * `content=` is deliberately NOT rewritten: it is the attribute on every
 * <meta>, including free-text descriptions, and BaseLayout already builds
 * og:image / og:url absolutely from Astro.site. The leak check below asserts a
 * root-relative content= never appears, so a future regression fails the build
 * loudly instead of this script guessing at prose.
 */
const rewriteMarkup = (html) =>
  html
    .replace(/(\s(?:href|src)\s*=\s*)(["'])([^"']*)\2/gi, (m, lead, q, u) =>
      shouldRebase(u) ? `${lead}${q}${BASE + u}${q}` : m
    )
    .replace(/(\s(?:srcset|imagesrcset)\s*=\s*)(["'])([^"']*)\2/gi, (m, lead, q, v) =>
      `${lead}${q}${rewriteSrcset(v)}${q}`
    );

/**
 * Segment the document so no rule can run where it does not belong.
 *
 * A <script> that is not ld+json is left byte-for-byte alone. That is what
 * preserves PriceTicker's fetch of the spot-price endpoint — rebasing it would
 * only move the 404, and the component already degrades to "Spot prices
 * unavailable" on any non-ok response — and what stops a slash-bearing Tailwind
 * opacity utility, built inside an inline template literal, from being mistaken
 * for a URL.
 *
 * NOTE FOR EDITORS: do not write a literal Tailwind utility token anywhere in
 * this file. Tailwind 4 auto-detects source files across the project, and a
 * class-shaped token in a comment here would add a rule to the PRODUCTION
 * stylesheet and change its content hash. (src/styles/global.css excludes this
 * directory for that reason; this note is the belt to that braces.)
 */
const SEGMENT =
  /(<script\b[^>]*>[\s\S]*?<\/script\s*>)|(<style\b[^>]*>[\s\S]*?<\/style\s*>)|(<!--[\s\S]*?-->)/gi;
const IS_LD = /type\s*=\s*["']application\/ld\+json["']/i;

function rewriteHtml(html) {
  let out = "";
  let last = 0;
  for (const m of html.matchAll(SEGMENT)) {
    out += rewriteMarkup(html.slice(last, m.index));
    const [seg, script, style, comment] = m;
    if (script) out += IS_LD.test(script) ? rewriteLdJson(seg) : seg;
    else if (style) out += rewriteCss(seg);
    else out += comment;
    last = m.index + seg.length;
  }
  return out + rewriteMarkup(html.slice(last));
}

/** Web app manifest: parsed as JSON, not pattern-matched. */
function rewriteManifest(src) {
  const m = JSON.parse(src);
  for (const k of ["start_url", "scope", "id"]) if (k in m) m[k] = rebase(m[k]);
  for (const list of ["icons", "screenshots"])
    for (const e of m[list] ?? []) if (e?.src) e.src = rebase(e.src);
  for (const s of m.shortcuts ?? []) if (s?.url) s.url = rebase(s.url);
  return JSON.stringify(m, null, 2) + "\n";
}

/* ------------------------------------------------------------- robots.txt */

const PREVIEW_ROBOTS = `# PREVIEW BUILD — this is NOT the production site (jrotbart.com).
#
# Crawling is deliberately ALLOWED. That is not an oversight, and please do not
# "fix" it by adding Disallow: / — doing so would make indexing MORE likely,
# not less. Here is why.
#
# robots.txt has no "noindex" directive. Google removed support on 1 September
# 2019; only user-agent, allow and disallow are parsed at all. The instruction
# that actually keeps a page out of an index lives inside the page:
#
#     <meta name="robots" content="noindex, follow">
#
# Every page in this build carries it, and the build refuses to publish if any
# page is missing it. But a crawler has to FETCH a page to read that tag.
# "Disallow: /" blocks the fetch, so the tag is never seen — and a URL that was
# never fetched can still be listed, bare and snippet-less, from any inbound
# link. That state is close to unrecoverable, because the correction lives on a
# page the crawler is still forbidden to fetch.
#
# So: let crawlers in, let them read the noindex, let them drop the page.
#
# Note also: if this preview is a GitHub *project* site
# (https://user.github.io/repo/), this file is served from a subdirectory and no
# crawler reads it at all — robots.txt is only valid at a host root. It ships to
# document intent and becomes live if the preview ever moves to a user site or a
# custom domain. The meta tag carries the entire load either way.
#
# This keeps the preview out of SEARCH RESULTS. It does not make it private:
# a GitHub Pages site is readable by anyone who has the URL.
#
# No Sitemap: line. This build deliberately publishes none.
User-agent: *
Allow: /
`;

/* -------------------------------------------------------------------- walk */

async function* files(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else yield p;
  }
}

/**
 * Positions that must not hold an UNREBASED root-relative URL after the pass.
 * Wider than the set we rewrite, on purpose: if content ever starts emitting a
 * poster="/…" or a style="…url(/…)", this fails the build instead of shipping a
 * silent 404. `shouldRebase` is reused as the predicate, so a value already
 * under BASE is not a leak — it is the correct result.
 */
const LEAK_ATTR =
  /\s(?:href|src|srcset|imagesrcset|content|poster|action|formaction|data-src|data-poster)\s*=\s*["']([^"']*)["']/gi;
const LEAK_CSS = /url\(\s*["']?([^"')]+)/g;
const findLeaks = (text, re) => {
  const out = [];
  for (const m of text.matchAll(re))
    for (const cand of m[1].split(","))
      if (shouldRebase(cand.trim().split(/\s+/)[0])) out.push(m[0].trim());
  return out;
};

await stat(DIST).catch(() => {
  console.error("[rebase-preview] dist/ not found — run `astro build` first.");
  process.exit(1);
});

let rewritten = 0;
const leaks = [];
const htmlPages = [];
const sitemaps = [];

for await (const file of files(DIST)) {
  const ext = path.extname(file).toLowerCase();
  const rel = path.relative(DIST, file);

  if (rel === "robots.txt") {
    // Replaced wholesale, not rewritten. The production file advertises
    // production's sitemap and Disallows the auth routes; neither belongs here,
    // and leaving public/robots.txt alone is what preserves byte-identity of
    // the default build.
    await writeFile(file, PREVIEW_ROBOTS);
    rewritten++;
    continue;
  }
  if (/^sitemap.*\.xml$/.test(rel)) sitemaps.push(rel);
  if (ext === ".html") htmlPages.push(file);

  if (!BASE) continue; // root deploy: every path is already correct
  if (![".html", ".css", ".webmanifest"].includes(ext)) continue;

  const src = await readFile(file, "utf8");
  const out =
    ext === ".html" ? rewriteHtml(src) : ext === ".css" ? rewriteCss(src) : rewriteManifest(src);
  if (out !== src) {
    await writeFile(file, out);
    rewritten++;
  }

  if (ext === ".html" || ext === ".css") {
    // Scripts were skipped by design, so strip them before leak-checking or
    // they would report false positives (the spot-price endpoint, Tailwind
    // opacity tokens inside inline template literals).
    const scanned =
      ext === ".html" ? out.replace(SEGMENT, (m) => (/^<script/i.test(m) ? "" : m)) : out;
    for (const hit of findLeaks(scanned, LEAK_ATTR)) leaks.push(`${rel}: ${hit}`);
    for (const hit of findLeaks(scanned, LEAK_CSS)) leaks.push(`${rel}: ${hit}`);
  }
}

console.log(
  `[rebase-preview] origin=${ORIGIN} base=${BASE || "(root)"} — rewrote ${rewritten} file(s), ` +
    `checked ${htmlPages.length} page(s).`
);

/* ------------------------------------------------------------------ guards */

const fail = [];

if (leaks.length) {
  fail.push("Root-relative URLs survived rebasing:");
  for (const l of [...new Set(leaks)].slice(0, 40)) fail.push("    " + l);
}

if (sitemaps.length) {
  fail.push(`A sitemap was emitted into a preview build: ${sitemaps.join(", ")}`);
}

const indexable = [];
for (const f of htmlPages) {
  const h = await readFile(f, "utf8");
  if (!/<meta name="robots" content="noindex/.test(h)) indexable.push(path.relative(DIST, f));
}
if (indexable.length) {
  fail.push('Pages missing <meta name="robots" content="noindex">:');
  for (const p of indexable.slice(0, 40)) fail.push("    " + p);
}

if (fail.length) {
  console.error("[rebase-preview] FAILED — refusing to publish this preview:");
  for (const l of fail) console.error("  " + l);
  process.exit(1);
}

console.log(
  `[rebase-preview] OK — ${htmlPages.length} page(s) noindex, no sitemap, no unrebased paths.`
);
