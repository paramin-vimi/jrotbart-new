# GitHub Pages preview — how it works

A team-review copy of the site, published to GitHub Pages and kept out of search
results. **This is not the production deploy.** Production is Cloudflare Workers
Static Assets at the root of jrotbart.com (see `wrangler.toml`), and nothing here
changes that.

This file lives in `.github/` rather than the repo root because Tailwind 4
auto-detects source files across the whole project — see
[The Tailwind trap](#the-tailwind-trap-read-before-adding-any-file).

---

## The design constraint

Everything is **additive and off by default**. A bare `npm run build` with no
environment variables set must keep producing exactly the production-correct
output: root-relative paths, indexable, canonical `https://jrotbart.com`, sitemap
published. Verified byte-for-byte, 125/125 files.

Two environment variables drive the whole preview. Unset means production.

| Variable | Default | Set by | Meaning |
| --- | --- | --- | --- |
| `PREVIEW_ORIGIN` | *(unset)* | workflow, from `configure-pages` `origin` | `https://user.github.io` or `https://preview.example.com`. **Unset = production.** |
| `PREVIEW_BASE` | `""` | workflow, from `configure-pages` `base_path` | `/my-repo` for a project site; `""` for a `USER.github.io` site or a custom domain |

Both come from `actions/configure-pages`, which asks GitHub **at run time** where
the site will actually be served. That is what makes one implementation correct
at a root URL *and* at a `/REPO/` subpath without hardcoding the repository name.
Rename the repo, or attach a custom domain later, and the next build
self-corrects.

---

## Why there is a post-build rewrite step

The obvious answer — "set Astro's `base` option" — does not work here, and it is
worth writing down why so nobody tries it again.

This codebase uses **no `astro:assets`**. There is no `<Image>` or `<Picture>`
anywhere; every image is a raw `<img src={string}>` whose src is a plain string
literal in `src/content/*.ts`. Astro's `base` only rewrites its own pipeline
output. An empirical build with `base: "/my-repo"` prefixed **1 of 153**
root-relative URLs on the homepage — its own `_astro/` stylesheet. The other 152
came out unprefixed and would 404 under a subpath.

So `scripts/rebase-preview.mjs` runs after `astro build` and rewrites `dist/`.
`base` is *also* set, because it correctly fixes canonical, `og:url` and Astro's
own pagination links; the script's "already based" check is what stops those from
being prefixed twice.

The whole preview is therefore one deletable file plus a handful of small,
commented hunks. No path literal in `src/` was touched — all 128 of them stay
production-correct.

### What the script deliberately does *not* touch

- **`<script>` bodies.** Segmented out structurally. This is what protects
  `PriceTicker`'s fetch of the spot-price endpoint (rebasing it would only move
  the 404 — see below) and stops a slash-bearing Tailwind opacity utility inside
  an inline template literal from being mistaken for a URL.
- **`content=` attributes.** That is the attribute on every `<meta>`, including
  free-text descriptions. `og:image` / `og:url` are already built absolutely from
  `Astro.site`. The script's leak check *asserts* a root-relative `content=`
  never appears, so a future regression fails the build rather than being guessed
  at.
- **`public/robots.txt`.** Left alone so the default build stays byte-identical.
  The preview version is written over `dist/robots.txt` instead.

### The guards

The script **fails the build** — before the deploy job ever runs — if:

1. any page is missing `<meta name="robots" content="noindex">`,
2. a sitemap was emitted,
3. any root-relative path survived rebasing.

A broken or indexable preview cannot reach GitHub Pages.

---

## robots.txt: why crawling is ALLOWED

This looks wrong to anyone who has not thought it through, so: **do not "fix" the
preview robots.txt by adding `Disallow: /`. It would make indexing more likely,
not less.**

The original ask was "set it to noindex in the robots.txt". That is not
implementable, for two independent reasons:

1. **robots.txt has no `noindex` directive.** Google removed support on
   1 September 2019. Only `user-agent`, `allow` and `disallow` are parsed at all.
2. **On a project site, the file is not even read.** robots.txt is only valid at
   a host *root*. On `https://user.github.io/repo/` it is served from a
   subdirectory, which no crawler honours. The authoritative file would be
   `https://user.github.io/robots.txt`, which lives in a different repo.

And `Disallow` actively defeats the mechanism that *does* work. Google, verbatim:

> For the `noindex` rule to be effective, the page or resource must not be
> blocked by a robots.txt file, and it has to be otherwise accessible to the
> crawler.

A crawler has to **fetch** a page to read the `noindex` inside it. Block the
fetch and it never sees the instruction — but if it finds a link to the URL
anywhere, it can still list the bare address with no snippet. That state is close
to unrecoverable, because the correction lives on a page the crawler is still
forbidden to fetch.

**It reads backwards, but the way to keep this out of Google is to let Google
in.** Allow the crawl, let it read the noindex, let it drop the page.

`X-Robots-Tag` — the HTTP-header equivalent — is not available either: GitHub
Pages on github.com supports no custom response headers.

The preview robots.txt ships anyway. It costs nothing, documents the intent at
the place someone will look, and becomes live if the preview ever moves to a user
site or a custom domain. But the meta tag carries the entire load.

### Why `noindex, follow` and not `nofollow`

Two reasons:

1. That line in `BaseLayout.astro` is **shared with the production per-post
   Sanity noindex flag**. Changing the string would change production output.
2. `follow` is better on the merits. It lets a crawler walk from whatever entry
   URL it found to every other preview page, so each one is fetched and each one
   gets its own explicit noindex. `nofollow` leaves the rest un-crawled, and
   un-crawled URLs are exactly the ones that later get URL-only-indexed from a
   stray link. Link equity is moot on a page that is not in the index.

---

## Why there is no `.nojekyll`

Common advice says Astro needs one so Jekyll does not strip the `_astro/`
directory (Jekyll ignores paths beginning with an underscore). That advice is for
the *"deploy from a branch"* publishing source. This workflow uses
`actions/deploy-pages`, where Jekyll never runs — GitHub's own static-Pages
starter workflow contains no `.nojekyll` either.

Adding one would also be useless: `actions/upload-pages-artifact` has
`include-hidden-files: false` by default, so a dotfile is silently dropped from
the artifact. And putting it in `public/` would ship it into the production
Cloudflare build too.

If `_astro/` ever 404s, the cause is something else — do not let this send you
down the wrong path.

## Why there is no `public/CNAME`

Astro's GitHub Pages guide is stale here. GitHub, verbatim: under a custom
Actions workflow "no `CNAME` file is created, and any existing `CNAME` file is
ignored and is not required." A custom domain is set in **Settings → Pages**
only.

---

## The Tailwind trap (read before adding any file)

Tailwind 4 auto-detects source files across the whole project, so **any file
added to the repo can inject a rule into the production stylesheet** just by
containing a word that looks like a class name.

This is measured, not theoretical. Adding `.github/workflows/preview.yml`, whose
`permissions:` block contains `contents: read`, emitted
`.contents{display:contents}` into `dist/_astro/schema.*.css`. That changed the
stylesheet's content hash, and therefore the filename referenced by every page —
all 125 output files differed.

The fix is two lines in `src/styles/global.css`:

```css
@source not "../../.github";
@source not "../../scripts";
@source not "../../README.md";
```

`README.md` is in that list because it is scanned too — a probe build confirmed a
bare `isolate` in the README emits `.isolate{isolation:isolate}`. The README's
current prose happens not to collide, but that is luck rather than a rule, so the
exclusion makes the guarantee hold for whoever edits it next. Longer-form preview
documentation lives here in `.github/PREVIEW.md` for the same reason.

All three are no-ops for the current tree. Run the merge gate below before
merging anything.

---

## Merge gate

Proves the default build is still untouched:

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
git stash && npm run build && mv dist /tmp/dist-before
git stash pop && npm run build && diff -r /tmp/dist-before dist && echo BYTE-IDENTICAL
```

## Testing a preview locally

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
PREVIEW_ORIGIN=https://octocat.github.io PREVIEW_BASE=/my-repo npm run build:preview
mkdir -p /tmp/srv && cp -R dist /tmp/srv/my-repo
cd /tmp/srv && python3 -m http.server 8899   # http://localhost:8899/my-repo/
```

Serve it from a **real subdirectory** as above — serving `dist/` at a root would
not exercise the rebasing at all.

Do **not** export `PREVIEW_ORIGIN` in your shell profile: with it set, `astro dev`
also serves at `http://localhost:4321/my-repo/`, which looks like the dev server
broke.

---

## Known behaviour on the preview

- **The spot-price ticker always reads "Spot prices unavailable."** It fetches
  `/api/spot`, a Cloudflare Worker that does not exist on Pages. `PriceTicker`
  catches both a network failure and a non-2xx and shows the error line — the
  comment in that component reads "Deliberately quiet: a missing ticker must
  never break the page." This is correct degradation, not a bug to fix.
- **Roughly 27 links 404** (`/services/`, `/faq/`, `/open-account/`, …). Those are
  Phase 2 and 404 on a production build too. Note the rebasing *improves* this
  case: unrebased, `/faq/` would resolve to `https://USER.github.io/faq/`,
  possibly a different repo's Pages site, with no signal the reader had left the
  preview.
- **News sections show the 6 seed posts**, not live CMS content, unless
  `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` are added to the
  workflow's build `env` from repository secrets.
- **Third-party scripts are live and wired to production accounts.** The b2blead
  contact form, newsletter and AI chat agent, plus the Elfsight LinkedIn embed,
  all load and function. A colleague can submit a real lead from the preview. To
  suppress them, gate on the same flag (`{!previewBuild && ...}`) — at the cost
  of the team not being able to review the forms.
- **Ten images hot-link the live WordPress site** (`TODO(assets)` placeholders
  pointing at `jrotbart.com/wp-content/uploads/*`). They render, but the preview
  depends on the old site staying up and will appear as a referrer in its logs.

## Pre-existing bugs surfaced, not fixed

Fixing either would change production output and break the additive constraint.
Both deserve their own ticket.

- `public/og-default.jpg` does not exist, yet `BaseLayout.astro` makes it the
  `og:image` and `twitter:image` fallback for every page. Every share card on
  production points at a 404 today — so sharing the preview link in Slack or
  Teams will show no preview image either.
- `src/lib/schema.ts` emits a root-relative `thumbnailUrl` in its `VideoObject`
  nodes, where schema.org requires an absolute URL. The preview keeps these
  correct under a base path but does not fix the underlying bug.

## Teardown

```bash
rm -rf scripts/rebase-preview.mjs .github/workflows/preview.yml .github/PREVIEW.md
```

Then revert the hunks in `astro.config.mjs`, `src/layouts/BaseLayout.astro`,
`src/lib/schema.ts`, `src/pages/index.astro`, `src/pages/[slug].astro`,
`src/styles/global.css`, `package.json`, and the README section. Nothing else
knows the preview existed.
