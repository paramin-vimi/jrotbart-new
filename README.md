# J. Rotbart & Co. — website

Rebuild of [jrotbart.com](https://jrotbart.com), moving off WordPress +
Elementor. **Phase 1 is the homepage.**

J. Rotbart & Co. is a physical precious-metals dealer with offices in Hong Kong,
Singapore, Manila and Tel Aviv.

## Running it

> **The default `node` on the original dev machine is v12, which will not run
> Astro.** If `npm run dev` fails immediately, check `node -v` first. Node 20+ is
> required; the project is developed on 24.

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run typecheck` | `astro check` — must pass before merging |
| `npm run build:preview` | The GitHub Pages team preview — see below |

## Stack

- **Astro**, static output. Every page is a real HTML file at the edge; the
  build ships **zero JavaScript bundles**.
- **Tailwind 4**, CSS-first config. Design tokens live in `src/styles/global.css`
  under `@theme` and map 1:1 to Figma Variables.
- **TypeScript strict**, with path aliases in `tsconfig.json`.
- **Cloudflare Workers** for the only server-side behaviour: spot prices, and
  later, redirects.
- **Sanity** for blog posts, and nothing else.

There is no client-side framework and no jQuery. Interactivity is small inline
scripts on the components that need it.

## How content works

**A page is an ordered list of typed blocks**, from the fixed union in
`src/content/types.ts`. There is no free-form page builder and no raw-HTML
field.

Everything except blog posts is a typed module in `src/content/`, edited by a
developer and reviewed in a pull request. Components take typed props and
contain **no copy** — if you find yourself typing a sentence into a `.astro`
file, it belongs in a content module.

`CLAUDE.md` has the full architecture notes, the rules that keep this
maintainable, and the design-source caveats (Figma layer names are stale; trust
the rendered pixels).

## Known gaps

Search the codebase for these markers — neither should survive launch:

- `TODO(client)` — content or a decision needed from the client
- `TODO(assets)` — an image still pointing at the old WordPress site

Also outstanding: the metals.dev API key serving production **must be rotated
before launch**, and there is no consent layer in front of the third-party
scripts, which is a launch blocker for an EU/UK/Israel audience.

## Sharing a preview (GitHub Pages)

A team-review copy of the site, published to GitHub Pages and kept out of search
results. **This is not the production deploy** — production is Cloudflare, at the
root of jrotbart.com. `npm run build` is unchanged and stays production-correct.

Full engineering detail, and the reasoning behind every non-obvious choice, is in
[`.github/PREVIEW.md`](.github/PREVIEW.md).

### Steps

1. **Create a new repository on GitHub.** Any name works — you are not locked in.
   The build asks GitHub at run time where the site will live and adapts, so
   `jrotbart-preview`, `new-site` or `you.github.io` are all fine, and renaming
   later self-corrects on the next run.
2. **Choose visibility**, knowing the caveats below. On a free plan the repo must
   be **Public** for Pages to work.
3. **Push the project to `main`**, including `.github/workflows/preview.yml` and
   `scripts/rebase-preview.mjs`.
4. **Turn Pages on — do this _before_ the first workflow run.** Repo →
   **Settings** → **Pages** (left sidebar) → under **Build and deployment**, set
   **Source** to **GitHub Actions** (not "Deploy from a branch"). Skipping this
   makes the first run fail with a confusing error, because the workflow asks
   GitHub for a Pages configuration that does not exist yet.
5. **Run the workflow.** It runs automatically on every push to `main`. To run it
   now: **Actions** tab → **Preview (GitHub Pages)** → **Run workflow**.
6. **Get the URL** from the finished run's `deploy` job, or from
   **Settings → Pages**. The first publish can take up to 10 minutes; later ones
   are quicker.
7. **Verify before sending the link to anyone** (about a minute). Open the
   preview, **View Page Source**, and check:
   - `<meta name="robots" content="noindex, follow">` is present, and there is
     **no** `index, follow` tag
   - `<link rel="canonical">` points at the **preview** URL, not jrotbart.com
   - the header logo and the press logos render — those are the canaries for the
     path rebasing
   - `/sitemap-index.xml` on the preview → should be **404**
   - `/robots.txt` → the preview version, with no `Sitemap:` line

**A nicer URL, later:** Settings → Pages → **Custom domain**, add e.g.
`preview.jrotbart.com`, and add a DNS `CNAME` record pointing `preview` at
`<owner>.github.io.` (the owner, *not* including the repo name). The site then
serves from a root and the build adapts automatically, with no code change. Do
**not** add a `public/CNAME` file — GitHub ignores it under this setup.

### What does NOT work on GitHub Pages

- **The spot-price ticker.** It will always read **"Spot prices unavailable."**
  The live prices come from a Cloudflare Worker (`workers/spot-price.ts`) at
  `/api/spot`, which cannot run on Pages. The page degrades to that message on
  purpose and nothing else breaks. Tell the team, or they will file it as a bug.
- **Roughly 27 links 404** (`/services/`, `/faq/`, `/open-account/`, …). Those
  pages are Phase 2; they 404 on a production build too.
- **News sections show 6 seed articles**, not live CMS content, unless the Sanity
  environment variables are added to the workflow's build step.
- **The forms and chat are live and wired to production accounts.** The b2blead
  contact form, newsletter and AI chat agent all work from the preview host — a
  colleague clicking around can submit a **real lead** into the client's CRM.
  Either tell the team not to submit anything, or gate those scripts behind the
  preview flag.

### Caveats you need to accept knowingly

- **The preview will be publicly readable.** GitHub is explicit: Pages sites
  "are publicly available on the internet, even if the repository for the site is
  private." A paid plan (Pro/Team) buys a private **repo**, not a private
  **site**; an actually access-controlled Pages site requires an organization on
  GitHub Enterprise Cloud. On a free plan the repo is public too, so the
  unreleased redesign, the third-party form and app IDs, and every `TODO(client)`
  note in `src/content/` become world-readable. If the client needs this
  genuinely unreachable, GitHub Pages is the wrong host.
- **"Not in search results" is not "private."** `noindex` is a directive that
  Google and Bing honour. AI scrapers, archive.org and competitor crawlers
  frequently do not, and robots.txt does not constrain them either.
- **"noindex in robots.txt" is not a thing.** robots.txt has had no `noindex`
  directive since Google dropped support on 1 September 2019, and on a
  project-site URL the file sits in a subdirectory where no crawler reads it. The
  preview therefore **allows** crawling and puts `noindex` in each page's markup,
  which is the only mechanism that actually works. Adding `Disallow: /` would
  make indexing *more* likely, not less — the crawler would never fetch the page
  and so never see the `noindex`. There is a comment block at the top of the
  preview robots.txt explaining this; please read it before "fixing" that file.
