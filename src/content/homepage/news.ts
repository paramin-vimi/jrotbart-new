/**
 * Homepage content — Open-an-Account CTA band (Figma 9813:6123) and the
 * "Precious Metals News and Media" editorial hub (Figma 9813:6137).
 *
 * Source of truth for copy:
 *   - Headings, eyebrow and intro are transcribed verbatim from the Figma comp.
 *   - Everything the comp left as lorem ipsum (article excerpts, video titles,
 *     dates, imagery) is replaced with the real equivalents from the live
 *     WordPress site so nothing placeholder ships.
 *
 * Assets: the CTA band's three certification badges and the four video posters
 * are the Figma exports in public/figma/. The three article images below are
 * never rendered — src/pages/index.astro replaces this block's `articles` with
 * live posts from the CMS — so they still point at the live site's uploads
 * directory and remain marked TODO(assets).
 */

import type {
  Article,
  CtaBandBlock,
  CtaStyle,
  NewsGridBlock,
  VideoGridBlock,
} from "@content/types";

// ---------------------------------------------------------------------------
// SECTION A — Open an account (Figma 9813:6123)
// ---------------------------------------------------------------------------

/*
 * TODO(client): three copy/route questions on this band.
 *   1. "Open An Account online" — mixed casing is in both the comp and the live
 *      site. Kept verbatim rather than silently corrected.
 *   2. "We help customer buy gold…" — singular "customer" with no article is in
 *      both the comp and the live site. Kept verbatim; confirm the fix.
 *   3. /register/, /log-in/ and /download-open-account/ are WooCommerce
 *      endpoints today. Confirm they survive the WordPress → Astro migration
 *      before launch, including the ?redirect= parameter on the login link.
 */
export const ctaBand: CtaBandBlock = {
  _key: "home-cta-open-account",
  _type: "ctaBand",
  anchorId: "open-an-account",
  theme: "tinted",

  heading: "Open An Account online",
  body:
    "We help customer buy gold, silver, platinum or palladium as well as sell, " +
    "store and transport their precious metals. We are experts at securing " +
    "assets in offshore jurisdictions.",

  cta: {
    label: "Get Started",
    href: "/register/",
    style: "solid" satisfies CtaStyle,
  },

  helperLinks: [
    {
      prefix: "Already have an account?",
      link: { label: "Login", href: "/log-in/?redirect=https://jrotbart.com/kyc/" },
    },
    {
      prefix: "Prefer working offline? Download the form",
      // TODO(client): confirm whether this serves a PDF directly. If it does,
      // the link needs a type/size affordance and a `download` attribute.
      link: { label: "here", href: "/download-open-account/" },
    },
  ],

  badgeLabel: "Certified by:",

  /*
   * Display box (`width`/`height`) is the Figma geometry, not the file's
   * intrinsic size — the component sizes each badge from these numbers so a
   * new badge slots in without touching CSS.
   */
  badges: [
    {
      name: "Singapore Bullion Market Association",
      image: {
        src: "/figma/image-177--9813-6134.webp",
        alt: "Singapore Bullion Market Association",
        width: 120,
        height: 80,
      },
    },
    {
      name: "JGAHK",
      image: {
        src: "/figma/image-169--9813-6135.webp",
        // TODO(client): supply the association's full legal name for the alt
        // text. The mark reads "JGAHK"; the rim characters are not legible at
        // any resolution available to us, and the live alt is empty.
        alt: "JGAHK member seal",
        width: 64,
        height: 64,
      },
    },
    {
      name: "Certification seal — issuer to be confirmed",
      image: {
        src: "/figma/image-170--9813-6136.webp",
        // TODO(client): BLOCKING — we cannot identify the issuing body of this
        // seal from the Figma raster, the filename or the live markup (alt is
        // empty). Supply the name, or drop the badge. An unattributable trust
        // mark is worse than no trust mark.
        alt: "Third-party certification seal",
        width: 64,
        height: 64,
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// SECTION B, block 1 — Precious Metals News and Media (Figma 9813:6137)
// ---------------------------------------------------------------------------

/*
 * Taxonomy note. The comp shows a BLOG / PRESS / EVENT triptych. The live
 * WordPress categories are Resources (193), Press (122), Events (84) and
 * News (64). Mapping used here: Resources → "Blog", Press → "Press",
 * Events → "Event". The live "News" category has no slot in a 3-up designed
 * around three named categories.
 * TODO(client): confirm this mapping, and confirm whether "News" should
 * displace one of the three or be folded into "Blog".
 *
 * Because the design is a curated one-per-category triptych rather than a
 * straight "latest 3", `source` is "manual" and the order follows the comp
 * (Blog, Press, Event) rather than pure date-descending.
 *
 * BUG — the mapping above is written down but never applied, so the homepage
 * does not match the comp. src/pages/index.astro replaces this block's
 * `articles` with live posts, and `toArticle()` in src/lib/posts.ts passes
 * `post.category.title` straight through: the cards currently render
 * "Resources", "News" and "Press" where the comp draws BLOG / PRESS / EVENT.
 * The fix belongs in the post layer (a display-name map on ArticleCategory),
 * not in NewsGrid.astro — a component must not carry the copy. Neither file is
 * in this pass's scope; flagged here so the mapping is not lost.
 */

/**
 * Excerpts are each post's published meta description. The live homepage cards
 * render a word-count truncation that stops mid-sentence ("…hard assets.
 * Gold…"), which is not shippable copy.
 * TODO(client): confirm the CMS gets a dedicated card-excerpt field rather than
 * reusing the SEO description.
 */
const articles: Article[] = [
  {
    _id: "why-asian-families-hold-physical-gold",
    title: "Why Asian Families Hold Physical Gold Across Generations",
    category: "Blog",
    date: "2026-08-26",
    excerpt:
      "Discover how physical gold in Asian family wealth secures multi-generational " +
      "assets, counters currency debasement, and anchors long-term portfolios.",
    image: {
      // TODO(assets): replace with Figma export. This is a 4:5 social card with
      // typography baked in — see the note in the component.
      src:
        "https://jrotbart.com/wp-content/uploads/2026/08/" +
        "Asian-Family-Wealth-Physical-Gold-Preservation-768x960.png",
      alt: "Gloved hands lifting a cast gold bar from a stack of bars",
      width: 768,
      height: 960,
    },
    href: "/why-asian-families-hold-physical-gold/",
  },
  {
    _id: "precious-metals-outlook-h2-2026-lakhwinder-rthk",
    title: "Precious Metals H2 2026 Outlook: Lakhwinder on RTHK Money Talk",
    category: "Press",
    date: "2026-08-27",
    excerpt:
      "Sales Manager Lakhwinder decodes gold's peak above $4,400, silver's sixth " +
      "supply deficit, and strategic H2 allocation on RTHK Money Talk.",
    image: {
      // TODO(assets): replace with Figma export.
      src:
        "https://jrotbart.com/wp-content/uploads/2026/08/RTHK-Lakhwinder-Singh-768x960.png",
      alt: "Lakhwinder Singh of J. Rotbart & Co., photographed for his RTHK Money Talk interview",
      width: 768,
      height: 960,
    },
    href: "/precious-metals-outlook-h2-2026-lakhwinder-rthk/",
  },
  {
    _id: "beyond-borders-breakfast-dubai-2026",
    title: "J. Rotbart & Co. Co-Hosts Beyond Borders Breakfast with Multipolitan in Dubai",
    category: "Event",
    date: "2026-07-28",
    excerpt:
      "J. Rotbart & Co. partnered with Multipolitan to co-host the Beyond Borders " +
      "Breakfast in Dubai, bringing together entrepreneurs, investors and globally " +
      "minded professionals.",
    image: {
      // TODO(assets): replace with Figma export.
      src:
        "https://jrotbart.com/wp-content/uploads/2026/07/" +
        "Beyond-Borders-Breakfast-Multipolitan-Dubai-768x960.png",
      alt: "Guests and the J. Rotbart & Co. team gathered at the Beyond Borders Breakfast in Dubai",
      width: 768,
      height: 960,
    },
    href: "/beyond-borders-breakfast-dubai-2026/",
  },
];

export const newsGrid: NewsGridBlock = {
  _key: "home-news-grid",
  _type: "newsGrid",
  anchorId: "news-and-media",

  header: {
    overline: "Perspectives on global wealth",
    heading: "Precious Metals",
    headingAccent: "News and Media.",
    body:
      "Latest analysis and commentary from J. Rotbart & Co. on buying bullion, on " +
      "refinery selection, on market structure, and on the questions that come up " +
      "before a transaction. Updated as new pieces are published.",
  },

  source: "manual",
  limit: 3,
  articles,
};

/**
 * The per-card "READ MORE" affordance.
 *
 * `NewsGridBlock` has no field for it (see the report), and rule 10 forbids
 * hardcoding copy inside a component, so it lives here and is passed to
 * `NewsGrid.astro` as a prop.
 * TODO: add `cardCtaLabel?: string` to `NewsGridBlock` in src/content/types.ts
 * and fold this constant into `newsGrid`.
 */
export const newsCardCtaLabel = "Read more";

// ---------------------------------------------------------------------------
// SECTION B, block 2 — More in Video (Figma 9813:6191)
// ---------------------------------------------------------------------------

/*
 * The comp repeats one placeholder title across all four cards. These are the
 * four real videos and posters currently promoted on the live homepage.
 *
 * TODO(client): three things before launch.
 *   1. Video 1's title reads "Films Inside a Private Vaults" and video 4's
 *      reads "J.Rotbart" with no space. Both are live verbatim — confirm the
 *      corrections rather than us making them silently.
 *   2. Video 3 is 2022 content about the invasion of Ukraine, still promoted on
 *      the homepage in 2026. Confirm it should stay.
 *   3. Titles here run to 79 characters against the comp's 47-character
 *      placeholder. The red band is designed for three lines; see the
 *      component for how overflow is handled, and consider a ~60-character
 *      editorial cap on this field.
 */
export const videoGrid: VideoGridBlock = {
  _key: "home-video-grid",
  _type: "videoGrid",

  header: {
    heading: "More in",
    headingAccent: "Video",
    cta: {
      label: "Explore",
      href: "/blogs-events-press/",
      style: "arrow" satisfies CtaStyle,
    },
  },

  videos: [
    {
      youtubeId: "2clyjT7JabU",
      title: "A gold bar's journey - J. Rotbart & Co. Films Inside a Private Vaults",
      poster: {
        src: "/figma/frame-466--9889-22718.webp",
        alt: "Close-up of Canadian Gold Maple Leaf bullion coins",
        width: 270,
        height: 382,
      },
    },
    {
      youtubeId: "-PvzlkZpnZg",
      title: "A Decade of Trust, Growth & Gratitude | 10-Year Anniversary",
      poster: {
        src: "/figma/frame-466--9889-22710.webp",
        alt:
          "Joshua Rotbart, Managing Partner of J. Rotbart & Co., speaking to " +
          "camera in front of a branded backdrop",
        width: 270,
        height: 382,
      },
    },
    {
      youtubeId: "uWSAamtaZcw",
      title:
        "GOLD reaches HIGHS amidst Russia's invasion of Ukraine | What factors caused this?",
      poster: {
        src: "/figma/frame-466--9889-22694.webp",
        alt: "Joshua Rotbart holding a cast gold bar beside an open vault door",
        width: 270,
        height: 382,
      },
    },
    {
      youtubeId: "taVqKNtvH_U",
      title: "Introduction to J.Rotbart & Co",
      poster: {
        src: "/figma/frame-466--9889-22702.webp",
        alt: "Joshua Rotbart during a television interview about the gold price",
        width: 270,
        height: 382,
      },
    },
  ],
};
