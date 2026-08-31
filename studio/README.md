# J. Rotbart & Co. — content Studio

The admin interface for **blog posts**. Nothing else on the site is edited here:
homepage sections, services, products, offices, FAQ, navigation and footer live
in the site repo as typed modules and are changed by a developer.

## What editors can do

Create, edit, publish, unpublish and delete posts. Each post has a title, URL,
category, author, featured image, excerpt, body, optional PDF downloads, tags,
and its own SEO fields. Drafts, version history and rollback come with Sanity.

The body editor deliberately offers a **restricted** set of formatting —
headings, quotes, lists, bold, italic, links, images, video and callouts. There
is no raw-HTML field, which is what guarantees a published post cannot break the
design or bloat the page.

## First-time setup

You need a Sanity account. It is free for this usage; the project must be
created under **J. Rotbart & Co. ownership**, not an agency's.

```bash
cd studio
npm install
npx sanity login
npx sanity init --env
```

`sanity init` creates the project and writes `SANITY_STUDIO_PROJECT_ID` into
`studio/.env`. Copy that project ID into the **site's** `.env` as well:

```
PUBLIC_SANITY_PROJECT_ID=<the project id>
PUBLIC_SANITY_DATASET=production
```

Until that variable is set, the site builds against the seed posts in
`src/content/posts/seed.ts` — six real posts used as scaffolding. A missing CMS
never fails the build.

## Running and deploying

```bash
npm run dev      # http://localhost:3333
npm run deploy   # publishes to <projectId>.sanity.studio
```

**Put Cloudflare Access in front of the deployed Studio**, and connect Google
Workspace SSO for sign-in, so an unauthenticated request never reaches it and
nobody on this project ever creates, stores or resets a password.

## Seeding the categories

Four categories must exist before posts can be created. Their slugs drive real
archive URLs, so they must match exactly:

| Title | Slug | Archive URL |
| --- | --- | --- |
| Resources | `resources` | `/resources/` |
| News | `news` | `/news/` |
| Press | `press` | `/press/` |
| Events | `events` | `/events/` |

Adding a fifth category means adding a route, so it needs a developer.

## Publishing to the live site

The site is statically built, so a published post reaches production via a
rebuild (about 90 seconds). Set up a Sanity webhook pointing at the deploy hook
so publishing triggers it automatically — otherwise posts only appear on the
next deploy.

## Two things that are deliberate

**Slugs.** Changing a published post's URL breaks existing links and loses its
search ranking. Ask a developer to add a redirect first.

**Alt text is required** on every image. 71 of the 76 images on the old
homepage had none, which is both an accessibility failure and lost search
traffic.

## Exit plan

Sanity is the one piece of real vendor lock-in in this stack. It is bounded by a
scheduled export:

```bash
npx sanity dataset export production backup.tar.gz
```

Run this weekly into a bucket J. Rotbart owns. Restoring is one command.
