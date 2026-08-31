import type { Article, SocialFeedBlock, Testimonial, TestimonialBandBlock } from "../types";

/**
 * Homepage content — the two dark-red testimonial bands (Figma "Featured",
 * nodes 10369:8974 and 10369:8987) and the "Latest Updates" LinkedIn feed
 * (Figma "Product", node 9813:5910).
 *
 * Sources
 *  - Testimonial quotes, names, organisations and video IDs are VERBATIM
 *    from the current live homepage (jrotbart.com, captured 2026-08-30). The
 *    Figma renders the same two quotes, so nothing here is invented and
 *    nothing is lorem. The two portraits are the Figma exports of the
 *    320x320 video cards (nodes I10369:8974 and I10369:8987).
 *  - The four feed cards in Figma are a flat screenshot of the live site's
 *    Elfsight LinkedIn widget (app 9468f01e-fe66-439f-89e9-5e7b7d0508f6) with
 *    zero text layers. The copy below was read out of that raster and tidied
 *    into title/excerpt pairs — it is seed content, not final copy.
 *
 * Everything that still needs a decision from the client is marked
 * TODO(client); every interim image URL is marked TODO(assets).
 */

// ---------------------------------------------------------------------------
// Testimonials (referenced documents — reused by the schema layer)
// ---------------------------------------------------------------------------

const albertCheng: Testimonial = {
  _id: "albert-cheng-sbma",
  // Live site renders three author line-breaks here; Figma renders one
  // paragraph that wraps naturally to four lines at the 758px measure.
  // Figma wins — hard breaks at authored positions do not survive a
  // narrower measure.
  quote:
    "Since joining the Singapore Bullion Market Association in 2017, J. Rotbart & Co. has been an invaluable part of our community. Congratulations on your 10th anniversary. A remarkable milestone reflecting the trust you have built with high net worth clients worldwide.",
  name: "Albert Cheng",
  organisation: "SBMA",
  portrait: {
    src: "/figma/frame-1686562793--I10369-8974_10369-8854.webp",
    alt: "Albert Cheng, CEO of the Singapore Bullion Market Association, photographed against a background of gold bars, beside the J. Rotbart & Co. 10 years lockup.",
    width: 320,
    height: 320,
  },
  video: {
    youtubeId: "DskL_tMoXIk",
    // Portrait Short — the lightbox sizes itself from this.
    aspect: "9/16",
    // TODO(client): confirm this against the real YouTube title — it is used
    // verbatim in the VideoObject structured data.
    title: "Albert Cheng, SBMA, on ten years of J. Rotbart & Co.",
    poster: {
      src: "/figma/frame-1686562793--I10369-8974_10369-8854.webp",
      alt: "Albert Cheng, CEO of the Singapore Bullion Market Association, photographed against a background of gold bars.",
      width: 320,
      height: 320,
    },
  },
};

const euKim: Testimonial = {
  _id: "eu-kim-alvarez-marsal",
  // The newline is authored — Figma shows an explicit break after "years."
  // TestimonialBand preserves it as a real <br>.
  quote:
    "Congratulations to J. Rotbart & Co. on 10 remarkable years.\nA testament to your excellence, integrity, and the incredible team; including Joshua, Lakh, Marco, and Elly.",
  name: "Eu Kim",
  // TODO(client): the Figma spec transcribes this band's attribution as
  // "EU KIM, ALVAREZ AND MARSAL" (comma) while the SBMA band is
  // "ALBERT CHENG - SBMA" (hyphen). TestimonialBand renders one separator for
  // both — a hyphen, matching the band that was measured verbatim. Confirm
  // whether the second band really uses a comma; if so the separator has to
  // become a per-testimonial field in types.ts.
  organisation: "Alvarez and Marsal",
  portrait: {
    src: "/figma/frame-1686562793--I10369-8987_10369-8854.webp",
    alt: "Eu Kim of Alvarez and Marsal, photographed against a background of gold bars, beside the J. Rotbart & Co. 10 years lockup.",
    width: 320,
    height: 320,
  },
  video: {
    youtubeId: "XLSnajMWpno",
    // Portrait Short — the lightbox sizes itself from this.
    aspect: "9/16",
    // TODO(client): confirm against the real YouTube title.
    title: "Eu Kim, Alvarez and Marsal, on ten years of J. Rotbart & Co.",
    poster: {
      src: "/figma/frame-1686562793--I10369-8987_10369-8854.webp",
      alt: "Eu Kim of Alvarez and Marsal, photographed against a background of gold bars.",
      width: 320,
      height: 320,
    },
  },
};

// ---------------------------------------------------------------------------
// Testimonial bands — the same component, two instances, different content
// ---------------------------------------------------------------------------

/** First band. Figma 10369:8974, sits directly under the product grid. */
export const testimonialOne: TestimonialBandBlock = {
  _key: "testimonial-sbma",
  _type: "testimonialBand",
  theme: "dark",
  testimonial: albertCheng,
};

/** Second band. Figma 10369:8987 — identical component, different content. */
export const testimonialTwo: TestimonialBandBlock = {
  _key: "testimonial-alvarez-marsal",
  _type: "testimonialBand",
  theme: "dark",
  testimonial: euKim,
};

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
