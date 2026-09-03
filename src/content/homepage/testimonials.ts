import type { Article, SocialFeedBlock } from "../types";

/**
 * Homepage content — the "Latest Updates" LinkedIn feed (Figma "Product",
 * node 9813:5910).
 *
 * The two testimonial documents and their bands (Figma "Featured", nodes
 * 10369:8974 and 10369:8987) used to live here. They are drawn on every page
 * frame, so they moved to the site-wide module `src/content/testimonials.ts`;
 * import `testimonialOne` / `testimonialTwo` from there.
 *
 * Source: the four feed cards in Figma are a flat screenshot of the live
 * site's Elfsight LinkedIn widget (app 9468f01e-fe66-439f-89e9-5e7b7d0508f6)
 * with zero text layers. The copy below was read out of that raster and
 * tidied into title/excerpt pairs — it is seed content, not final copy.
 *
 * Everything that still needs a decision from the client is marked
 * TODO(client); every interim image URL is marked TODO(assets).
 */

// ---------------------------------------------------------------------------
// "Latest Updates" — LinkedIn feed
// ---------------------------------------------------------------------------

/**
 * Feed items.
 *
 * `date` drives the relative "N days ago" label that SocialFeed renders, so
 * these are stored as real ISO datestamps rather than pre-formatted strings.
 * They are anchored to the Figma capture (3/4/5/6 days ago) and will be
 * replaced wholesale once the feed is sourced from LinkedIn at build time.
 *
 * `category` is required by the Article type but is NOT rendered in this
 * section — the Figma cards show only a relative timestamp.
 *
 * TODO(client): Figma draws THREE pagination dots, i.e. 12 posts at 4 per
 * page. Only four seed posts exist here, so at desktop the feed fills exactly
 * one page and SocialFeed hides the dots (a lone dot is not an affordance).
 * The dots reappear as soon as the feed carries more than one page's worth —
 * either supply ~12 posts or confirm that four is the intended length.
 */
const feedItems: Article[] = [
  {
    _id: "li-1000oz-heraeus-silver-hk",
    title: "Hong Kong Exclusive: ~1000oz Heraeus Silver Bars Now Available",
    category: "News",
    date: "2026-08-27",
    excerpt:
      "Large-format Heraeus silver bars are now held in Hong Kong. Limited availability, Hong Kong only — discover full details and reserve yours.",
    image: {
      // TODO(assets): replace with the real LinkedIn post artwork / Figma export.
      src: "https://jrotbart.com/wp-content/uploads/2026/04/1000-oz-silver-bars-2.png",
      alt: "Stacked ~1000 ounce Heraeus silver bars available in Hong Kong.",
      width: 1080,
      height: 1080,
    },
    // TODO(client): permalink for this individual LinkedIn post.
    href: "https://hk.linkedin.com/company/j.rotbart-&-co",
  },
  {
    _id: "li-nomad-capitalist-live-2026",
    title: "Joshua Rotbart is speaking at Nomad Capitalist Live 2026",
    category: "Event",
    date: "2026-08-26",
    excerpt:
      "We are pleased to announce that our Founder, Joshua Rotbart, will be speaking at Nomad Capitalist Live 2026 in Cancún.",
    image: {
      // TODO(assets): the Cancún event artwork has no equivalent on the live
      // site. Interim: a portrait of Joshua Rotbart. Replace with the real post image.
      src: "https://jrotbart.com/wp-content/uploads/2026/02/Bloomberg-10-year-Joshua-6.jpg",
      alt: "Joshua Rotbart, Founder of J. Rotbart & Co.",
      width: 1080,
      height: 1080,
    },
    // TODO(client): permalink for this individual LinkedIn post.
    href: "https://hk.linkedin.com/company/j.rotbart-&-co",
  },
  {
    _id: "li-world-book-day-2026",
    title: "Learning Builds Wealth. Strategy Protects It.",
    category: "News",
    date: "2026-08-25",
    excerpt:
      "On World Book Day we celebrate learning. Great legacies are built on knowledge and protected by what endures — invest in both: ideas that inspire, assets that preserve.",
    image: {
      // TODO(assets): the World Book Day artwork has no equivalent on the live
      // site. Interim: the 10-years anniversary key visual.
      src: "https://jrotbart.com/wp-content/uploads/2026/01/header-10-year-invitation-email-002-1.jpg",
      alt: "J. Rotbart & Co. ten year anniversary key visual.",
      width: 1080,
      height: 1080,
    },
    // TODO(client): permalink for this individual LinkedIn post.
    href: "https://hk.linkedin.com/company/j.rotbart-&-co",
  },
  {
    _id: "li-jeremy-beh-loomis",
    title: "A message from Jeremy Beh, Loomis",
    category: "News",
    date: "2026-08-24",
    excerpt:
      "“Personally, I knew Joshua for more than 25 years. With his years of hands-on experience, you and your team have built a strong reputation in the industry and also a deep understanding of the precious metal market.” We are honoured to receive this message as we celebrate 10 years.",
    image: {
      // TODO(assets): replace with the real LinkedIn post artwork. The Figma
      // feed is one flat raster of the Elfsight widget, so the per-card
      // artwork could not be exported. Interim: the live site's testimonial
      // still, which shows ALBERT CHENG, not Jeremy Beh — the alt below
      // describes what is actually on screen rather than the post it
      // illustrates. Both must change together when the real image lands.
      src: "https://jrotbart.com/wp-content/uploads/2026/04/testimonials.jpg",
      alt: "Albert Cheng, CEO of the Singapore Bullion Market Association, recording a video testimonial for J. Rotbart & Co. in front of an SBMA backdrop.",
      width: 1080,
      height: 1080,
    },
    // TODO(client): permalink for this individual LinkedIn post. The Figma
    // raster shows a truncated lnkd.in short link, so it cannot be recovered.
    href: "https://hk.linkedin.com/company/j.rotbart-&-co",
  },
];

/**
 * Section block.
 *
 * `header.headingAccent` is the run WITHIN `header.heading` that SocialFeed
 * sets in Playfair italic / text-tertiary — Figma sets "Investment" in the
 * middle of the line, which the shared SectionHeader primitive cannot express
 * (it only appends an accent after the heading). See the note in SocialFeed.astro.
 *
 * TODO(client): the live site's heading reads "Smarter Investing Starts Here".
 * Figma changed it to "Investment". Confirm which is correct.
 */
export const socialFeed: SocialFeedBlock = {
  _key: "latest-updates",
  _type: "socialFeed",
  anchorId: "latest-updates",
  theme: "light",
  header: {
    overline: "Latest Updates",
    heading: "Smarter Investment Starts Here",
    headingAccent: "Investment",
  },
  items: feedItems,
};

/**
 * Carousel chrome labels.
 *
 * `SocialFeedBlock` has no field for control labels, and types.ts is owned by
 * another workstream, so these live beside the block rather than inside it.
 * SocialFeed.astro falls back to the same English defaults when they are not
 * passed, so the page renders correctly either way; spread this object onto
 * the component to make the strings translatable.
 *
 * Only two labels remain: Figma draws pagination dots and nothing else, so the
 * prev/next arrows and the play/pause toggle — and the autorotation that made
 * a pause control necessary — were removed from the component.
 */
export const socialFeedControls = {
  readMoreLabel: "Read more",
  /** "%s" is replaced with the 1-based page number. */
  pageLabel: "Go to page %s",
} as const;
