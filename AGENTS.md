# J. Rotbart & Co. — website

Rebuild of jrotbart.com, moving off WordPress + Elementor. Phase 1 is the homepage.

## Running it

The default `node` on this machine is **v12, which will not run Astro**. Use the nvm build:

```bash
export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run typecheck` | `astro check` — must pass before merging |

## Stack

- **Astro 7**, static output. Every page is a real HTML file at the edge.
- **Tailwind 4**, CSS-first config. Tokens live in `src/styles/global.css` under `@theme`.
- **TypeScript strict**, path aliases in `tsconfig.json` (`@primitives/*`, `@sections/*`, `@content/*`, `@lib/*`).
- **Cloudflare Workers** for the only two pieces of server-side behaviour: spot prices and (later) redirects.

There is no client-side framework and no jQuery. Interactivity is small inline scripts on the components that need it.

## Architecture

```
src/
  content/          Typed page content, edited by a developer and version
                    controlled. This is NOT CMS-managed — the CMS is scoped to
                    blog posts only.
    types.ts        The fixed union of section block types. Read this first.
    offices.ts      Referenced documents (offices are used in 3 places)
    navigation.ts   Global nav
    homepage/       One module per homepage section
    posts/seed.ts   Fallback posts, used only until Sanity is connected
  components/
    primitives/     Button, ArrowLink, Overline, SectionHeader, Container,
                    VideoFacade. Everything composes from these.
    sections/       One component per section block type
  layouts/          BaseLayout — head, SEO, JSON-LD, skip link
  lib/schema.ts     Structured data built from the same documents that render
  styles/global.css Design tokens + base layer
  lib/posts.ts      The post data layer. Every route reads posts through this,
                    never the Sanity client directly.
workers/            Cloudflare Workers (spot-price)
studio/             Sanity Studio — blog posts ONLY. See studio/README.md.
```

## What the CMS manages

**Blog posts, and nothing else.** Posts, categories, authors, tags and post
downloads live in Sanity. Every other piece of content on the site is a typed
module in `src/content/`, edited by a developer and reviewed in a pull request.

The homepage's news grid is the only CMS-backed section on the homepage. It
shows the three most recent posts, unless one is pinned with the post's
"Feature on the homepage" flag.

### Rules that keep this maintainable

1. **Components never contain copy.** Content lives in `src/content/`; components take typed props. If you find yourself typing a sentence into a `.astro` file, it belongs in a content module.
2. **No raw hex colours.** Only the tokens in `@theme`, which map 1:1 to Figma Variables. If the design needs a colour that isn't there, that's a design conversation, not a CSS one.
3. **No raw-HTML content field, ever.** The moment editors can paste HTML, every guarantee about the design holding is void.
4. **A page is an ordered list of blocks** from the union in `types.ts`. There is no free-form page builder.
5. **Alt text is required** on every image type. Decorative images set `decorative: true`, which renders `alt=""` + `aria-hidden`.

## Design source

Figma file `MkPRW1BKlldItk3pnHgcW3`, page **New Website**, homepage frame **`9813:5482`** (1366×15867).

Two things to know about that file:

- **Layer names are stale.** They do not match rendered text. Trust the rendered pixels.
- **There is no mobile design.** Responsive behaviour is ours to design, and every non-obvious decision is commented in the component that makes it. Those comments are review requests, not documentation.

## Known gaps

Search the codebase for these markers:

- `TODO(client)` — content or a decision we need from J. Rotbart
- `TODO(assets)` — an image still pointing at the old WordPress site pending a Figma export

Neither should survive to launch.
