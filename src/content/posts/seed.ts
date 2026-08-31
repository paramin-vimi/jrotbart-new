import type { Post, PostCategory, PostAuthor, PortableTextBlock } from "@lib/posts";

/**
 * Seed posts.
 *
 * PURPOSE: this is scaffolding, not content. It exists so the site builds,
 * renders and can be reviewed before the Sanity project is connected. The
 * moment `PUBLIC_SANITY_PROJECT_ID` is set, real posts replace all of this and
 * none of it is shipped.
 *
 * The titles, dates, categories, excerpts and URLs below are the real six most
 * recent posts from jrotbart.com as of 2026-08-30, so the templates are being
 * exercised against realistic content lengths rather than invented copy.
 *
 * TODO(assets): featured images point at the live WordPress site. They are
 * 1080x1350 PNGs weighing 1.2–2.3MB each — which is exactly the problem the
 * rebuild fixes. Once posts come from Sanity, its CDN serves AVIF/WebP at the
 * right size automatically.
 */

// ---------------------------------------------------------------------------
// Categories — the four real ones. Counts across the 463 live posts:
// Resources 193 · Press 122 · Events 84 · News 64. No post has two categories.
// ---------------------------------------------------------------------------

export const seedCategories: PostCategory[] = [
  {
    title: "Resources",
    slug: "resources",
    description:
      "Guides and analysis on owning, storing and shipping physical precious metals.",
  },
  {
    title: "News",
    slug: "news",
    description: "Market updates and announcements from J. Rotbart & Co.",
  },
  {
    title: "Press",
    slug: "press",
    description: "J. Rotbart & Co. in the media.",
  },
  {
    title: "Events",
    slug: "events",
    description: "Conferences, forums and speaking engagements.",
  },
];

const byId = (slug: string) => seedCategories.find((c) => c.slug === slug)!;

// ---------------------------------------------------------------------------
// Authors — real display names recovered from the WordPress REST API.
// TODO(client): these are login slugs, not real names. The user endpoint is
// locked (401), so full names, roles and bios must come from you.
// ---------------------------------------------------------------------------

const authors: Record<string, PostAuthor> = {
  natpawena: { name: "Natpawena", slug: "natpawena", role: "Research" },
  zarzar: { name: "Zarzar", slug: "zarzar", role: "Market Analysis" },
};

/** Minimal Portable Text so the post template renders something real. */
const para = (text: string, key: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

const heading = (text: string, key: string): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style: "h2",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

const UPLOADS = "https://jrotbart.com/wp-content/uploads";

export const seedPosts: Post[] = [
  {
    _id: "seed-golden-minutes-aug-2026",
    title: "J. Rotbart & Co. Golden Minutes | Aug, 2026",
    slug: "j-rotbart-co-golden-minutes-aug-2026",
    category: byId("news"),
    author: authors.zarzar,
    publishedAt: "2026-08-28T00:00:00.000Z",
    excerpt:
      "August 2026 was a breakout month for precious metals, as concerns over U.S. government debt, expanded Treasury bond buybacks and a weaker dollar supported a broad move into hard assets.",
    featuredImage: {
      src: `${UPLOADS}/2026/08/Quarterly-Q1-2026-4.png`,
      alt: "J. Rotbart & Co. Golden Minutes report cover for August 2026",
      width: 1080,
      height: 1350,
    },
    body: [
      para(
        "August 2026 was a breakout month for precious metals, as concerns over U.S. government debt, expanded Treasury bond buybacks and a weaker dollar supported a broad move into hard assets.",
        "b1"
      ),
      heading("Market summary", "b2"),
      para(
        "Gold tested two-month highs while silver, platinum and palladium each traded in step with industrial demand expectations.",
        "b3"
      ),
    ],
    downloads: [],
    tags: ["gold", "market update"],
    featured: false,
    noindex: false,
  },
  {
    _id: "seed-rthk-h2-outlook",
    title: "Precious Metals H2 2026 Outlook: Lakhwinder on RTHK Money Talk",
    slug: "precious-metals-outlook-h2-2026-lakhwinder-rthk",
    category: byId("press"),
    author: authors.natpawena,
    publishedAt: "2026-08-27T00:00:00.000Z",
    excerpt:
      "Gold recently tested two-month highs above $4,400, but silver, platinum and palladium tell a more complicated story. Lakhwinder joins RTHK Money Talk to explain.",
    featuredImage: {
      src: `${UPLOADS}/2026/08/RTHK-Lakhwinder-Singh.png`,
      alt: "Lakhwinder Singh speaking on RTHK Money Talk about the precious metals outlook",
      width: 1080,
      height: 1350,
    },
    body: [
      para(
        "Gold recently tested two-month highs above $4,400, but silver, platinum and palladium tell a more complicated story.",
        "b1"
      ),
    ],
    downloads: [],
    tags: ["press", "gold"],
    featured: false,
    noindex: false,
  },
  {
    _id: "seed-asian-families-gold",
    title: "Why Asian Families Hold Physical Gold Across Generations",
    slug: "why-asian-families-hold-physical-gold",
    category: byId("resources"),
    author: authors.natpawena,
    publishedAt: "2026-08-26T00:00:00.000Z",
    excerpt:
      "Discover why Asian high-net-worth families allocate 10%–25% of their net worth to physical gold, and how that allocation passes between generations.",
    featuredImage: {
      src: `${UPLOADS}/2026/08/Asian-Family-Wealth-Physical-Gold-Preservation.png`,
      alt: "Three generations of an Asian family, illustrating gold as intergenerational wealth",
      width: 1080,
      height: 1350,
    },
    body: [
      para(
        "Across Hong Kong, Singapore and the wider region, physical gold is rarely a trade. It is a store of value handed down, and the allocation decisions behind it look very different from a Western portfolio.",
        "b1"
      ),
      heading("Allocation in practice", "b2"),
      para(
        "Families we work with typically hold between 10% and 25% of net worth in physical metal, held outside the banking system and outside their home jurisdiction.",
        "b3"
      ),
    ],
    downloads: [],
    tags: ["gold", "wealth preservation", "hong kong"],
    featured: true,
    noindex: false,
  },
  {
    _id: "seed-paper-vs-physical-silver",
    title: "Why Paper Silver and Physical Silver Are No Longer the Same Thing",
    slug: "paper-silver-vs-physical-silver",
    category: byId("resources"),
    author: authors.natpawena,
    publishedAt: "2026-08-24T00:00:00.000Z",
    excerpt:
      "Paper silver and physical silver may track the same headline price, but they are not the same asset. The gap matters most exactly when you need it to be small.",
    featuredImage: {
      src: `${UPLOADS}/2026/08/paper-silver-vs-physical-silver-feature-image.png`,
      alt: "Physical silver bars beside a silver price chart, contrasting paper and physical silver",
      width: 1080,
      height: 1350,
    },
    body: [
      para(
        "Paper silver and physical silver may track the same headline price, but they are not the same asset.",
        "b1"
      ),
    ],
    downloads: [],
    tags: ["silver"],
    featured: false,
    noindex: false,
  },
  {
    _id: "seed-hong-kong-gold-hub",
    title: "Hong Kong as a Global Gold Trading Hub",
    slug: "hong-kong-gold-trading-hub",
    category: byId("news"),
    author: authors.natpawena,
    publishedAt: "2026-08-10T00:00:00.000Z",
    excerpt:
      "Hong Kong's role in the global bullion trade rests on free-port status, deep vaulting capacity and proximity to the largest physical demand centres in the world.",
    featuredImage: {
      src: `${UPLOADS}/2026/06/jrt-img-header.png`,
      alt: "The J. Rotbart & Co. team at the firm's Hong Kong office",
      width: 900,
      height: 514,
    },
    body: [
      para(
        "Hong Kong's role in the global bullion trade rests on three things: free-port status, deep vaulting capacity, and proximity to the largest physical demand centres in the world.",
        "b1"
      ),
    ],
    downloads: [],
    tags: ["hong kong", "gold"],
    featured: false,
    noindex: false,
  },
  {
    _id: "seed-family-office-precious-metals",
    title: "How Family Offices Approach Precious Metals Allocation",
    slug: "family-office-precious-metals",
    category: byId("resources"),
    author: authors.natpawena,
    publishedAt: "2026-07-29T00:00:00.000Z",
    excerpt:
      "For family offices, precious metals sit outside the usual risk framework. Here is how allocation, custody and jurisdiction decisions are made in practice.",
    featuredImage: {
      src: `${UPLOADS}/2025/03/home_service2.png`,
      alt: "Secure vault storage for allocated precious metals",
      width: 584,
      height: 384,
    },
    body: [
      para(
        "For family offices, precious metals sit outside the usual risk framework: the point is not return, it is that the asset has no counterparty.",
        "b1"
      ),
    ],
    downloads: [],
    tags: ["wealth preservation", "gold"],
    featured: false,
    noindex: false,
  },
];
